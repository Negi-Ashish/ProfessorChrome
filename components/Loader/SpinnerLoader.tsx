import { useEffect, useState } from "react";

const messages = [
  "Calculating your result...",
  "Evaluating your answers...",
  "Analyzing grammar and sentence structure...",
  "Checking your conceptual understanding...",
  "Verifying correctness of your responses...",
  "AI is working on your score...",
  "Reviewing key knowledge points...",
  "Cross-checking important details...",
  "Measuring clarity and accuracy...",
  "Checking sentence fluency...",
  "Recognizing correct ideas...",
  "Watching out for small mistakes...",
  "Scanning for improvements...",
  "Marking spelling and grammar...",
  "Considering completeness of answers...",
  "Double-checking your responses...",
  "Almost done, stay with us...",
  "Making sure everything is fair...",
  "Applying evaluation rules...",
  "Preparing your final score...",
];

export default function SpinnerLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 10000); // Change message every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>

      {/* Dynamic Rotating Message */}
      <p className="mt-4 text-gray-800 font-medium animate-pulse text-center px-4">
        {messages[index]}
      </p>
    </div>
  );
}
