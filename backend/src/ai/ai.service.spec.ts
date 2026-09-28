import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';

describe('AiService', () => {
  const context = [
    {
      vectorId: 'tenant-a-doc-1-0',
      score: 0.92,
      text: 'Refunds are available within 30 days.',
      metadata: {
        tenantId: 'tenant-a',
        text: 'Refunds are available within 30 days.',
        documentId: 'doc-1',
        chunkIndex: 0,
      },
    },
  ];

  let service: AiService;
  let createCompletion: jest.Mock;

  beforeEach(() => {
    createCompletion = jest.fn().mockResolvedValue({
      choices: [{ message: { content: 'You can request a refund within 30 days.' } }],
      usage: {
        prompt_tokens: 101,
        completion_tokens: 12,
        total_tokens: 113,
      },
    });

    service = new AiService(
      {
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'GEMINI_API_KEY') return 'test-gemini-key';
          if (key === 'GEMINI_CHAT_MODEL') return 'gemini-2.0-flash';
          return undefined;
        }),
      } as unknown as ConfigService,
    );

    (service as any).openai = {
      chat: {
        completions: {
          create: createCompletion,
        },
      },
    };
  });

  it('builds a grounded prompt, calls the AI provider, and returns the response', async () => {
    const result = await service.generateResponse({
      message: 'Can I get a refund?',
      context,
      history: [{ role: 'user', content: 'Hi' }],
    });

    expect(createCompletion).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gemini-2.0-flash',
        temperature: 0.2,
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('Answer ONLY using the provided operational context and verified evidence.'),
          }),
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('Mode: answer.'),
          }),
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('Refunds are available within 30 days.'),
          }),
        ]),
      }),
    );
    expect(result.answer).toBe('You can request a refund within 30 days.');
    expect(result.usage.totalTokens).toBe(113);
  });

  it('refuses when no retrieved context is provided', async () => {
    const result = await service.generateResponse({
      message: 'What is your refund policy?',
      context: [],
    });

    expect(createCompletion).not.toHaveBeenCalled();
    expect(result.answer).toContain("don't have enough information");
  });

  it('keeps only recent conversation history in the prompt', () => {
    const history = Array.from({ length: 12 }, (_, index) => ({
      role: index % 2 === 0 ? 'user' as const : 'assistant' as const,
      content: `message-${index}`,
    }));

    const messages = service.buildMessages({
      message: 'Current question',
      context,
      history,
    });

    const contents = messages.map((message) => message.content);
    expect(contents).not.toContain('message-0');
    expect(contents).not.toContain('message-1');
    expect(contents).toContain('message-2');
    expect(contents).toContain('Current question');
  });

  describe('Cohere Integration', () => {
    it('uses Cohere Client V2 with native documents when COHERE_API_KEY is configured', async () => {
      const mockCohereChat = jest.fn().mockResolvedValue({
        message: {
          content: [{ type: 'text', text: 'Per policy, refunds are permitted up to 30 days.' }],
        },
        usage: {
          tokens: {
            inputTokens: 85,
            outputTokens: 15,
          },
        },
      });

      const cohereService = new AiService({
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'COHERE_API_KEY') return 'test-cohere-token';
          if (key === 'COHERE_CHAT_MODEL') return 'command-r-plus';
          return undefined;
        }),
      } as unknown as ConfigService);

      (cohereService as any).cohere = {
        chat: mockCohereChat,
      };

      const result = await cohereService.generateResponse({
        message: 'Can I get a refund?',
        context,
      });

      expect(mockCohereChat).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'command-r-plus',
          documents: expect.arrayContaining([
            expect.objectContaining({
              id: 'doc-1',
              data: expect.objectContaining({
                snippet: 'Refunds are available within 30 days.',
              }),
            }),
          ]),
        }),
      );
      expect(result.answer).toBe('Per policy, refunds are permitted up to 30 days.');
      expect(result.usage.totalTokens).toBe(100);
    });

    it('streams tokens from Cohere content-delta events', async () => {
      async function* mockStream() {
        yield { type: 'content-delta', delta: { message: { content: { text: 'Refunds ' } } } };
        yield { type: 'content-delta', delta: { message: { content: { text: 'within 30 days.' } } } };
      }

      const cohereService = new AiService({
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'COHERE_API_KEY') return 'test-cohere-token';
          return undefined;
        }),
      } as unknown as ConfigService);

      (cohereService as any).cohere = {
        chatStream: jest.fn().mockResolvedValue(mockStream()),
      };

      const tokens: string[] = [];
      for await (const token of cohereService.streamResponse({
        message: 'What is the refund window?',
        context,
      })) {
        tokens.push(token);
      }

      expect(tokens.join('')).toBe('Refunds within 30 days.');
    });
  });
});
