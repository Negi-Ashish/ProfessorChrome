/* eslint-disable @typescript-eslint/no-explicit-any */
let languageModelSession: any | null = null;

export async function initPromptAPI() {
  // Check if the API is available
  if (typeof window === "undefined" || !("LanguageModel" in window)) {
    console.warn("LanguageModel API not available in this environment.");
    return null;
  }

  try {
    // Initialize a new LanguageModel session
    languageModelSession = await (window as any).LanguageModel.create({
      initialPrompts: [
        {
          role: "system",
          content: `You are an experienced teacher and evaluator.
Your task is to:
1. Evaluate a student's answer based on the provided question.
2. Give marks out of 10.
3. Provide a detailed explanation of the mistakes or areas of improvement.
4. Offer constructive feedback on how the student can write a better answer next time.
5. Maintain a friendly, encouraging tone — like a mentor guiding the student toward improvement.`,
        },
      ],
      expectedInputs: [
        {
          type: "text",
          languages: ["en" /* system prompt */, "ja" /* user prompt */],
        },
      ],
    });

    console.log("✅ LanguageModel session initialized successfully.");
    return languageModelSession;
  } catch (err) {
    console.error("❌ Failed to initialize LanguageModel session:", err);
    return null;
  }
}

export function getPromptSession() {
  if (!languageModelSession) {
    console.warn(
      "⚠️ No active LanguageModel session. Call initPromptAPI() first."
    );
  }
  return languageModelSession;
}

export function destroyPromptAPI() {
  if (languageModelSession) {
    languageModelSession.destroy();
    languageModelSession = null;

    console.log("🗑️ LanguageModel session destroyed.");
  }
}
