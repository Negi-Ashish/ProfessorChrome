import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Test_One,
  Test_Two,
  Test_Three,
  Test_Four,
  Test_Five,
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
};

export function OfflineTest() {
  const [testAnswer, setTestAnswer] = useState("");
  const [selectedTest, setSelectedTest] = useState<"" | keyof TestsType>("");

  const Tests: TestsType = {
    "English I": Test_One,
    "English II": Test_Two,
    "English III": Test_Three,
    "English IV": Test_Four,
    "English V": Test_Five,
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
            <div>
              {Tests[selectedTest][`English`].map((item, idx) => (
                <div key={idx} className="py-5 gap-x-12 first:pt-0 sm:flex">
                  <ul className="relative flex-1 space-y-6 sm:last:pb-6 sm:space-y-8 pr-10">
                    <li>
                      <summary className="flex items-center justify-between font-semibold text-gray-700">
                        {idx + 1}. {item.Q}
                      </summary>
                      <p
                        dangerouslySetInnerHTML={{ __html: item.A }}
                        className="mt-3 text-gray-600 leading-relaxed"
                      ></p>
                      <textarea
                        id="test-name"
                        name="test-name"
                        value={testAnswer}
                        onChange={(e) => setTestAnswer(e.target.value)}
                        placeholder="Enter your answer..."
                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 
    outline-1 -outline-offset-1 outline-gray-300 
    placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 
    focus:outline-indigo-600 sm:text-sm min-h-40 resize-none"
                      ></textarea>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
