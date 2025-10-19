// global.d.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
interface LanguageModelSession {
  append(messages: any[]): Promise<void>;
  prompt(input: string): Promise<string>;
  close?(): Promise<void>;
}

interface Window {
  LanguageModel: {
    availability(): Promise<any>;
    create(options: {
      initialPrompts?: { role: string; content: string }[];
      expectedInputs?: { type: string }[];
    }): Promise<LanguageModelSession>;
  };
}
