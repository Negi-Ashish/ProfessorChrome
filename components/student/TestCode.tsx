import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { getTest } from "@/api_call/backend_calls";
import { Test } from "@/structures/interfaceFile";

interface CodeInputProps {
  setTestData: Dispatch<SetStateAction<Test | null>>;
}

export function TestCodeInput({ setTestData }: CodeInputProps) {
  const [isComplete, setIsComplete] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.target.value && idx < 4) {
      inputsRef.current[idx + 1]?.focus();
    }

    // ✅ Check if all inputs are filled
    const values = inputsRef.current.map((input) => input?.value || "");
    setIsComplete(values.every((val) => val.trim().length === 1));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleTestCodeSubmit = async () => {
    const values = inputsRef.current.map((input) => input?.value || "");
    const code = values.join(""); // e.g. "12345"
    console.log("Entered Code:", code);
    await fetchTests(code);
  };

  const fetchTests = async (code: string) => {
    try {
      const testData = await getTest(code);
      if (!testData.isSuccessful) {
        throw new Error(testData.message);
      }
      setTestData(testData.data);
      console.log(testData.data);
    } catch (e) {
      console.log("Error in fetching", e);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-3xl font-bold  p-4 rounded text-center">Test Code</h1>
      <div className="flex space-x-2 p-1">
        {Array.from({ length: 5 }).map((_, idx) => (
          <input
            key={idx}
            type="text"
            maxLength={1}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            className="w-10 h-10 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          />
        ))}
      </div>

      <button
        onClick={async () => await handleTestCodeSubmit()}
        disabled={!isComplete} // ✅ disable when not complete
        className={`mt-4 px-4 py-2 rounded text-white transition ${
          isComplete
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Submit
      </button>
    </div>
  );
}
