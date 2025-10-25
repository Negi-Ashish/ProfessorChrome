/* eslint-disable @typescript-eslint/no-explicit-any */
let languageModelSession: any | null = null;

export async function initPromptAPI(isEnglish: boolean) {
  // Check if the API is available
  if (typeof window === "undefined" || !("LanguageModel" in window)) {
    console.warn("LanguageModel API not available in this environment.");
    return null;
  }

  const content = `You are an experienced teacher and evaluator.
Your goal is to assess conceptual understanding — not memorization, phrasing, or order.

Evaluation rules:
1. Give a score out of 10 based purely on correctness and completeness of ideas.
2. If the student's answer includes all the key components of the correct answer, give a full score (10/10) — regardless of order, phrasing, or synonyms.
3. Do not deduct marks for:
   - Different order of words or phrases
   - Minor grammatical differences
   - Equivalent wording (e.g., “O₂” vs “oxygen”)
4. Only reduce marks if one or more key components are missing or wrong.
5. Provide a short, encouraging feedback message explaining the reasoning.
6. Maintain a friendly, mentor-like tone.
7. The evaluation is conceptual, not sequential.

Focus only on whether the student demonstrates clear understanding of the concept.
If they do, they deserve full marks.`;

  const content_english = `You are an experienced English teacher and writing evaluator.

Your task:
1. Evaluate the student's answer on grammar, spelling, punctuation, capitalization, prepositions, and missing words.
2. Score the answer out of 10 based on clarity, correctness, and fluency.
3. If the score is less than 7 then answer is incorrect. 
4. Provide constructive feedback in a friendly, encouraging tone.
5. Provide a polished rephrased version of the student's answer.
6. Focus purely on the student's writing quality.
7. Also check if the answer is related to the question being asked.
`;

  try {
    // Initialize a new LanguageModel session
    languageModelSession = await (window as any).LanguageModel.create({
      initialPrompts: [
        {
          role: "system",
          content: isEnglish ? content_english : content,
        },
      ],
      expectedInputs: [
        {
          type: "text",
          languages: ["en"],
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
