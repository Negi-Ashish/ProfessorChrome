import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Tests,
  TestsType,
  getRandomNoCorrectionMessage,
} from "./offline_tests";

import { initProofreader } from "@/utils/proofreaderClient";
import { initPromptAPI } from "@/utils/promptClient";

interface OfflineProps {
  proofreaderSession: Proofreader | null;
  setProofReaderSession: Dispatch<SetStateAction<Proofreader | null>>;
}

export function OfflineTest({
  proofreaderSession,
  setProofReaderSession,
}: OfflineProps) {
  // AoBrNWZcn2CqtE1uE9nSbCjI+TBQLZN/PJJxNwo9ToEhvaUl0Yoon2gb9W6B06R+s7DgE3Vpxeb/pF0DXZVmsAcAAABTeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJmZWF0dXJlIjoiQUlQcm9vZnJlYWRlckFQSSIsImV4cGlyeSI6MTc3OTE0ODgwMH0=
  const [selectedTest, setSelectedTest] = useState<"" | keyof TestsType>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const questions =
    selectedTest && selectedTest in Tests ? Tests[selectedTest]["English"] : [];

  // async function testAPI() {
  //   const teacher = await initPromptAPI();
  //   if (teacher) {
  //     const controller = new AbortController();
  //     const signal = controller.signal;

  //     const evaluationSchema = {
  //       type: "object",
  //       properties: {
  //         score: {
  //           type: "number",
  //           description: "Marks given to the student's answer (out of 10).",
  //           minimum: 0,
  //           maximum: 10,
  //         },
  //         feedback: {
  //           type: "string",
  //           description:
  //             "Explanation of what was good or wrong in the answer and why the score was given.",
  //         },
  //         rephrase: {
  //           type: "string",
  //           description:
  //             "A better or corrected version of the student's answer, written in a clear and natural way.",
  //         },

  //       },
  //       required: ["score", "feedback", "rephrase"],
  //     };

  //     const result = await teacher.prompt(
  //       `Question: What is the capital of France?\nAnswer: The capital of France is London.`,
  //       { responseConstraint: evaluationSchema },
  //       { signal: signal }
  //     );
  //     console.log(result);
  //   }
  // }

  async function handleProofread() {
    if (answers[currentIndex] == undefined) {
      alert("Please write a answer.");
    }
    const text = answers[currentIndex];
    if (!proofreaderSession) {
      console.log("Creating New Session");
      const proofreader = await initProofreader();
      setProofReaderSession(proofreader);
      const proofreadResult = await proofreader?.proofread(text);
      console.log(proofreadResult);
      const newResult = [...result];
      newResult[currentIndex] = proofreadResult;
      setResult(newResult);
    } else {
      console.log("Old Session");
      const proofreadResult = await proofreaderSession?.proofread(text);
      const newResult = [...result];
      newResult[currentIndex] = proofreadResult;
      setResult(newResult);
      console.log(proofreadResult);
    }
  }

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto min-h-fit">
      <div className="flex flex-wrap gap-4 max-h-[80vh]  p-4 justify-center">
        <div className="mt-10  min-w-5xl ">
          {selectedTest == "" ? (
            <div className="flex flex-col text-center items-center">
              {Object.entries(Tests).map(([testName]) => (
                <div
                  key={testName}
                  className="p-4 bg-yellow-300 mb-2 min-w-xl rounded-2xl hover:bg-green-400 cursor-pointer"
                  onClick={() => setSelectedTest(testName as keyof TestsType)}
                >
                  <h2 className="text-xl font-semibold ">{testName}</h2>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative p-6 max-w-3xl mx-auto  ">
              <div className="relative mb-6">
                <h2 className="font-semibold text-lg text-gray-800">
                  {currentIndex + 1}. {questions[currentIndex].Q}
                </h2>

                {result[currentIndex] && (
                  <div className="mt-4 break-words whitespace-pre-wrap text-gray-600 leading-relaxed">
                    {result[currentIndex].correctedInput ==
                    answers[currentIndex] ? (
                      <div>
                        <p className="font-bold text-black">Perfect Answer!</p>
                        <p className="">{getRandomNoCorrectionMessage()}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-black">
                          Improved Version:{" "}
                        </p>
                        <p className="">
                          {result[currentIndex].correctedInput}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <textarea
                  value={answers[currentIndex] || ""}
                  disabled={result[currentIndex] ? true : false}
                  onChange={handleAnswerChange}
                  placeholder="Enter your answer..."
                  className="relative block w-full mt-4 rounded-md bg-white px-3 py-2 text-base text-gray-900 
          outline-1 -outline-offset-1 outline-gray-300 
          placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 
          focus:outline-indigo-600 sm:text-sm min-h-40 resize-none"
                ></textarea>
              </div>

              <div className="flex ">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`absolute -left-20 top-40 px-4 py-2 rounded-md text-white ${
                    currentIndex === 0
                      ? "bg-gray-400"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                  title="Previous Question"
                >
                  ⬅️
                </button>
                {/* <button
                  onClick={handleNext}
                  className="absolute right-7 bottom-0 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
                  title="AI Analysis"
                >
                  Analyze
                </button> */}

                <button
                  onClick={async () => await handleProofread()}
                  disabled={result[currentIndex] ? true : false}
                  className={`px-4 py-2 bg-blue-600 text-white rounded absolute right-7 bottom-0 
                         ${result[currentIndex] && "bg-gray-400"}
                     `}
                >
                  Proofread
                </button>

                {currentIndex === questions.length - 1 ? (
                  <button
                    onClick={() => console.log("Submit answers:", answers)}
                    className="absolute -right-20 top-40 px-4 py-2 rounded-md bg-indigo-600 hover:bg-green-700 text-white"
                    title="Finish Test"
                  >
                    🏁
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="absolute -right-20 top-40  px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
                    title="Next Question"
                  >
                    ➡️
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
