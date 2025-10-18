import { Dispatch, SetStateAction, useState } from "react";

import { TeacherDocument } from "@/structures/interfaceFile";

import { BackButton } from "../back";
import { Tests } from "./tests";
import { CodeInput } from "./code";
import { AddTests } from "./addTests";
import { TeacherMode } from "@/structures/typeFile";

interface TeacherProp {
  setRole: Dispatch<SetStateAction<string>>;
}

export function TeacherComponent({ setRole }: TeacherProp) {
  const [teacherCode, setTeacherCode] = useState("");
  const [teacherData, setTeacherData] = useState<TeacherDocument | null>(null);
  const [teacherMode, setTeacherMode] = useState<TeacherMode>("");

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
