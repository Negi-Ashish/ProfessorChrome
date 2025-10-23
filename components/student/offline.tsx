import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Tests,
  TestsType,
  getRandomNoCorrectionMessage,
} from "./offline_tests";

import { initProofreader } from "@/utils/proofreaderClient";
import { destroyPromptAPI, initPromptAPI } from "@/utils/promptClient";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [promptResult, setPromptResult] = useState<any>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const [promptSession, setPromptSession] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any>(null);

  const questions =
    selectedTest && selectedTest in Tests
      ? Object.values(Tests[selectedTest])[0]
      : [];

  const subject =
    selectedTest && selectedTest in Tests
      ? Object.keys(Tests[selectedTest])[0]
      : "";

  useEffect(() => {
    async function fetchData() {
      const teacher = await initPromptAPI(subject == "English");
      setPromptSession(teacher);
    }

    if (subject != "") {
      fetchData();
    }

    return () => {
      destroyPromptAPI();
      setPromptSession(null);
    }; // cleanup on unmount
  }, [subject]);

  async function ChromeAPI() {
    if (subject == "English") {
      await handleProofread();
    }
    await promptAPI();
  }

  async function promptAPI() {
    let teacher, prompt_result;
    if (!promptSession) {
      console.log("Creating new inside function");
      teacher = await initPromptAPI(subject == "English");
    } else {
      teacher = promptSession;
    }

    if (teacher) {
      const controller = new AbortController();
      const signal = controller.signal;

      const evaluationSchema = {
        type: "object",
        properties: {
          score: {
            type: "number",
            description: "Marks given to the student's answer (out of 10).",
            minimum: 0,
            maximum: 10,
          },
          isCorrect: {
            type: "boolean",
            description: "Provided answer is correct or in correct.",
          },
          feedback: {
            type: "string",
            description:
              "Explanation of what was good or wrong in the answer and why the score was given.",
          },
          rephrase: {
            type: "string",
            description:
              "A better or corrected version of the student's answer, written in a clear and natural way.",
          },
        },
        required: ["score", "feedback", "rephrase", "isCorrect"],
      };

      if (subject == "English") {
        prompt_result = await teacher.prompt(
          `Subject: ${subject}\n
        Question: ${questions[currentIndex].Q}\n
        Students Answer: ${answers[currentIndex]}
        
        Explain the core concept. Return only plain text — no Markdown, no asterisks, no formatting.
`,
          { responseConstraint: evaluationSchema },
          { signal: signal }
        );
        console.log("English", prompt_result);
      } else {
        prompt_result = await teacher.prompt(
          `Subject: ${subject}\n
        Question: ${questions[currentIndex].Q}\n
        Correct Answer: ${questions[currentIndex].A}\n
        Students Answer: ${answers[currentIndex]}
        
        Explain the core concept. Return only plain text — no Markdown, no asterisks, no formatting.
`,
          { responseConstraint: evaluationSchema },
          { signal: signal }
        );
        console.log("Others", prompt_result);
      }
      const prompt_result_json = JSON.parse(prompt_result as string);
      const newResult = [...promptResult];
      newResult[currentIndex] = prompt_result_json;
      setPromptResult(newResult);
    }
  }

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

                {promptResult[currentIndex] && (
                  <div className="mt-2 break-words whitespace-pre-wrap text-gray-600 leading-relaxed">
                    {promptResult[currentIndex].feedback && (
                      <div>
                        <p className="font-bold text-black">Score:</p>
                        <p className="">{promptResult[currentIndex].score}</p>
                        <p className="font-bold text-black">
                          Needs Improvement:
                        </p>
                        <p className="">
                          {promptResult[currentIndex].isCorrect ? "No" : "Yes"}
                        </p>
                        <p className="font-bold text-black">Feedback:</p>
                        <p className="">
                          {promptResult[currentIndex].feedback}
                        </p>
                        <p className="font-bold text-black">
                          Rephrased Version:
                        </p>
                        <p className="">
                          {promptResult[currentIndex].rephrase}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <textarea
                  value={answers[currentIndex] || ""}
                  disabled={promptResult[currentIndex] ? true : false}
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
                  onClick={async () => await ChromeAPI()}
                  disabled={promptResult[currentIndex] ? true : false}
                  className={`px-4 py-2 bg-blue-600 text-white rounded absolute right-7 bottom-0 
                         ${promptResult[currentIndex] && "bg-gray-400"}
                     `}
                >
                  Analyze
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
