/* eslint-disable @typescript-eslint/no-explicit-any */

export type RewriterTone = "as-is" | "more-formal" | "more-casual";
export type RewriterLength = "as-is" | "shorter" | "longer";

export async function createRewriter(tone: RewriterTone, length: RewriterLength) {
  if (typeof window === "undefined" || !window.ai?.rewriter) {
    console.warn("Rewriter API not available in this environment.");
    return null;
  }

  try {
    const availability = await window.ai.rewriter.availability();
    if (availability === "no") {
      console.warn("Rewriter API is not available on this device.");
      return null;
    }

    const rewriter = await window.ai.rewriter.create({
      tone,
      format: "plain-text",
      length,
      sharedContext: "Paraphrase the given text clearly while preserving its original meaning.",
    });

    return rewriter;
  } catch (err) {
    console.error("Failed to initialize Rewriter:", err);
    return null;
  }
}
