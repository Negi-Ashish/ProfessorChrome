import { Dispatch, SetStateAction, useState } from "react";

import { TeacherDocument } from "@/structures/interfaceFile";

import { BackButton } from "../back";
import { Tests } from "./tests";
import { CodeInput } from "./code";

interface TeacherProp {
  setRole: Dispatch<SetStateAction<string>>;
}

export function TeacherComponent(props: TeacherProp) {
  const [teacherCode, setTeacherCode] = useState("");
  const [teacherData, setTeacherData] = useState<TeacherDocument | null>(null);
  const [teacherMode, setTeacherMode] = useState("");

  return (
    <div className="relative flex flex-col items-center ">
      <BackButton handleBack={() => props.setRole("")} />
      {!teacherData && (
        <CodeInput
          setTeacherCode={setTeacherCode}
          setTeacherMode={setTeacherMode}
          setTeacherData={setTeacherData}
        />
      )}
      {teacherData && teacherMode == "view" && (
        <Tests
          teacherCode={teacherCode}
          teacherData={teacherData}
          setTeacherData={setTeacherData}
        />
      )}
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
