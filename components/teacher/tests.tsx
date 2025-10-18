import React, { Dispatch, SetStateAction } from "react";
import { Card } from "../card";
import { DeleteButton } from "../delete";
import {
  TeacherDocument,
  DeleteTeacherPayload,
  Test,
} from "@/structures/interfaceFile";
import { delTeacher } from "@/api_call/backend_calls";
import { TeacherMode } from "@/structures/typeFile";

interface TeacherTestsProps {
  teacherData: TeacherDocument;
  teacherCode: string;
  setTeacherData: Dispatch<SetStateAction<TeacherDocument | null>>;
  setTeacherMode: Dispatch<SetStateAction<TeacherMode>>;
  setSelectedTest: Dispatch<SetStateAction<Test | null>>;
}

export function Tests({
  teacherData,
  teacherCode,
  setTeacherData,
  setTeacherMode,
  setSelectedTest,
}: TeacherTestsProps) {
  const handleDeleteTest = async (test_code: string) => {
    const payload: DeleteTeacherPayload = {
      teacher: {
        code: teacherCode,
        test_code: test_code,
      },
    };

    try {
      const new_tests = await delTeacher(payload);
      console.log("Deleted successfully:", new_tests);
      if (!new_tests.isSuccessful) {
        throw new Error(new_tests.message);
      }
      setTeacherData(new_tests.data);
    } catch (err) {
      console.error("Error deleting teacher:", err);
    }
  };
  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center ">
      <div className="flex flex-wrap gap-4 max-h-[80vh] overflow-auto p-4 justify-center">
        {teacherData[teacherCode].tests.map((test) => (
          <div key={test.test_code} className="relative flex-shrink-0">
            <Card
              title={test.test_name}
              description=""
              handleClick={() => {
                setTeacherMode("test_details");
                setSelectedTest(test);
              }}
            />
            <DeleteButton
              handleDelete={async () => {
                await handleDeleteTest(test.test_code);
              }}
            />
          </div>
        ))}
      </div>
      <button
        onClick={async () => {
          setTeacherMode("add");
        }}
        className={`mt-4 px-4 py-2 rounded text-white transition bg-blue-500 
          hover:bg-blue-600 max-w-xl `}
      >
        Add New
      </button>
    </div>
  );
}
