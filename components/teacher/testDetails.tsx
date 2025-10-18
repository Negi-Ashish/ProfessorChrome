import React, { Dispatch, SetStateAction } from "react";
import { TeacherDocument, Test } from "@/structures/interfaceFile";
import { TeacherMode } from "@/structures/typeFile";
import { ActionCard } from "../ActionCard";
// import { TeacherDocument } from "@/structures/interfaceFile";

interface TestDetailsProps {
  setTeacherMode: Dispatch<SetStateAction<TeacherMode>>;
  teacherCode: string;
  setTeacherData: Dispatch<SetStateAction<TeacherDocument | null>>;
  selectedTest: Test | null;
}

export function TestDetails({
  setTeacherMode,
  selectedTest,
}: TestDetailsProps) {
  //   const handleDeleteTest = async (test_code: string) => {
  //     const payload: DeleteTeacherPayload = {
  //       teacher: {
  //         code: teacherCode,
  //         test_code: test_code,
  //       },
  //     };

  //     try {
  //       const new_tests = await delTeacher(payload);
  //       console.log("Deleted successfully:", new_tests);
  //       if (!new_tests.isSuccessful) {
  //         throw new Error(new_tests.message);
  //       }
  //       setTeacherData(new_tests.data);
  //     } catch (err) {
  //       console.error("Error deleting teacher:", err);
  //     }
  //   };
  return (
    <div className="max-w-6xl mx-auto min-h-fit">
      <div className="flex flex-wrap gap-4 max-h-[80vh]  p-4 justify-center">
        <form>
          <div className="space-y-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-2xl font-bold text-gray-900"
                >
                  {selectedTest?.test_name} (Code: {selectedTest?.test_code})
                </label>
              </div>
            </div>
          </div>
          <div className="border-b border-gray-900/10 my-5" />

          <div className="border-b border-gray-900/10 pb-5">
            {selectedTest && selectedTest.subjects ? (
              <div>
                <h1 className="text-xl font-semibold text-gray-900 mt-5 mb-2">
                  Subjects
                </h1>
                {Object.keys(selectedTest.subjects).map((subjectName) => (
                  <ActionCard key={subjectName} name={subjectName} />
                ))}
              </div>
            ) : (
              <h1 className="text-xl font-semibold text-gray-900 mt-5 mb-2">
                No subjects have been added to this test yet — please create
                one.
              </h1>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm/6 font-semibold text-gray-900"
              onClick={() => {
                setTeacherMode("view");
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add New
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

{
  /* {Object.entries(test.subjects).map(([subjectName, questions]) => (
                <div key={subjectName}>
                  <h4>Subject: {subjectName}</h4>
                  <ul>
                    {questions.map((qObj, idx) => (
                      <li key={idx}>
                        {Object.entries(qObj).map(([k, v]) => (
                          <p key={k}>
                            <strong>{k}:</strong> {v}
                          </p>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              ))} */
}
