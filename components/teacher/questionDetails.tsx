import React, { Dispatch, SetStateAction } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { TeacherDocument, Test } from "@/structures/interfaceFile";
import { TeacherMode } from "@/structures/typeFile";
import { ActionCard } from "../ActionCard";
// import { TeacherDocument } from "@/structures/interfaceFile";

interface QuestionDetailsProps {
  setTeacherMode: Dispatch<SetStateAction<TeacherMode>>;
  teacherCode: string;
  setTeacherData: Dispatch<SetStateAction<TeacherDocument | null>>;
  selectedTest: Test | null;
}

export function QuestionDetails({
  setTeacherMode,
  selectedTest,
}: QuestionDetailsProps) {
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
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon
                      aria-hidden="true"
                      className="mx-auto size-12 text-gray-300"
                    />
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-5">
            <h2 className="text-base/7 font-semibold text-gray-900 mt-5">
              Subjects
            </h2>

            <ActionCard />
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
