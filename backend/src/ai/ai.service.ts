import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CohereClientV2 } from 'cohere-ai';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { RagChunk } from '../rag/rag.service';

const FALLBACK_ANSWER =
  "I don't have enough information in the provided company knowledge base to answer that.";
const MAX_HISTORY_MESSAGES = 10;
const MAX_HISTORY_MESSAGE_LENGTH = 4000;
const MAX_RETRIES = 5;
const RETRY_BASE_MS = 2000;
const GEMINI_OPENAI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/';

export type AnswerMode = 'answer' | 'summary' | 'exact';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GenerateResponseInput {
  message: string;
  context: RagChunk[];
  history?: ConversationMessage[];
  mode?: AnswerMode;
  systemPromptOverride?: string;
}

export interface GenerateResponseResult {
  answer: string;
  context: RagChunk[];
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
}

export interface AiStreamParams {
  message: string;
  context: RagChunk[];
  history?: ConversationMessage[];
  mode?: AnswerMode;
}

interface ApiErrorShape {
  status?: number;
  response?: {
    status?: number;
  };
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly cohere?: CohereClientV2;
  private readonly cohereModel?: string;
  private readonly openai?: OpenAI;
  private readonly model?: string;

  constructor(private readonly config: ConfigService) {
    const cohereApiKey = this.config.get<string>('COHERE_API_KEY');
    const groqApiKey = this.config.get<string>('GROQ_API_KEY');
    const geminiApiKey =
      this.config.get<string>('GEMINI_API_KEY') ??
      this.config.get<string>('GOOGLE_AI_API_KEY');
    const openAiApiKey = this.config.get<string>('OPENAI_API_KEY');

    // Primary RAG Provider: Cohere Command R+
    if (cohereApiKey) {
      this.cohere = new CohereClientV2({ token: cohereApiKey });
      this.cohereModel = this.config.get<string>('COHERE_CHAT_MODEL') ?? 'command-r-plus';
      this.logger.log(`Initialized Cohere Client V2 with model: ${this.cohereModel}`);
    }

    // Secondary / Fallback OpenAI-compatible Provider (Groq / Gemini / OpenAI)
    const fallbackKey = groqApiKey ?? geminiApiKey ?? openAiApiKey;
    if (fallbackKey) {
      this.openai = new OpenAI({
        apiKey: fallbackKey,
        baseURL: groqApiKey
          ? this.config.get<string>('GROQ_OPENAI_BASE_URL') ?? 'https://api.groq.com/openai/v1'
          : geminiApiKey
          ? this.config.get<string>('GEMINI_OPENAI_BASE_URL') ?? GEMINI_OPENAI_BASE_URL
          : undefined,
      });

      this.model = groqApiKey
        ? this.config.get<string>('GROQ_CHAT_MODEL') ?? 'llama-3.3-70b-versatile'
        : geminiApiKey
        ? this.config.get<string>('GEMINI_CHAT_MODEL') ?? 'gemini-2.0-flash'
        : this.config.get<string>('OPENAI_CHAT_MODEL') ?? 'gpt-4o-mini';
    }

    if (!cohereApiKey && !fallbackKey) {
      throw new InternalServerErrorException(
        'AI provider API key is required (COHERE_API_KEY, GROQ_API_KEY, or GEMINI_API_KEY)',
      );
    }
  }

  getActiveModelName(): string {
    return this.cohere ? (this.cohereModel ?? 'command-r-plus') : (this.model ?? 'command-r-plus');
  }

  async generateResponse(
    input: GenerateResponseInput,
  ): Promise<GenerateResponseResult> {
    const message = input.message.trim();

    if (!message) {
      throw new BadRequestException('message is required');
    }

    if (input.context.length === 0) {
      return {
        answer: FALLBACK_ANSWER,
        context: input.context,
        usage: {
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
        },
      };
    }

    if (this.cohere && this.cohereModel) {
      return this.generateWithCohere(input, message);
    }

    return this.generateWithOpenAiFallback(input, message);
  }

  private async generateWithCohere(
    input: GenerateResponseInput,
    message: string,
  ): Promise<GenerateResponseResult> {
    const systemPrompt = input.systemPromptOverride ?? [
      'You are MERIDAS, an operational evidence intelligence system powered by Cohere Command R+.',
      'Core Principle: Evidence first. Answer second.',
      'Answer ONLY using the provided operational documents and verified evidence.',
      'If the provided documents do not contain the answer, explicitly state that you cannot establish the answer.',
      'Do not guess, extrapolate, or invent system configurations, credentials, or policies.',
      'Always refer to the exact context evidence numbers like [1] or [Context 1].',
      'For any conditional or scope-limited assertions, highlight the limitation explicitly.',
      this.getModeInstruction(input.mode ?? 'answer'),
    ].join('\n');

    const cohereDocs = input.context.map((chunk, index) => ({
      id: `doc-${index + 1}`,
      data: {
        title: chunk.metadata.documentTitle ?? `Directive ${chunk.metadata.documentId ?? index + 1}`,
        snippet: chunk.text,
        chunkIndex: String(chunk.metadata.chunkIndex ?? index),
      },
    }));

    const cohereMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      ...(input.history?.slice(-MAX_HISTORY_MESSAGES).map((m) => ({
        role: m.role,
        content: m.content.slice(0, MAX_HISTORY_MESSAGE_LENGTH),
      })) ?? []),
      { role: 'user', content: message },
    ];

    let lastError: Error | undefined;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await this.cohere!.chat({
          model: this.cohereModel!,
          messages: cohereMessages as any,
          documents: cohereDocs,
          temperature: 0.2,
        });

        const answer = response.message?.content
          ?.map((item: any) => item.text ?? '')
          .join('')
          .trim();

        const inputTokens =
          (response.usage as any)?.tokens?.inputTokens ??
          (response.usage as any)?.billedUnits?.inputTokens ??
          0;
        const outputTokens =
          (response.usage as any)?.tokens?.outputTokens ??
          (response.usage as any)?.billedUnits?.outputTokens ??
          0;

        return {
          answer: answer || FALLBACK_ANSWER,
          context: input.context,
          usage: {
            inputTokens,
            outputTokens,
            totalTokens: inputTokens + outputTokens,
          },
        };
      } catch (err: any) {
        lastError = err;
        const status = err.status ?? err.statusCode ?? 500;
        const isRetryable = [429, 500, 502, 503, 504].includes(status);
        if (!isRetryable || attempt === MAX_RETRIES) {
          this.logger.error(
            `Cohere chat failed (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`,
          );
          throw new InternalServerErrorException(`Cohere chat failed: ${err.message}`);
        }
        const delayMs = RETRY_BASE_MS * Math.pow(2, attempt - 1);
        this.logger.warn(
          `Cohere chat attempt ${attempt} failed (${status}), retrying in ${delayMs}ms`,
        );
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
    throw lastError ?? new InternalServerErrorException('Cohere chat execution failed');
  }

  private async generateWithOpenAiFallback(
    input: GenerateResponseInput,
    message: string,
  ): Promise<GenerateResponseResult> {
    const messages = this.buildMessages({
      message,
      context: input.context,
      history: input.history ?? [],
      mode: input.mode ?? 'answer',
      systemPromptOverride: input.systemPromptOverride,
    });

    const completion = await this.callWithRetry(messages, 0.2);
    const answer = completion.choices[0]?.message?.content?.trim();

    const usage = {
      inputTokens: completion.usage?.prompt_tokens ?? 0,
      outputTokens: completion.usage?.completion_tokens ?? 0,
      totalTokens: completion.usage?.total_tokens ?? 0,
    };

    return {
      answer: answer ?? FALLBACK_ANSWER,
      context: input.context,
      usage,
    };
  }

  async *streamResponse(input: AiStreamParams): AsyncGenerator<string, void, unknown> {
    const message = input.message.trim();

    if (!message) {
      throw new BadRequestException('message is required');
    }

    if (input.context.length === 0) {
      yield FALLBACK_ANSWER;
      return;
    }

    if (this.cohere && this.cohereModel) {
      yield* this.streamWithCohere(input, message);
      return;
    }

    yield* this.streamWithOpenAiFallback(input, message);
  }

  private async *streamWithCohere(
    input: AiStreamParams,
    message: string,
  ): AsyncGenerator<string, void, unknown> {
    const systemPrompt = [
      'You are MERIDAS, an operational evidence intelligence system powered by Cohere Command R+.',
      'Core Principle: Evidence first. Answer second.',
      'Answer ONLY using the provided operational documents and verified evidence.',
      'If the provided documents do not contain the answer, explicitly state that you cannot establish the answer.',
      'Do not guess, extrapolate, or invent system configurations, credentials, or policies.',
      'Always refer to the exact context evidence numbers like [1] or [Context 1].',
      'For any conditional or scope-limited assertions, highlight the limitation explicitly.',
      this.getModeInstruction(input.mode ?? 'answer'),
    ].join('\n');

    const cohereDocs = input.context.map((chunk, index) => ({
      id: `doc-${index + 1}`,
      data: {
        title: chunk.metadata.documentTitle ?? `Directive ${chunk.metadata.documentId ?? index + 1}`,
        snippet: chunk.text,
        chunkIndex: String(chunk.metadata.chunkIndex ?? index),
      },
    }));

    const cohereMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      ...(input.history?.slice(-MAX_HISTORY_MESSAGES).map((m) => ({
        role: m.role,
        content: m.content.slice(0, MAX_HISTORY_MESSAGE_LENGTH),
      })) ?? []),
      { role: 'user', content: message },
    ];

    let stream: any;
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        stream = await this.cohere!.chatStream({
          model: this.cohereModel!,
          messages: cohereMessages as any,
          documents: cohereDocs,
          temperature: 0.2,
        });
        break;
      } catch (err: any) {
        lastError = err;
        const status = err.status ?? err.statusCode ?? 500;
        const isRetryable = [429, 500, 502, 503, 504].includes(status);
        if (!isRetryable || attempt === MAX_RETRIES) {
          this.logger.error(
            `Cohere stream initiation failed (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`,
          );
          throw new InternalServerErrorException(`Cohere stream failed: ${err.message}`);
        }
        const delayMs = RETRY_BASE_MS * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }

    if (!stream) throw lastError ?? new InternalServerErrorException('Stream initiation failed');

    for await (const chatEvent of stream) {
      if (chatEvent.type === 'content-delta') {
        const token = chatEvent.delta?.message?.content?.text ?? '';
        if (token) {
          yield token;
        }
      }
    }
  }

  private async *streamWithOpenAiFallback(
    input: AiStreamParams,
    message: string,
  ): AsyncGenerator<string, void, unknown> {
    const messages = this.buildMessages({
      message,
      context: input.context,
      history: input.history ?? [],
      mode: input.mode ?? 'answer',
    });

    let stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk> | undefined;
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        stream = await this.openai!.chat.completions.create({
          model: this.model!,
          messages,
          temperature: 0.2,
          stream: true,
        });
        break;
      } catch (error) {
        const err = this.toError(error);
        lastError = err;
        const status = this.getStatus(error);
        const isRetryable = [429, 500, 502, 503].includes(status);

        if (!isRetryable || attempt === MAX_RETRIES) {
          const friendlyMessage =
            status === 429
              ? 'The AI system is currently busy (Rate Limit). Please wait a few seconds and try again.'
              : `AI stream failed: ${err.message}`;
          this.logger.error(
            `AI stream failed (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`,
          );
          throw new InternalServerErrorException(friendlyMessage);
        }

        const delayMs = RETRY_BASE_MS * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    if (!stream) throw lastError ?? new InternalServerErrorException('Stream initiation failed');

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content ?? '';
      if (token) {
        yield token;
      }
    }
  }

  estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  async generateSummary(prompt: string): Promise<string> {
    if (this.cohere && this.cohereModel) {
      const response = await this.cohere.chat({
        model: this.cohereModel,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that summarizes documents clearly and concisely for text-to-speech conversion.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

      const summary = response.message?.content
        ?.map((c: any) => c.text ?? '')
        .join('')
        .trim();

      if (!summary) throw new InternalServerErrorException('Failed to generate summary');
      return summary;
    }

    const completion = await this.callWithRetry(
      [
        {
          role: 'system',
          content:
            'You are a helpful assistant that summarizes documents clearly and concisely for text-to-speech conversion.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      0.3,
    );

    const summary = completion.choices[0]?.message?.content?.trim();
    if (!summary) {
      throw new InternalServerErrorException('Failed to generate summary');
    }
    return summary;
  }

  async callDirectJsonPrompt(prompt: string): Promise<string> {
    if (this.cohere && this.cohereModel) {
      let lastError: Error | undefined;
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const response = await this.cohere.chat({
            model: this.cohereModel,
            responseFormat: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content:
                  'You are the MERIDAS JSON verification engine. Return ONLY valid JSON matching the schema, with zero introductory text or conversational wrapper.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.1,
          });

          const content = response.message?.content
            ?.map((c: any) => c.text ?? '')
            .join('')
            .trim();

          if (!content) {
            throw new InternalServerErrorException('Cohere returned empty JSON');
          }
          return content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
        } catch (err: any) {
          lastError = err;
          if (attempt === MAX_RETRIES) {
            this.logger.error(`Cohere JSON prompt failed: ${err.message}`);
            throw new InternalServerErrorException(`Cohere JSON prompt failed: ${err.message}`);
          }
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
      throw lastError ?? new InternalServerErrorException('JSON verification failed');
    }

    const completion = await this.callWithRetry(
      [
        {
          role: 'system',
          content:
            'You are the MERIDAS JSON verification engine. Return ONLY valid JSON matching the schema, with zero introductory text or conversational wrapper.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      0.1,
    );

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new InternalServerErrorException('AI provider returned empty JSON');
    }
    return content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  private async callWithRetry(
    messages: ChatCompletionMessageParam[],
    temperature: number,
  ): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    if (!this.openai) {
      throw new InternalServerErrorException('OpenAI-compatible provider is not configured');
    }

    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        return await this.openai.chat.completions.create({
          model: this.model!,
          messages,
          temperature,
        });
      } catch (error) {
        const err = this.toError(error);
        lastError = err;
        const status = this.getStatus(error);
        const isRetryable = [429, 500, 502, 503].includes(status);

        if (!isRetryable || attempt === MAX_RETRIES) {
          const friendlyMessage =
            status === 429
              ? 'The AI system is currently busy (Rate Limit). Please wait a few seconds and try again.'
              : `AI chat completion failed: ${err.message}`;
          this.logger.error(
            `AI chat completion failed (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`,
          );
          throw new InternalServerErrorException(friendlyMessage);
        }

        const delayMs = RETRY_BASE_MS * Math.pow(2, attempt - 1);
        this.logger.warn(
          `AI chat attempt ${attempt} failed (${status}), retrying in ${delayMs}ms`,
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
    throw lastError ?? new InternalServerErrorException('Chat completion failed');
  }

  private getStatus(error: unknown): number {
    const shaped = error as ApiErrorShape;
    return shaped.status ?? shaped.response?.status ?? 0;
  }

  private toError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
  }

  buildMessages({
    message,
    context,
    history,
    mode,
    systemPromptOverride,
  }: {
    message: string;
    context: RagChunk[];
    history: ConversationMessage[];
    mode?: AnswerMode;
    systemPromptOverride?: string;
  }): ChatCompletionMessageParam[] {
    const systemContent =
      systemPromptOverride ??
      [
        'You are MERIDAS, an evidence intelligence system for operational knowledge.',
        'Core Principle: Evidence first. Answer second.',
        'Answer ONLY using the provided operational context and verified evidence.',
        'If the context does not contain the answer, explicitly state that you cannot establish the answer.',
        'Do not guess, extrapolate, or invent system configurations, credentials, or policies.',
        'Always link claims to explicit evidence context numbers like [1] or [Context 1].',
        'For any conditional or scope-limited assertions, highlight the limitation explicitly.',
        this.getModeInstruction(mode ?? 'answer'),
      ].join('\n');
    return [
      {
        role: 'system',
        content: systemContent,
      },
      {
        role: 'system',
        content: this.formatContext(context),
      },
      ...this.sanitizeHistory(history),
      {
        role: 'user',
        content: message,
      },
    ];
  }

  private formatContext(context: RagChunk[]): string {
    const chunks = context
      .map((chunk, index) => {
        return [
          `[Context ${index + 1}]`,
          `score: ${chunk.score.toFixed(4)}`,
          `documentId: ${chunk.metadata.documentId ?? 'unknown'}`,
          `chunkIndex: ${chunk.metadata.chunkIndex ?? 'unknown'}`,
          chunk.text,
        ].join('\n');
      })
      .join('\n\n');

    return `Company context:\n${chunks}`;
  }

  private getModeInstruction(mode: AnswerMode): string {
    if (mode === 'summary') {
      return 'Mode: summary. Summarize the relevant context into clear bullets, then mention the main source context numbers.';
    }

    if (mode === 'exact') {
      return 'Mode: exact answer. Give the shortest direct answer supported by the context. If useful, quote only a short phrase from the context.';
    }

    return 'Mode: answer. Answer the user question directly using the context.';
  }

  private sanitizeHistory(
    history: ConversationMessage[],
  ): ChatCompletionMessageParam[] {
    return history.slice(-MAX_HISTORY_MESSAGES).map((message) => ({
      role: message.role,
      content: message.content.slice(0, MAX_HISTORY_MESSAGE_LENGTH),
    }));
  }
}
