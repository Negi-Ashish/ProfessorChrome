/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";

import { Test } from "@/structures/interfaceFile";

import { BackButton } from "../back";
import { TestCodeInput } from "./TestCode";

import { destroyPromptAPI, initPromptAPI } from "@/utils/promptClient";
import TypingLoader from "../Loader/TypingLoader";
import { getRandomScoreMessageFromTotal, TestsType } from "./offline_tests";
import { initProofreader } from "@/utils/proofreaderClient";
import { BookOpenCheck, StepBack, StepForward } from "lucide-react";

interface TeacherProp {
  handleBack: () => any;
  testState: any;
  chromeAPI: any;
}

export function OnlineTestOneByOne({
  handleBack,
  testState,
  chromeAPI,
}: TeacherProp) {
  const [testData, setTestData] = useState<Test | null>(null);
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

  const Tests: any = useMemo(() => {
    return testData?.subjects || {};
  }, [testData]);

  const { questions } = useMemo(() => {
    if (!selectedTest || !(selectedTest in Tests)) {
      return { subject: "", questions: [] };
    }

    const questions = Tests[selectedTest];

    return { questions };
  }, [selectedTest, Tests]);

  useEffect(() => {
    async function fetchData() {
      const teacher = await initPromptAPI(selectedTest == "English");
      setPromptSession(teacher);
    }

    if (selectedTest != "") {
      fetchData();
    }

    return () => {
      destroyPromptAPI();
      setPromptSession(null);
    }; // cleanup on unmount
  }, [setPromptSession]);

  useEffect(() => {
    if (questions && questions.length > 0) {
      setPressedAnalyze(new Array(questions.length).fill(false));
    }
  }, [questions, setPressedAnalyze]);

  async function ChromeAPI() {
    if (answers[currentIndex] == undefined) {
      alert("Please write a answer.");
      return;
    }
    const newResult = [...pressedAnalyze];
    newResult[currentIndex] = true;
    setPressedAnalyze(newResult);

    const tasks = [];

    if (selectedTest === "English") {
      tasks.push(handleProofread());
    }

    tasks.push(promptAPI());

    await Promise.all(tasks);
  }

  async function promptAPI() {
    let teacher, prompt_result;
    if (!promptSession) {
      console.log("Creating new inside function");
      teacher = await initPromptAPI(selectedTest == "English");
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

      if (selectedTest == "English") {
        prompt_result = await teacher.prompt(
          `Subject: ${selectedTest}\n
          Question: ${questions[currentIndex].Q}\n
          Students Answer: ${answers[currentIndex]}
          
          If you don’t understand the answer, just provide the sample correct answer to the question in the rephrased version.
          Explain the core concept. Return only plain text — no Markdown, no asterisks, no formatting.
  `,
          { responseConstraint: evaluationSchema },
          { signal: signal }
        );
        console.log("English", prompt_result);
      } else {
        prompt_result = await teacher.prompt(
          `Subject: ${selectedTest}\n
          Question: ${questions[currentIndex].Q}\n
          Correct Answer: ${questions[currentIndex].A}\n
          Students Answer: ${answers[currentIndex]}
          
          If you don’t understand the answer, just provide the correct answer correct answer to the question in the rephrased version.
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
    <div className="relative flex flex-col items-center overflow-auto overflow-x-hidden custom-scrollbar">
      {testData ? (
        <div className="max-w-6xl mx-auto min-h-fit">
          <BackButton styling="top-6 left-3" handleBack={handleBack} />
          <div className="flex flex-wrap gap-4 max-h-[80vh]  p-4 justify-center">
            <div className="mt-10  min-w-5xl ">
              {selectedTest == "" ? (
                <div className="flex flex-col text-center items-center">
                  <h1 className={`mb-2 text-2xl font-bold`}>
                    {testData?.test_name}
                  </h1>
                  {Object.entries(Tests).map(([testName]) => (
                    <div
                      key={testName}
                      className="p-4 mb-2 min-w-xl rounded-2xl cursor-pointer bg-[#18c99d] border border-green-500 hover:bg-blue-300 hover:border-blue-900 text-black"
                      onClick={() =>
                        setSelectedTest(testName as keyof TestsType)
                      }
                    >
                      <h2 className="text-xl font-semibold ">{testName}</h2>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative p-6 max-w-3xl mx-auto text-gray-400">
                  <div className="relative mb-6">
                    <h2 className="font-semibold text-lg ">
                      {currentIndex + 1}. {questions[currentIndex].Q}
                    </h2>

                    {result[currentIndex] ? (
                      <div className="mt-4 break-words whitespace-pre-wrap leading-relaxed">
                        {result[currentIndex].correctedInput !==
                          answers[currentIndex] && (
                          <div>
                            <p className="font-bold text-gray-300">
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
                      selectedTest == "English" && <TypingLoader />
                    )}

                    {promptResult[currentIndex] ? (
                      <div className="mt-2 break-words whitespace-pre-wrap leading-relaxed">
                        {promptResult[currentIndex].feedback && (
                          <div>
                            <p className="font-bold text-gray-300">Score:</p>
                            <p className="">
                              {promptResult[currentIndex].score}
                            </p>
                            <p className="font-bold text-gray-300">
                              Needs Improvement:
                            </p>
                            <p className="">
                              {promptResult[currentIndex].isCorrect
                                ? "No"
                                : "Yes"}
                            </p>
                            <p className="font-bold text-gray-300">Feedback:</p>
                            <p className="">
                              {promptResult[currentIndex].feedback}
                            </p>
                            <p className="font-bold text-gray-300">
                              Rephrased / Correct Version:
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
                      className="relative block w-full mt-4 rounded-md bg-blue-300 px-3 py-2 text-base text-gray-900 
          outline-1 -outline-offset-1 outline-gray-300 
          placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 
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
                      className={`absolute -left-20 top-40 px-4 py-2 rounded-md text-black ${
                        currentIndex === 0 ||
                        (pressedAnalyze[currentIndex] &&
                          !promptResult[currentIndex])
                          ? "bg-gray-400"
                          : "bg-[#18c99d] border border-green-500 hover:bg-blue-300 hover:border-blue-900"
                      }`}
                      title="Previous Question"
                    >
                      <StepBack />
                    </button>

                    <button
                      onClick={async () => await ChromeAPI()}
                      disabled={pressedAnalyze[currentIndex]}
                      className={`px-4 py-2  rounded absolute right-7 bottom-0 text-black
                         ${
                           pressedAnalyze[currentIndex]
                             ? "bg-gray-400"
                             : "bg-[#18c99d] border border-green-500 hover:bg-green-400 hover:border-blue-900"
                         }
                     `}
                    >
                      Analyze
                    </button>

                    {currentIndex === questions.length - 1 ? (
                      <button
                        onClick={handleSubmit}
                        className={`absolute -right-20 top-40  px-4 py-2 rounded-md  text-black 
                       ${
                         pressedAnalyze[currentIndex] &&
                         !promptResult[currentIndex]
                           ? "bg-gray-400"
                           : "bg-[#18c99d] border border-green-500 hover:bg-blue-300 hover:border-blue-900"
                       } `}
                        title="Finish Test"
                        disabled={
                          pressedAnalyze[currentIndex] &&
                          !promptResult[currentIndex]
                        }
                      >
                        <BookOpenCheck />
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className={`absolute -right-20 top-40  px-4 py-2 rounded-md  text-black 
                       ${
                         pressedAnalyze[currentIndex] &&
                         !promptResult[currentIndex]
                           ? "bg-gray-400"
                           : "bg-[#18c99d] border border-green-500 hover:bg-blue-300 hover:border-blue-900"
                       } `}
                        title="Next Question"
                        disabled={
                          pressedAnalyze[currentIndex] &&
                          !promptResult[currentIndex]
                        }
                      >
                        <StepForward />
                      </button>
                    )}
                  </div>

                  {/* Modal */}
                  {showScore && total && (
                    <div className="fixed inset-0 bg-[#0d0f1a] bg-opacity-50 flex items-center justify-center z-50">
                      <div className="flex flex-col bg-blue-300 p-6 rounded shadow-lg max-w-sm w-full   text-black">
                        <p className="font-bold text-black text-2xl mt-2">
                          Marks Obtained
                        </p>
                        <p className="text-xl font-medium">
                          {total.totalScore} / {total.totalMarks}
                        </p>

                        <p className="font-bold text-black text-2xl mt-2">
                          Questions Attempted (Total)
                        </p>
                        <p className="text-xl font-medium">
                          {total.totalQuestions}
                        </p>

                        <p className="font-bold text-black text-2xl mt-2">
                          Remark
                        </p>
                        <p className="text-xl font-medium">{total.message}</p>

                        <button
                          onClick={() => setShowScore(false)}
                          className="px-4 py-2 mt-5 bg-blue-700 text-black rounded hover:bg-blue-500"
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
      ) : (
        <div>
          <BackButton styling="top-6 left-3" handleBack={handleBack} />
          <TestCodeInput setTestData={setTestData} />
        </div>
      )}
    </div>
  );
}
