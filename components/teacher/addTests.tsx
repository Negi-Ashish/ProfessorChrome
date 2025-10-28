import { createTest } from "@/api_call/backend_calls";
import { TeacherDocument, TeacherPayload } from "@/structures/interfaceFile";
import { TeacherMode } from "@/structures/typeFile";
import React, { Dispatch, SetStateAction, useState } from "react";

// import { TeacherDocument } from "@/structures/interfaceFile";

interface AddTestsProps {
  setTeacherMode: Dispatch<SetStateAction<TeacherMode>>;
  teacherCode: string;
  setTeacherData: Dispatch<SetStateAction<TeacherDocument | null>>;
}

export function AddTests({
  setTeacherMode,
  teacherCode,
  setTeacherData,
}: AddTestsProps) {
  const [testCode, setTestCode] = useState("");
  const [testName, setTestName] = useState("");
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({});

  // Validation function
  const validate = () => {
    const newErrors: typeof errors = {};

    // Test code: exactly 5 alphanumeric characters
    if (!/^[a-zA-Z0-9]{5}$/.test(testCode)) {
      newErrors.code = "Test code must be exactly 5 letters/numbers.";
    }

    // Test name: at least 3 letters
    if (testName.trim().length < 3) {
      newErrors.name = "Test name must be at least 3 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      // do something with the values
      await createTestCode();
    }
  };

  const createTestCode = async () => {
    try {
      const payload: TeacherPayload = {
        teacher: {
          code: teacherCode,
          test_code: testCode,
          test_name: testName,
          mode: "test_create",
        },
      };
      const teacherData = await createTest(payload);
      if (!teacherData.isSuccessful) {
        throw new Error(teacherData.message);
      }

      setTeacherData(teacherData.data);
      setTeacherMode("view");
      console.log("teacherData", teacherData);
    } catch (e) {
      console.log("Error in Creating", e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto min-h-fit text-gray-400">
      <div className="flex justify-center">
        <form className="">
          <div className="border-b border-gray-900/10 p-10">
            <div className="col-span-full">
              <label
                htmlFor="test-code"
                className="block text-sm/6 font-medium  -mt-4"
              >
                Test Code
              </label>
              <div className="mt-2">
                <input
                  id="test-code"
                  name="test-code"
                  type="text"
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value)}
                  autoComplete="test-code"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1">{errors.code}</p>
                )}
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="test-name"
                className="block text-sm/6 font-medium  mt-4"
              >
                Test Name
              </label>
              <div className="mt-2">
                <input
                  id="test-name"
                  name="test-name"
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  autoComplete="test-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base 
               outline-1 -outline-offset-1 outline-gray-300 
              placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 
              focus:outline-indigo-600 sm:text-sm/6"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm/6 font-semibold "
              onClick={() => {
                setTeacherMode("view");
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold 
              text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 
              focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={async () => await handleSubmit()}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
