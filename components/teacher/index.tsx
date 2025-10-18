import { Dispatch, SetStateAction, useState } from "react";

import { Subjects, TeacherDocument, Test } from "@/structures/interfaceFile";

import { BackButton } from "../back";
import { Tests } from "./tests";
import { CodeInput } from "./code";
import { AddTests } from "./addTests";
import { TeacherMode } from "@/structures/typeFile";
import { TestDetails } from "./testDetails";
import { QuestionDetails } from "./questionDetails";
interface TeacherProp {
  setRole: Dispatch<SetStateAction<string>>;
}

export function TeacherComponent({ setRole }: TeacherProp) {
  const [teacherCode, setTeacherCode] = useState("");
  const [teacherData, setTeacherData] = useState<TeacherDocument | null>(null);
  const [teacherMode, setTeacherMode] = useState<TeacherMode>("");
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subjects | null>(null);

  const renderTeacherMode = () => {
    if (!teacherData) {
      return;
    }
    switch (teacherMode) {
      case "view":
        return (
          <Tests
            teacherCode={teacherCode}
            teacherData={teacherData}
            setTeacherData={setTeacherData}
            setTeacherMode={setTeacherMode}
            setSelectedTest={setSelectedTest}
          />
        );
      case "add":
        return (
          <AddTests
            setTeacherMode={setTeacherMode}
            teacherCode={teacherCode}
            setTeacherData={setTeacherData}
          />
        );
      case "test_details":
        return (
          <TestDetails
            setTeacherMode={setTeacherMode}
            setSelectedTest={setSelectedTest}
            selectedTest={selectedTest}
            setSelectedSubject={setSelectedSubject}
          />
        );
      case "question_details":
        return (
          <QuestionDetails
            setTeacherMode={setTeacherMode}
            teacherCode={teacherCode}
            setTeacherData={setTeacherData}
            selectedTest={selectedTest}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
          />
        );
      default:
        return <p>No valid mode selected.</p>;
    }
  };

  return (
    <div className="relative flex flex-col items-center overflow-auto custom-scrollbar">
      <BackButton handleBack={() => setRole("")} />
      {!teacherData && (
        <CodeInput
          setTeacherCode={setTeacherCode}
          setTeacherMode={setTeacherMode}
          setTeacherData={setTeacherData}
        />
      )}
      <div className="">{teacherData && renderTeacherMode()}</div>
    </div>
  );
}
