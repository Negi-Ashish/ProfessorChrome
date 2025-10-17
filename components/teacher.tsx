import { Dispatch, SetStateAction, useRef, useState } from "react";
import { getTeacher } from "@/api_call/backend_calls";
import { TeacherDocument } from "@/structures/interfaceFile";
import { Card } from "./Card";
interface TeacherProp {
  text?: string; // optional heading
  setTeacher?: Dispatch<SetStateAction<boolean>>;
}

export function TeacherComponent({ text = "Enter Code" }: TeacherProp) {
  const [isComplete, setIsComplete] = useState(false);
  const [teacherCode, setTeacherCode] = useState("");
  const [teacherData, setTeacherData] = useState<TeacherDocument | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.target.value && idx < 4) {
      inputsRef.current[idx + 1]?.focus();
    }

    // ✅ Check if all inputs are filled
    const values = inputsRef.current.map((input) => input?.value || "");
    setIsComplete(values.every((val) => val.trim().length === 1));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const values = inputsRef.current.map((input) => input?.value || "");
    const code = values.join(""); // e.g. "12345"
    console.log("Entered Code:", code);
    await fetchTeacher(code);
  };

  const fetchTeacher = async (code: string) => {
    try {
      const teacherData = await getTeacher(code);
      if (!teacherData.isSuccessful) {
        throw new Error(teacherData.message);
      }
      setTeacherCode(code);
      setTeacherData(teacherData.data);
      console.log(teacherData.data);
    } catch (e) {
      console.log("Error in fetching", e);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {!teacherData && (
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-3xl font-bold  p-4 rounded text-center">
            {text}
          </h1>
          <div className="flex space-x-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                className="w-10 h-10 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
              />
            ))}
          </div>

          <button
            onClick={async () => await handleSubmit()}
            disabled={!isComplete} // ✅ disable when not complete
            className={`mt-4 px-4 py-2 rounded text-white transition ${
              isComplete
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-4 max-h-[80vh] overflow-auto p-4 justify-center">
          {teacherData &&
            teacherData[teacherCode].tests.map((test) => (
              <div key={test.test_code} className="flex-shrink-0">
                <Card title={test.test_name} description="" href="/details" />
              </div>
            ))}
        </div>
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
