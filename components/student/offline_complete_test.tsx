/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import {
  getRandomScoreMessageFromTotal,
  Tests,
  TestsType,
} from "./offline_tests";

import { destroyPromptAPI, initPromptAPI } from "@/utils/promptClient";
import TypingLoader from "../Loader/TypingLoader";
import SpinnerLoader from "../Loader/SpinnerLoader";
interface OfflineProps {
  testState: any;
  chromeAPI: any;
}

export function OfflineCompleteTest({ testState, chromeAPI }: OfflineProps) {
  // AoBrNWZcn2CqtE1uE9nSbCjI+TBQLZN/PJJxNwo9ToEhvaUl0Yoon2gb9W6B06R+s7DgE3Vpxeb/pF0DXZVmsAcAAABTeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJmZWF0dXJlIjoiQUlQcm9vZnJlYWRlckFQSSIsImV4cGlyeSI6MTc3OTE0ODgwMH0=
  const [showCompleteTestMsg, setShowCompleteTestMsg] = useState(false);
  const {
    selectedTest,
    setSelectedTest,
    promptResult,
    setPromptResult,
    answers,
    setAnswers,
    pressedAnalyze,
    setPressedAnalyze,
    currentIndex,
    setCurrentIndex,
    showScore,
    setShowScore,
    total,
    setTotal,
  } = testState;

  const { promptSession, setPromptSession } = chromeAPI;

  const questions = useMemo(() => {
    return selectedTest && selectedTest in Tests
      ? Object.values(Tests[selectedTest as keyof TestsType])[0]
      : [];
  }, [selectedTest]);

  const subject =
    selectedTest && selectedTest in Tests
      ? Object.keys(Tests[selectedTest as keyof TestsType])[0]
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
  }, [subject, setPromptSession]);

  async function ChromeAPI() {
    // if (subject == "English") {
    //   await handleProofread();
    // }
    const prompt_result = await promptAPIBulk();

    return prompt_result;
  }

  async function promptAPIBulk() {
    let teacher, prompt_result, prompt_result_array;
    if (!promptSession) {
      teacher = await initPromptAPI(subject == "English");
    } else {
      teacher = promptSession;
    }

    if (teacher) {
      const controller = new AbortController();
      const signal = controller.signal;

      const evaluationBatchSchema = {
        type: "array",
        items: {
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
              description: "Provided answer is correct or incorrect.",
            },
            feedback: {
              type: "string",
              description:
                "Explanation of what was good or wrong in the answer and why the score was given.",
            },
            rephrase: {
              type: "string",
              description:
                "A better or corrected version of the student's answer, written clearly.",
            },
          },
          required: ["score", "feedback", "rephrase", "isCorrect"],
        },
      };

      // Build prompt content dynamically
      const formattedQA = questions
        .map((q, index) => {
          const studentAns = answers[index];
          if (subject === "English") {
            return `
Question ${index + 1}: ${q.Q}
Student Answer: ${studentAns}
`;
          } else {
            return `
Question ${index + 1}: ${q.Q}
Correct Answer: ${q.A}
Student Answer: ${studentAns}
`;
          }
        })
        .join("\n");

      console.log("formattedQA", formattedQA);

      prompt_result = await teacher.prompt(
        `Subject: ${subject}
Evaluate each question independently.
Return an array where each item contains:
score (0–10), isCorrect, feedback, rephrase

${formattedQA}

Return only plain text — no Markdown formatting.`,
        { responseConstraint: evaluationBatchSchema },
        { signal: signal }
      );

      console.log("Batch Results", prompt_result);

      prompt_result_array = JSON.parse(prompt_result as string);

      setPromptResult(prompt_result_array);
    }

    return prompt_result_array;
  }

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev: number) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev: number) => prev - 1);
    }
  };

  const areAllAnswersValid = () => {
    // Check if both arrays exist and have same length
    if (!Array.isArray(answers) || !Array.isArray(questions)) return false;
    if (answers.length !== questions.length) return false;

    // Check every element is a non-empty string and not a hole
    return answers.every(
      (ans, index) =>
        answers.hasOwnProperty(index) &&
        typeof ans === "string" &&
        ans.trim().length > 0
    );
  };

  const handleSubmit = async () => {
    if (!areAllAnswersValid()) {
      setShowCompleteTestMsg(true);
      return;
    }
    setPressedAnalyze([true]);
    setShowScore(true);
    // const promptResult = await promptAPIBulk();
    const chrome_api_response = await ChromeAPI();

    console.log("chrome_api_response", chrome_api_response);

    const validResults = chrome_api_response.filter(
      (item: { score: null }) => item && item.score != null
    );

    const totalScore = validResults.reduce(
      (sum: any, item: { score: any }) => sum + item.score,
      0
    );
    // Average score (optional)
    const totalQuestions = validResults.length;
    const totalMarks = totalQuestions * 10;
    const message = getRandomScoreMessageFromTotal(totalScore, totalMarks);
    setTotal({
      message,
      totalMarks,
      totalScore,
      totalQuestions,
    });
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

                {promptResult[currentIndex] ? (
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
                ) : (
                  pressedAnalyze[0] && <TypingLoader />
                )}

                <textarea
                  value={answers[currentIndex] || ""}
                  disabled={pressedAnalyze?.[0]}
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

                {currentIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className={`absolute -right-20 top-40  px-4 py-2 rounded-md  text-white 
                       ${
                         !!pressedAnalyze[0]
                           ? "bg-gray-400"
                           : "bg-indigo-600 hover:bg-indigo-700"
                       } `}
                    title="Finish Test"
                    disabled={!!pressedAnalyze[0]}
                  >
                    🏁
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className={`absolute -right-20 top-40  px-4 py-2 rounded-md  text-white bg-indigo-600 hover:bg-indigo-700`}
                    title="Next Question"
                  >
                    ➡️
                  </button>
                )}
              </div>

              {/* Modal */}
              {showScore && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center relative">
                    {total ? (
                      <div>
                        <h2 className="text-2xl font-bold">
                          {total.totalScore} / {total.totalMarks}
                        </h2>
                        <p>Total Questions answered: {total.totalQuestions}</p>
                        <h2 className="text-2xl font-bold mb-4">
                          {total.message}
                        </h2>
                        <button
                          onClick={() => setShowScore(false)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Close
                        </button>
                      </div>
                    ) : (
                      <div>
                        <SpinnerLoader />
                      </div>
                    )}
                    {showCompleteTestMsg && (
                      <div>
                        <h2 className="text-2xl font-bold mb-4">
                          All questions must be answered before submitting the
                          test.
                        </h2>
                        <button
                          onClick={() => setShowCompleteTestMsg(false)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {showCompleteTestMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center relative">
                    <div>
                      <p className="text-xl font-bold mb-4">
                        All questions must be answered before submitting the
                        test.
                      </p>
                      <button
                        onClick={() => setShowCompleteTestMsg(false)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
