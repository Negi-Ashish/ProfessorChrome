"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, useState } from "react";
import { BackButton } from "../back";
import { humanizeText } from "@/utils/humanizerClient";
import TypingLoader from "../Loader/TypingLoader";

interface ParaphraseProp {
  setRole: Dispatch<SetStateAction<string>>;
}

export function ParaphraseComponent({ setRole }: ParaphraseProp) {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleHumanize() {
    if (!inputText.trim()) {
      setError("Please paste some text first.");
      return;
    }
    setError("");
    setOutputText("");
    setLoading(true);

    try {
      const result = await humanizeText(inputText);

      if (result === null) {
        setError(
          "LanguageModel API is not available. Make sure you are using Chrome with the built-in AI origin trial enabled."
        );
        return;
      }

      setOutputText(result);
    } catch (err: any) {
      setError("Something went wrong: " + (err?.message ?? "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative flex flex-col items-center min-h-screen w-screen bg-[#0d0f1a] text-white px-6 py-10">
      <BackButton styling="top-6 left-3" handleBack={() => setRole("")} />

      <h1 className="text-4xl font-bold mb-2 mt-4">AI Humanizer</h1>
      <p className="text-gray-400 mb-8 text-center max-w-xl text-sm">
        Paste AI-generated text and get back a version that reads like a real human wrote it — natural rhythm, no buzzwords, no giveaways.
      </p>

      {/* Input / Output panels */}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl">

        {/* Input */}
        <div className="flex flex-col flex-1 gap-2">
          <label className="text-sm font-semibold text-gray-300">AI-Generated Text</label>
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (error) setError("");
            }}
            placeholder="Paste your AI-generated text here..."
            className="flex-1 min-h-72 rounded-xl bg-[#1a1d2e] border border-gray-600 px-4 py-3 text-white placeholder:text-gray-500 resize-none focus:outline-none focus:border-[#18c99d] text-sm leading-relaxed"
          />
          <p className="text-xs text-gray-600 text-right">{inputText.length} chars</p>
        </div>

        {/* Center button */}
        <div className="flex items-center justify-center lg:flex-col gap-3">
          <button
            onClick={handleHumanize}
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-semibold text-black transition-colors whitespace-nowrap
              ${loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#18c99d] border border-green-500 hover:bg-green-400"
              }`}
          >
            {loading ? "Humanizing..." : "Humanize →"}
          </button>
        </div>

        {/* Output */}
        <div className="flex flex-col flex-1 gap-2">
          <label className="text-sm font-semibold text-gray-300">Human Version</label>
          <div
            className="flex-1 min-h-72 rounded-xl bg-[#1a1d2e] border border-gray-600 px-4 py-3 text-sm leading-relaxed text-gray-200 whitespace-pre-wrap overflow-y-auto"
          >
            {loading ? (
              <TypingLoader />
            ) : outputText ? (
              outputText
            ) : (
              <span className="text-gray-500">Your humanized text will appear here...</span>
            )}
          </div>
          {outputText && !loading && (
            <p className="text-xs text-gray-600 text-right">{outputText.length} chars</p>
          )}
        </div>
      </div>

      {/* Copy button */}
      {outputText && !loading && (
        <button
          onClick={handleCopy}
          className="mt-4 px-5 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-[#18c99d] hover:text-[#18c99d] text-sm transition-colors"
        >
          {copied ? "Copied!" : "Copy Result"}
        </button>
      )}

      {/* Error */}
      {error && (
        <p className="mt-4 text-red-400 text-sm text-center max-w-xl">{error}</p>
      )}
    </div>
  );
}
