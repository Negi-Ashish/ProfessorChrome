/* eslint-disable @typescript-eslint/no-explicit-any */
let proofreader: Proofreader | null = null;

export async function initProofreader() {
  // Check if the API exists
  if (typeof window === "undefined" || !("Proofreader" in window)) {
    console.warn("Proofreader API not available in this environment.");
    return null;
  }

  try {
    // Initialize asynchronously
    proofreader = await (window as any).Proofreader.create({
      expectedInputLanguages: ["en"],
      includeCorrectionTypes: true,
      includeCorrectionExplanations: true,
      correctionExplanationLanguage: "en",
    });

    console.log("✅ Proofreader initialized successfully.");
    return proofreader;
  } catch (err) {
    console.error("❌ Failed to initialize Proofreader:", err);
    return null;
  }
}

export function destroyProofreader() {
  if (proofreader) {
    proofreader = null;
    console.log("Proofreader instance destroyed.");
  }
}
