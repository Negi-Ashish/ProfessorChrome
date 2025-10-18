import React, { Dispatch, SetStateAction } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { Subjects, TeacherDocument, Test } from "@/structures/interfaceFile";
import { TeacherMode } from "@/structures/typeFile";

// import { TeacherDocument } from "@/structures/interfaceFile";

interface QuestionDetailsProps {
  setTeacherMode: Dispatch<SetStateAction<TeacherMode>>;
  teacherCode: string;
  setTeacherData: Dispatch<SetStateAction<TeacherDocument | null>>;
  selectedTest: Test | null;
  selectedSubject: Subjects | null;
  setSelectedSubject: Dispatch<SetStateAction<Subjects | null>>;
}

export function QuestionDetails({
  setTeacherMode,
  selectedTest,
  selectedSubject,
  setSelectedSubject,
}: QuestionDetailsProps) {
  let subjectName;
  if (selectedSubject) {
    subjectName = Object.keys(selectedSubject)[0]; // "history1"
  }
  // console.log("selectedSubject", selectedSubject);

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
            <h2 className="text-xl font-semibold text-gray-900 mt-5">
              {subjectName}
            </h2>
          </div>

          <div className="mt-10 divide-y">
            {selectedSubject &&
              selectedSubject[`${subjectName}`].map((item, idx) => (
                <div key={idx} className="py-5 gap-x-12 first:pt-0 sm:flex">
                  <ul className="flex-1 space-y-6 sm:last:pb-6 sm:space-y-8">
                    <li>
                      <summary className="flex items-center justify-between font-semibold text-gray-700">
                        {item.Q}
                      </summary>
                      <p
                        dangerouslySetInnerHTML={{ __html: item.A }}
                        className="mt-3 text-gray-600 leading-relaxed"
                      ></p>
                    </li>
                  </ul>
                </div>
              ))}
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm/6 font-semibold text-gray-900"
              onClick={() => {
                setSelectedSubject(null);
                setTeacherMode("test_details");
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
