/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo } from "react";
import {
  getRandomScoreMessageFromTotal,
  Tests,
  TestsType,
} from "./offline_tests";

import { initProofreader } from "@/utils/proofreaderClient";
import { destroyPromptAPI, initPromptAPI } from "@/utils/promptClient";
import TypingLoader from "../Loader/TypingLoader";
interface OfflineProps {
  testState: any;
  chromeAPI: any;
}

export function OfflineTestOneByOne({ testState, chromeAPI }: OfflineProps) {
  // AoBrNWZcn2CqtE1uE9nSbCjI+TBQLZN/PJJxNwo9ToEhvaUl0Yoon2gb9W6B06R+s7DgE3Vpxeb/pF0DXZVmsAcAAABTeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJmZWF0dXJlIjoiQUlQcm9vZnJlYWRlckFQSSIsImV4cGlyeSI6MTc3OTE0ODgwMH0=
  const {
    selectedTest,
    setSelectedTest,
    result,
    setResult,
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

  const {
    proofreaderSession,
    setProofReaderSession,
    promptSession,
    setPromptSession,
  } = chromeAPI;

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

  useEffect(() => {
    if (questions && questions.length > 0) {
      setPressedAnalyze(new Array(questions.length).fill(false));
    }
  }, [questions, setPressedAnalyze]);

  async function ChromeAPI() {
    const newResult = [...pressedAnalyze];
    newResult[currentIndex] = true;
    setPressedAnalyze(newResult);

    const tasks = [];

    if (subject === "English") {
      tasks.push(handleProofread());
    }

    tasks.push(promptAPI());

    await Promise.all(tasks);
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
      setCurrentIndex((prev: number) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev: number) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const validResults = promptResult.filter(
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
    setShowScore(true);
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

                {result[currentIndex] ? (
                  <div className="mt-4 break-words whitespace-pre-wrap text-gray-600 leading-relaxed">
                    {result[currentIndex].correctedInput !==
                      answers[currentIndex] && (
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
                ) : (
                  pressedAnalyze[currentIndex] &&
                  subject == "English" && <TypingLoader />
                )}

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
                  pressedAnalyze[currentIndex] && <TypingLoader />
                )}

                <textarea
                  value={answers[currentIndex] || ""}
                  disabled={pressedAnalyze[currentIndex]}
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
                  disabled={
                    currentIndex === 0 ||
                    (pressedAnalyze[currentIndex] &&
                      !promptResult[currentIndex])
                  }
                  className={`absolute -left-20 top-40 px-4 py-2 rounded-md text-white ${
                    currentIndex === 0 ||
                    (pressedAnalyze[currentIndex] &&
                      !promptResult[currentIndex])
                      ? "bg-gray-400"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                  title="Previous Question"
                >
                  ⬅️
                </button>

                <button
                  onClick={async () => await ChromeAPI()}
                  disabled={pressedAnalyze[currentIndex]}
                  className={`px-4 py-2 bg-blue-600 text-white rounded absolute right-7 bottom-0 
                         ${pressedAnalyze[currentIndex] && "bg-gray-400"}
                     `}
                >
                  Analyze
                </button>

                {currentIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className={`absolute -right-20 top-40  px-4 py-2 rounded-md  text-white 
                       ${
                         pressedAnalyze[currentIndex] &&
                         !promptResult[currentIndex]
                           ? "bg-gray-400"
                           : "bg-indigo-600 hover:bg-indigo-700"
                       } `}
                    title="Finish Test"
                    disabled={
                      pressedAnalyze[currentIndex] &&
                      !promptResult[currentIndex]
                    }
                  >
                    🏁
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className={`absolute -right-20 top-40  px-4 py-2 rounded-md  text-white 
                       ${
                         pressedAnalyze[currentIndex] &&
                         !promptResult[currentIndex]
                           ? "bg-gray-400"
                           : "bg-indigo-600 hover:bg-indigo-700"
                       } `}
                    title="Next Question"
                    disabled={
                      pressedAnalyze[currentIndex] &&
                      !promptResult[currentIndex]
                    }
                  >
                    ➡️
                  </button>
                )}
              </div>

              {/* Modal */}
              {showScore && total && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center relative">
                    <h2 className="text-2xl font-bold">
                      {total.totalScore} / {total.totalMarks}
                    </h2>
                    <p>Total Questions answered: {total.totalQuestions}</p>
                    <h2 className="text-xl font-bold mb-4">{total.message}</h2>

                    <button
                      onClick={() => setShowScore(false)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Close
                    </button>
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
