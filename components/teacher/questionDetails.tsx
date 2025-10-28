import React, { Dispatch, SetStateAction, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import {
  Question,
  Subjects,
  TeacherDocument,
  TeacherPayload,
  Test,
} from "@/structures/interfaceFile";
import { TeacherMode } from "@/structures/typeFile";
import { createTest, deleteTest } from "@/api_call/backend_calls";
import { DeleteButton } from "../delete";
import Image from "next/image";

interface QuestionDetailsProps {
  setTeacherMode: Dispatch<SetStateAction<TeacherMode>>;
  teacherCode: string;
  setTeacherData: Dispatch<SetStateAction<TeacherDocument | null>>;
  selectedTest: Test | null;
  selectedSubject: Subjects | null;
  setSelectedSubject: Dispatch<SetStateAction<Subjects | null>>;
  setSelectedTest: Dispatch<SetStateAction<Test | null>>;
}

export function QuestionDetails({
  setSelectedTest,
  setTeacherMode,
  selectedTest,
  selectedSubject,
  setSelectedSubject,
  teacherCode,
  setTeacherData,
}: QuestionDetailsProps) {
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newQuestionMode, setNewQuestionMode] = useState(false);
  const [errors, setErrors] = useState<{ question?: string; answer?: string }>(
    {}
  );
  // const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [session, setSession] = useState<any>(null);
  const [imageExtractedQuestions, setImageExtractedQuestions] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any>(null);
  let subjectName: string = "";
  if (selectedSubject) {
    subjectName = Object.keys(selectedSubject)[0]; // "history"
  }

  // create session when first needed
  async function initSession() {
    if (!window.LanguageModel) return alert("LanguageModel API not available");
    const s = await window.LanguageModel.create({
      initialPrompts: [
        {
          role: "system",
          content: "You are a skilled analyst who extracts text from images.",
        },
      ],
      expectedInputs: [{ type: "image" }],
    });
    setSession(s);
    return s;
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreview(url);
    const s = session || (await initSession());
    await s.append([
      {
        role: "user",
        content: [
          {
            type: "text",
            value: "Here’s an image — extract all text you can see.",
          },
          { type: "image", value: file },
        ],
      },
    ]);
  }

  async function handleAnalyze() {
    if (!session) return alert("Upload an image first!");
    console.log("Analyzing...");

    const controller = new AbortController();
    const signal = controller.signal;

    const schema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          Q: { type: "string" },
          A: { type: "string" },
        },
        required: ["Q", "A"],
      },
    };

    const analysisPromise = session.prompt(
      `From the uploaded image, extract all visible questions and answers,
      but ignore any numbering, indexing, or bullet points before the questions. 
      Respond ONLY in strict JSON format like:
      [
        {"Q": "Question here", "A": "Answer here"},
        {"Q": "...", "A": "..."}
      ]`,
      { responseConstraint: schema },
      { signal: signal }
    );

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Taking too long — please try again.")),
        120000
      )
    );

    try {
      const output = await Promise.race([analysisPromise, timeoutPromise]);
      console.log("output", output);
      const resultData = JSON.parse(output as string);
      console.log("ImageExtractedQuestions", resultData);
      setImageExtractedQuestions(resultData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong during analysis.");
    } finally {
      session.destroy();
    }
  }

  function uploadCancel() {
    session.destroy();
    setImageExtractedQuestions(null);
    setSession(null);
  }

  function deleteExtractedQuestion(index: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setImageExtractedQuestions((prev: any) => {
      if (!prev) return null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updated = prev.filter((_: any, i: number) => i !== index);
      return updated.length > 0 ? updated : null;
    });
  }

  // Validation function
  const validate = () => {
    const newErrors: typeof errors = {};
    // Test name: at least 3 letters
    if (newQuestion.trim().length < 10) {
      newErrors.question = "Question must be at least 10 characters.";
    }

    if (newAnswer.trim().length < 10) {
      newErrors.answer = "Answer must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateQuestion = async (mode?: boolean) => {
    if (!validate() && !mode) {
      return;
    }

    try {
      const payload: TeacherPayload = {
        teacher: {
          code: teacherCode,
          test_code: selectedTest?.test_code || "",
          test_name: selectedTest?.test_name,
          subject: subjectName,
          questions: mode
            ? imageExtractedQuestions
            : [{ Q: newQuestion, A: newAnswer }],
          mode: "question_create",
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

      console.log(tests[index]);

      setSelectedTest(tests[index]);
      if (tests[index]) {
        setSelectedSubject({
          [subjectName]: tests[index].subjects[subjectName],
        });
      }
      setNewQuestionMode(false);
      setNewQuestion("");
      setNewAnswer("");
      if (mode) {
        setImageExtractedQuestions(null);
        setSession(null);
      }
    } catch (e) {
      console.log("Error in Creating", e);
    }
  };

  const handleDeleteQuestion = async (questionToDelete: Question) => {
    try {
      const payload: TeacherPayload = {
        teacher: {
          code: teacherCode,
          test_code: selectedTest?.test_code || "",
          test_name: selectedTest?.test_name,
          subject: subjectName,
          questions: [questionToDelete],
          mode: "delete_question",
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
      if (tests[index]) {
        setSelectedSubject({
          [subjectName]: tests[index].subjects[subjectName],
        });
      }
      setNewQuestionMode(false);
      setNewQuestion("");
      setNewAnswer("");
    } catch (e) {
      console.log("Error in Creating", e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto min-h-fit text-gray-400">
      <div className="flex flex-wrap gap-4 max-h-[80vh]  p-4 justify-center">
        <form className="min-w-5xl">
          <div className="space-y-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-2xl font-bold "
                >
                  {selectedTest?.test_name} (Code: {selectedTest?.test_code})
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  {session ? (
                    <div className="text-right">
                      {preview && (
                        <Image
                          src={preview}
                          alt="preview"
                          width={1000}
                          height={1000}
                          className="w-full h-auto object-contain max-w-xl"
                        />
                      )}
                      {!imageExtractedQuestions ||
                      imageExtractedQuestions.length == 0 ? (
                        <div>
                          <button
                            type="button"
                            onClick={async () => uploadCancel()}
                            className=" px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded mt-5 mr-5"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={async () => await handleAnalyze()}
                            className=" px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded mt-5 "
                          >
                            Analyze
                          </button>
                        </div>
                      ) : (
                        <div className="mt-5 text-right max-w-xl">
                          {imageExtractedQuestions.map(
                            (item: Question, idx: number) => (
                              <div
                                key={idx}
                                className="py-5 gap-x-12 first:pt-0 sm:flex text-left"
                              >
                                <ul className="relative flex-1 space-y-6 sm:last:pb-6 sm:space-y-8 pr-10">
                                  <li>
                                    <summary className="flex items-center justify-between font-semibold text-gray-400">
                                      {item.Q}
                                    </summary>
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: item.A,
                                      }}
                                      className="mt-3 text-gray-500 leading-relaxed"
                                    ></p>
                                  </li>
                                  <DeleteButton
                                    handleDelete={async () => {
                                      deleteExtractedQuestion(idx);
                                    }}
                                    styling="-mt-2"
                                  />
                                </ul>
                              </div>
                            )
                          )}
                          <button
                            type="button"
                            onClick={async () => uploadCancel()}
                            className=" px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded mr-2"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={async () =>
                              await handleCreateQuestion(true)
                            }
                            className=" px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
                          >
                            Add Questions
                          </button>
                        </div>
                      )}

                      {/* {result && (
                        <pre className="whitespace-pre-wrap">{result}</pre>
                      )} */}
                    </div>
                  ) : (
                    <div className="text-center">
                      <PhotoIcon
                        aria-hidden="true"
                        className="mx-auto size-12 text-gray-300"
                      />
                      <div className="mt-4 flex text-sm/6 text-gray-500 ">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-transparent 
                          font-semibold text-indigo-600 focus-within:outline-2 
                          focus-within:outline-offset-2 focus-within:outline-indigo-600
                           hover:text-indigo-500 "
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs/5 text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-5">
            <h2 className="text-xl font-semibold  mt-5">{subjectName}</h2>
          </div>

          <div className="mt-10 divide-y">
            {selectedSubject && selectedSubject[`${subjectName}`].length > 0 ? (
              selectedSubject[`${subjectName}`].map((item, idx) => (
                <div key={idx} className="py-5 gap-x-12 first:pt-0 sm:flex">
                  <ul className="relative flex-1 space-y-6 sm:last:pb-6 sm:space-y-8 pr-10">
                    <li>
                      <summary className="flex items-center justify-between font-semibold text-gray-400">
                        {idx + 1}. {item.Q}
                      </summary>
                      <p
                        dangerouslySetInnerHTML={{ __html: item.A }}
                        className="mt-3 text-gray-500 leading-relaxed"
                      ></p>
                    </li>
                    <DeleteButton
                      handleDelete={async () => {
                        await handleDeleteQuestion(item);
                      }}
                      styling="-mt-2"
                    />
                  </ul>
                </div>
              ))
            ) : (
              <h2 className="font-semibold ">
                No questions have been added yet.
              </h2>
            )}
          </div>

          {newQuestionMode ? (
            <div className="col-span-full">
              <label
                htmlFor="question"
                className="block text-sm/6 font-medium  mt-4"
              >
                Add a new question
              </label>
              <div className="mt-2">
                <input
                  id="question"
                  name="question"
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  autoComplete="question"
                  className="block w-full  rounded-md bg-white px-3 py-1.5 text-base text-black
                  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {errors.question && (
                  <p className="text-red-500 text-sm mt-1">{errors.question}</p>
                )}
              </div>

              <label
                htmlFor="answer"
                className="block text-sm/6 font-medium  mt-4"
              >
                Add an answer
              </label>
              <div className="mt-2">
                <input
                  id="answer"
                  name="answer"
                  type="text"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  autoComplete="answer"
                  className="block w-full  rounded-md bg-white px-3 py-1.5 text-base text-black
                   outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {errors.answer && (
                  <p className="text-red-500 text-sm mt-1">{errors.answer}</p>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="pt-2 text-sm/6 font-semibold "
                  onClick={() => {
                    setNewQuestionMode(false);
                    setNewQuestion("");
                    setNewAnswer("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={async () => await handleCreateQuestion()}
                >
                  Confirm
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm/6 font-semibold "
                onClick={() => {
                  setSelectedSubject(null);
                  setTeacherMode("test_details");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                  setNewQuestionMode(true);
                }}
              >
                Add Question
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
