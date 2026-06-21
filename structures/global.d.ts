// global.d.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
interface LanguageModelSession {
  append(messages: any[]): Promise<void>;
  prompt(input: string): Promise<string>;
  close?(): Promise<void>;
}

interface RewriterSession {
  rewrite(input: string, options?: { context?: string }): Promise<string>;
  rewriteStreaming(input: string, options?: { context?: string }): ReadableStream<string>;
  destroy(): void;
}

interface Window {
  LanguageModel: {
    availability(): Promise<any>;
    create(options: {
      initialPrompts?: { role: string; content: string }[];
      expectedInputs?: { type: string }[];
    }): Promise<LanguageModelSession>;
  };
  Proofreader?: typeof Proofreader;
  ai?: {
    rewriter?: {
      availability(): Promise<string>;
      create(options?: {
        tone?: "as-is" | "more-formal" | "more-casual";
        format?: "as-is" | "plain-text" | "markdown";
        length?: "as-is" | "shorter" | "longer";
        sharedContext?: string;
      }): Promise<RewriterSession>;
    };
    writer?: {
      availability(): Promise<string>;
      create(options?: {
        tone?: "formal" | "neutral" | "casual";
        format?: "plain-text" | "markdown";
        length?: "short" | "medium" | "long";
        sharedContext?: string;
      }): Promise<{ write(input: string): Promise<string>; destroy(): void }>;
    };
  };
}

class Proofreader {
  proofread(input: string): Promise<{
    correctedInput: string;
    corrections: {
      startIndex: number;
      endIndex: number;
      correction: string;
      explanation?: string;
    }[];
  }>;
}
