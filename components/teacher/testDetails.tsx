import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Subjects,
  TeacherPayload,
  Test,
  TeacherDocument,
} from "@/structures/interfaceFile";
import { TeacherMode } from "@/structures/typeFile";
import { ActionCard } from "../ActionCard";
import { createTest, deleteTest } from "@/api_call/backend_calls";
import { DeleteButton } from "../delete";

interface TestDetailsProps {
  setTeacherMode: Dispatch<SetStateAction<TeacherMode>>;
  selectedTest: Test | null;
  setSelectedSubject: Dispatch<SetStateAction<Subjects | null>>;
  setSelectedTest: Dispatch<SetStateAction<Test | null>>;
  teacherCode: string;
  setTeacherData: Dispatch<SetStateAction<TeacherDocument | null>>;
}

export function TestDetails({
  setTeacherMode,
  selectedTest,
  setSelectedSubject,
  setSelectedTest,
  teacherCode,
  setTeacherData,
}: TestDetailsProps) {
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectMode, setNewSubjectMode] = useState(false);
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({});

  // Validation function
  const validate = () => {
    const newErrors: typeof errors = {};
    // Test name: at least 3 letters
    if (newSubjectName.trim().length < 5) {
      newErrors.name = "Subject name must be at least 5 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateSubject = async () => {
    if (!validate()) {
      return;
    }
    try {
      const payload: TeacherPayload = {
        teacher: {
          code: teacherCode,
          test_code: selectedTest?.test_code || "",
          test_name: selectedTest?.test_name,
          subject: newSubjectName,
          mode: "subject_create",
        },
      };
      const teacherData = await createTest(payload);
      if (!teacherData.isSuccessful) {
        throw new Error(teacherData.message);
      }

      setTeacherData(teacherData.data);
      const tests = teacherData.data[`${teacherCode}`]["tests"];
      const index = tests.findIndex(
        (test: { test_code: string }) =>
          test.test_code === selectedTest?.test_code
      );

      setSelectedTest(tests[index]);
      setNewSubjectMode(false);
      setNewSubjectName("");
    } catch (e) {
      console.log("Error in Creating", e);
    }
  };

  const handleDeleteSubject = async (subjectToDelete: string) => {
    try {
      const payload: TeacherPayload = {
        teacher: {
          code: teacherCode,
          test_code: selectedTest?.test_code || "",
          test_name: selectedTest?.test_name,
          subject: subjectToDelete,
          mode: "delete_subject",
        },
      };
      const teacherData = await deleteTest(payload);
      if (!teacherData.isSuccessful) {
        throw new Error(teacherData.message);
      }

      setTeacherData(teacherData.data);
      const tests = teacherData.data[`${teacherCode}`]["tests"];
      const index = tests.findIndex(
        (test: { test_code: string }) =>
          test.test_code === selectedTest?.test_code
      );

      setSelectedTest(tests[index]);
      setNewSubjectMode(false);
      setNewSubjectName("");
    } catch (e) {
      console.log("Error in Creating", e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto min-h-fit text-gray-400">
      <div className="flex flex-wrap gap-4 max-h-[80vh]  p-4 justify-center">
        <form>
          <div className="space-y-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-2xl font-bold "
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
                <h1 className="text-xl font-semibold  mt-5 mb-2">Subjects</h1>
                {Object.keys(selectedTest.subjects).map((subjectName) => (
                  <div className="relative" key={subjectName}>
                    <ActionCard
                      name={subjectName}
                      handleClick={() => {
                        setSelectedSubject({
                          [subjectName]: selectedTest.subjects[subjectName],
                        });
                        setTeacherMode("question_details");
                      }}
                    />
                    <DeleteButton
                      handleDelete={async () => {
                        await handleDeleteSubject(subjectName);
                      }}
                      styling="mt-1"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <h1 className="text-xl font-semibold  mt-5 mb-2">
                No subjects have been added to this test yet — please create
                one.
              </h1>
            )}
          </div>

          {newSubjectMode ? (
            <div>
              <div className="pt-10">
                <div className="col-span-full">
                  <label
                    htmlFor="test-code"
                    className="block text-sm/6 font-medium  -mt-4"
                  >
                    Enter new subject name
                  </label>
                  <div className="mt-2">
                    <input
                      id="test-code"
                      name="test-code"
                      type="text"
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      autoComplete="test-code"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300
                       placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 text-black"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      type="button"
                      className="pt-2 text-sm/6 font-semibold "
                      onClick={() => {
                        setNewSubjectMode(false);
                        setNewSubjectName("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={async () => await handleCreateSubject()}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm/6 font-semibold "
                onClick={() => {
                  setSelectedTest(null);
                  setTeacherMode("view");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => setNewSubjectMode(true)}
              >
                Add New
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
