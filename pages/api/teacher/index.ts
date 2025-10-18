import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/firebaseAdmin";
import teacherMiddleware from "@/middleware/teacher";
import { errorMessage, successMessage } from "@/utils/responses";
import { TeacherData } from "@/structures/typeFile";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;

    switch (method) {
      case "GET": {
        // Fetch all teachers
        const id = req.body;
        const docRef = db.collection("Teacher").doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
          return res
            .status(404)
            .json(errorMessage("Invalid Teacher", "Teacher not found"));
        }

        const teacher: TeacherData = docSnap.data() as TeacherData;

        res
          .status(200)
          .json(
            successMessage("Teacher fetched successfully", { [id]: teacher })
          );
        break;
      }

      case "POST": {
        const { teacher } = req.body;
        const testCode = teacher.test_code; // e.g. "asdfg"
        const testName = teacher.test_name;
        const subject = teacher.subject; // e.g. "history"
        const questions = teacher.questions; // e.g. [{ q1: "...", a1: "..." }]
        const mode = teacher.create_mode;

        // Getting the item
        const docRef = req.body.docRef;
        const docSnap = req.body.docSnap;

        // Get current data
        const data = docSnap.data();
        const tests = data?.tests || [];

        // Find test by test_code
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const testIndex = tests.findIndex((t: any) => t.test_code === testCode);

        // If test doesn't exist, add new test
        if (testIndex === -1 && mode == "test_create") {
          tests.push({
            test_code: testCode,
            test_name: testName,
          });
        } else {
          // Case when its test creating mode and that test code is already existing.
          if (mode == "test_create") {
            return res
              .status(400)
              .json(
                errorMessage(
                  "Test Code Already Exists",
                  "The test code is already active for this teacher."
                )
              );
          }
          const existingTest = tests[testIndex];

          // Check if subject already exists under this test
          if (existingTest.subjects[subject]) {
            return res
              .status(400)
              .json(
                errorMessage(
                  "Subject Exists",
                  "Subject already exists under this test. Please modify or delete it."
                )
              );
          }

          // Add new subject to this test
          existingTest.subjects[subject] = questions;
        }

        // Update Firestore document
        await docRef.update({ tests });
        const new_docSnap = await docRef.get();
        const new_teacher: TeacherData = new_docSnap.data() as TeacherData;

        res
          .status(200)
          .json(
            successMessage("Questions added", { [teacher.code]: new_teacher })
          );

        break;
      }

      case "PUT":
        // Update a teacher by id (expecting req.body to have id + fields to update)
        res.status(200).json({ Teachers: "PUT MADE" });
        break;

      case "DELETE": {
        const { teacher } = req.body;

        const testCode = teacher.test_code; // e.g. "asdfg"
        const subject = teacher.subject; // optional — if provided, delete subject; else delete test

        const tests = req.body.data?.tests || [];
        // Find test by code
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const testIndex = tests.findIndex((t: any) => t.test_code === testCode);
        if (testIndex === -1) {
          return res
            .status(404)
            .json(errorMessage("Test doesnot exists", "Test not found."));
        }

        // If subject provided → delete subject only
        if (subject) {
          const test = tests[testIndex];
          if (!test.subjects[subject]) {
            return res
              .status(404)
              .json(
                errorMessage("Subject doesnot exists", "Subject not found.")
              );
          }

          // Delete the subject
          delete test.subjects[subject];

          // If no subjects remain, remove the entire test
          if (Object.keys(test.subjects).length === 0) {
            tests.splice(testIndex, 1);
          }
        } else {
          // No subject passed → delete entire test
          tests.splice(testIndex, 1);
        }

        // Update the modified array
        const docRef = req.body.docRef;
        await docRef.update({ tests });
        const del_teacher: TeacherData = req.body.data as TeacherData;

        res
          .status(200)
          .json(
            successMessage(
              subject
                ? `Subject "${subject}" deleted successfully.`
                : `Test "${testCode}" deleted successfully.`,
              { [teacher.code]: del_teacher }
            )
          );

        break;
      }
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res
          .status(405)
          .json(
            errorMessage(
              "Method Not Allowed",
              `HTTP method ${req.method} not supported.`
            )
          );
    }
  } catch (e) {
    console.error("Error handling request:", e);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default teacherMiddleware(handler);
