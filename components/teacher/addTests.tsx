import { TeacherMode } from "@/structures/typeFile";
import React, { Dispatch, SetStateAction } from "react";

// import { TeacherDocument } from "@/structures/interfaceFile";

interface AddTestsProps {
  setTeacherMode: Dispatch<SetStateAction<TeacherMode>>;
}

export function AddTests({ setTeacherMode }: AddTestsProps) {
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
    <div className="max-w-6xl mx-auto min-h-fit ">
      <div className="flex justify-center">
        <form className="">
          <div className="border-b border-gray-900/10 p-10">
            <div className="col-span-full">
              <label
                htmlFor="test-code"
                className="block text-sm/6 font-medium text-gray-900 -mt-4"
              >
                Test Code
              </label>
              <div className="mt-2">
                <input
                  id="test-code"
                  name="test-code"
                  type="text"
                  autoComplete="test-code"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="test-name"
                className="block text-sm/6 font-medium text-gray-900 mt-4"
              >
                Test Name
              </label>
              <div className="mt-2">
                <input
                  id="test-name"
                  name="test-name"
                  type="text"
                  autoComplete="test-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
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
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
