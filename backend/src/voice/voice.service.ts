import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import OpenAI, { toFile } from 'openai';
import { DocumentsService } from '../documents/documents.service';
import { AiService } from '../ai/ai.service';
import { RagService } from '../rag/rag.service';

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);
  private readonly elevenlabs: ElevenLabsClient | null = null;

  constructor(
    private readonly documentsService: DocumentsService,
    private readonly aiService: AiService,
    private readonly ragService: RagService,
  ) {
    const elevenKey = process.env.ELEVENLABS_API_KEY?.trim();
    if (elevenKey && elevenKey.startsWith('sk_')) {
      this.elevenlabs = new ElevenLabsClient({ apiKey: elevenKey });
    }
  }

  async transcribe(audioBuffer: Buffer, mimeType: string): Promise<{ text: string }> {
    if (audioBuffer.length > 25 * 1024 * 1024) {
      throw new BadRequestException('Audio file exceeds 25MB limit.');
    }

    // 1. Try ElevenLabs if a valid secret key is present
    if (this.elevenlabs) {
      try {
        const blob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType });
        const file = new File([blob], 'audio.webm', { type: mimeType });
        const result = await this.elevenlabs.speechToText.convert({
          file,
          modelId: (process.env.ELEVENLABS_STT_MODEL ?? 'scribe_v2') as any,
          languageCode: null,
          tagAudioEvents: false,
          diarize: false,
        });
        if (result?.text) {
          return { text: result.text };
        }
      } catch (err: any) {
        this.logger.warn(`ElevenLabs STT error: ${err.message}. Trying Groq Whisper fallback.`);
      }
    }

    // 2. High-speed, high-accuracy Groq Whisper fallback
    const groqKey = process.env.GROQ_API_KEY?.trim();
    if (groqKey) {
      try {
        const groq = new OpenAI({
          apiKey: groqKey,
          baseURL: 'https://api.groq.com/openai/v1',
        });
        const rawMime = mimeType || 'audio/webm';
        const cleanMime = rawMime.split(';')[0].trim();
        let ext = 'webm';
        if (cleanMime.includes('mp4') || cleanMime.includes('m4a')) ext = 'm4a';
        else if (cleanMime.includes('wav')) ext = 'wav';
        else if (cleanMime.includes('ogg')) ext = 'ogg';
        else if (cleanMime.includes('mpeg') || cleanMime.includes('mp3')) ext = 'mp3';

        const file = await toFile(audioBuffer, `audio.${ext}`, {
          type: cleanMime,
        });
        const result = await groq.audio.transcriptions.create({
          file,
          model: 'whisper-large-v3-turbo',
        });
        return { text: result.text };
      } catch (groqErr: any) {
        this.logger.error(`Groq Whisper transcription failed: ${groqErr.message}`);
        throw new InternalServerErrorException(`Transcription failed: ${groqErr.message}`);
      }
    }

    throw new BadRequestException(
      'Speech transcription unavailable: configure a valid ELEVENLABS_API_KEY (starting with sk_) or GROQ_API_KEY.',
    );
  }

  async synthesize(text: string): Promise<Buffer> {
    const trimmedText = text.trim().slice(0, 48000);
    const elevenKey = process.env.ELEVENLABS_API_KEY?.trim();

    if (!elevenKey || !elevenKey.startsWith('sk_') || !this.elevenlabs) {
      this.logger.warn(
        'ElevenLabs secret key (starting with sk_) not found. TTS skipped.',
      );
      throw new BadRequestException(
        "ElevenLabs secret key (starts with 'sk_') is required for server-side synthesis. Using client speech fallback.",
      );
    }

    // Simple sentence boundary split for texts > 4800 chars
    const chunks: string[] = [];
    if (trimmedText.length > 4800) {
      const sentences = trimmedText.split(/(?<=[.!?])\s+/);
      let currentChunk = '';
      for (const sentence of sentences) {
        if ((currentChunk + sentence).length > 4800) {
          chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          currentChunk += (currentChunk ? ' ' : '') + sentence;
        }
      }
      if (currentChunk) chunks.push(currentChunk.trim());
    } else {
      chunks.push(trimmedText);
    }

    try {
      const audioBuffers: Buffer[] = [];
      for (const chunk of chunks) {
        const audioStream = await this.elevenlabs.textToSpeech.convert(
          process.env.ELEVENLABS_VOICE_ID ?? 'JBFqnCBsd6RMkjVDRZzb',
          {
            text: chunk,
            modelId: (process.env.ELEVENLABS_TTS_MODEL ?? 'eleven_turbo_v2_5') as any,
            languageCode: 'en',
          },
        );

        const streamChunks: Buffer[] = [];
        for await (const streamChunk of audioStream as any) {
          streamChunks.push(Buffer.from(streamChunk));
        }
        audioBuffers.push(Buffer.concat(streamChunks));
      }
      return Buffer.concat(audioBuffers);
    } catch (error: any) {
      this.logger.error(`Synthesis failed: ${error.message}`);
      throw new InternalServerErrorException(`Synthesis failed: ${error.message}`);
    }
  }

  async summarizeDocument(
    documentId: string,
    tenantId: string,
  ): Promise<{ audioBuffer: Buffer; summaryText: string }> {
    const document = await this.documentsService.findOne(tenantId, documentId);
    if (!document || !document.content) {
      throw new NotFoundException('Document or document content not found');
    }

    const content = document.content.slice(0, 8000);
    const summaryPrompt = `Summarize this document in 3 to 5 clear sentences. Be direct, professional, and easy to understand for any team member. No bullet points, no headers, no markdown. Document: ${content}`;

    const summaryText = await this.aiService.generateSummary(summaryPrompt);
    let audioBuffer: Buffer = Buffer.from([]);
    try {
      audioBuffer = (await this.synthesize(summaryText)) as Buffer;
    } catch (err: any) {
      this.logger.warn(
        `Document audio synthesis unavailable (${err.message}). Summary text preserved for client speech playback.`,
      );
    }

    return { audioBuffer, summaryText };
  }

  async voiceSearch(
    audioBuffer: Buffer,
    mimeType: string,
    tenantId: string,
  ): Promise<{ query: string; results: any[] }> {
    const { text: query } = await this.transcribe(audioBuffer, mimeType);
    const results = await this.ragService.retrieve(query, tenantId);
    return { query, results };
  }
}
