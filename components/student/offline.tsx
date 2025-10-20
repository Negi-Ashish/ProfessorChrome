import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Test_One,
  Test_Two,
  Test_Three,
  Test_Four,
  Test_Five,
  Test_Six,
  Test,
} from "./offline_tests";
import { Subjects } from "@/structures/interfaceFile";

interface OfflineProps {
  selectedSubject: Subjects | null;
}
type TestsType = {
  "English I": Test;
  "English II": Test;
  "English III": Test;
  "English IV": Test;
  "English V": Test;
  "English VI": Test;
};

export function OfflineTest() {
  const [selectedTest, setSelectedTest] = useState<"" | keyof TestsType>("");

  const Tests: TestsType = {
    "English I": Test_One,
    "English II": Test_Two,
    "English III": Test_Three,
    "English IV": Test_Four,
    "English V": Test_Five,
    "English VI": Test_Six,
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const questions =
    selectedTest && selectedTest in Tests ? Tests[selectedTest]["English"] : [];

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
              <div className="mb-6">
                <h2 className="font-semibold text-lg text-gray-800">
                  {currentIndex + 1}. {questions[currentIndex].Q}
                </h2>
                <p
                  dangerouslySetInnerHTML={{
                    __html: questions[currentIndex].A,
                  }}
                  className="mt-3 text-gray-600 leading-relaxed"
                ></p>

                <textarea
                  value={answers[currentIndex] || ""}
                  onChange={handleAnswerChange}
                  placeholder="Enter your answer..."
                  className="block w-full mt-4 rounded-md bg-white px-3 py-2 text-base text-gray-900 
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
                <button
                  onClick={handleNext}
                  className="absolute right-7 bottom-0 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
                  title="AI Analysis"
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
