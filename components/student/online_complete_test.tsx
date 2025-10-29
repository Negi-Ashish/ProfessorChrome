/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";

import { Test } from "@/structures/interfaceFile";

import { BackButton } from "../back";
import { TestCodeInput } from "./TestCode";

import { destroyPromptAPI, initPromptAPI } from "@/utils/promptClient";
import TypingLoader from "../Loader/TypingLoader";
import SpinnerLoader from "../Loader/SpinnerLoader";
import { getRandomScoreMessageFromTotal, TestsType } from "./offline_tests";
import { BookOpenCheck, StepBack, StepForward } from "lucide-react";

interface TeacherProp {
  handleBack: () => any;
  testState: any;
  chromeAPI: any;
}

export function OnlineCompleteTestComponent({
  handleBack,
  testState,
  chromeAPI,
}: TeacherProp) {
  const [testData, setTestData] = useState<Test | null>(null);
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

  // console.log("testData", testData);
  // console.log("subject", subject);
  // console.log("questions", questions);
  // console.log("selectedTest", selectedTest);

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
  }, [selectedTest, setPromptSession]);

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
      teacher = await initPromptAPI(selectedTest == "English");
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
        .map((q: { Q: any; A: any }, index: number) => {
          const studentAns = answers[index];
          if (selectedTest === "English") {
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
        `Subject: ${selectedTest}
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
    <div className="relative flex flex-col items-center overflow-auto overflow-x-hidden custom-scrollbar">
      {testData ? (
        <div className="max-w-6xl mx-auto min-h-fit ">
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
                      className="p-4 bg-[#18c99d] border border-green-500 hover:bg-blue-300 hover:border-blue-900 mb-2 min-w-xl rounded-2xl text-black cursor-pointer"
                      onClick={() =>
                        setSelectedTest(testName as keyof TestsType)
                      }
                    >
                      <h2 className={`text-xl font-semibold `}>{testName}</h2>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative p-6 max-w-3xl mx-auto text-gray-400 ">
                  <div className="relative mb-6">
                    <h2 className="font-semibold text-lg">
                      {currentIndex + 1}. {questions[currentIndex].Q}
                    </h2>

                    {promptResult[currentIndex] ? (
                      <div className="mt-2 break-words whitespace-pre-wrap  leading-relaxed">
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
                      className="relative block w-full mt-4 rounded-md bg-blue-300 px-3 py-2 text-base text-gray-900 
          outline-1 -outline-offset-1 outline-gray-300 
          placeholder:text-gray-900 focus:outline-2 focus:-outline-offset-2 
          focus:outline-indigo-600 sm:text-sm min-h-40 resize-none"
                    ></textarea>
                  </div>

                  <div className="flex ">
                    <button
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className={`absolute -left-20 top-40 px-4 py-2 rounded-md text-black ${
                        currentIndex === 0
                          ? "bg-gray-400"
                          : "bg-[#18c99d] border border-green-500 hover:bg-blue-300 hover:border-blue-900"
                      }`}
                      title="Previous Question"
                    >
                      <StepBack />
                    </button>

                    {currentIndex === questions.length - 1 ? (
                      <button
                        onClick={handleSubmit}
                        className={`absolute -right-20 top-40  px-4 py-2 rounded-md  text-black 
                       ${
                         !!pressedAnalyze[0]
                           ? "bg-gray-400"
                           : "bg-[#18c99d] border border-green-500 hover:bg-blue-300 hover:border-blue-900"
                       } `}
                        title="Finish Test"
                        disabled={!!pressedAnalyze[0]}
                      >
                        <BookOpenCheck />
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className={`absolute -right-20 top-40  px-4 py-2 rounded-md  text-black
                           bg-[#18c99d] border border-green-500 hover:bg-blue-300 hover:border-blue-900`}
                        title="Next Question"
                      >
                        <StepForward />
                      </button>
                    )}
                  </div>

                  {/* Modal */}
                  {showScore && (
                    <div className="fixed inset-0 bg-[#0d0f1a] bg-opacity-50 flex items-center justify-center z-50 text-black">
                      <div className="bg-blue-300 p-6 rounded shadow-lg max-w-sm w-full text-center relative">
                        {total ? (
                          <div>
                            <h2 className="text-2xl font-bold">
                              {total.totalScore} / {total.totalMarks}
                            </h2>
                            <p>
                              Total Questions answered: {total.totalQuestions}
                            </p>
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
                      </div>
                    </div>
                  )}

                  {showCompleteTestMsg && (
                    <div className="fixed inset-0 bg-[#0d0f1a] bg-opacity-50 flex items-center justify-center z-50 text-black">
                      <div className="bg-blue-300 p-6 rounded shadow-lg max-w-sm w-full text-center relative">
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
      ) : (
        <div>
          <BackButton styling="top-6 left-3" handleBack={handleBack} />
          <TestCodeInput setTestData={setTestData} />
        </div>
      )}
    </div>
  );
}
