import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/firebaseAdmin";
import { errorMessage, successMessage } from "@/utils/responses";
import { TeacherData } from "@/structures/typeFile";
import studentMiddleware from "@/middleware/student";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;

    switch (method) {
      case "GET": {
        // Fetch all teachers
        const test_id = req.body;

        const test_docRef = db.collection("Tests").doc(test_id);
        const test_docSnap = await test_docRef.get();

        if (!test_docSnap.exists) {
          return res
            .status(404)
            .json(errorMessage("Invalid Test", "Test not found"));
        }

        console.log("test_docSnap.data", test_docSnap.data());
        const id = await test_docSnap.data()?.test_details.teacher_code;
        console.log("id", id);

        const docRef = db.collection("Teacher").doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
          return res
            .status(404)
            .json(errorMessage("Invalid Test", "Test not found"));
        }

        const teacher: TeacherData = docSnap.data() as TeacherData;

        const tests = teacher.tests || [];

        const selectedTest = tests.find(
          (test: { test_code: string }) => test.test_code === test_id
        );

        if (!selectedTest) {
          return res
            .status(404)
            .json(errorMessage("Invalid Test", "Test not found"));
        }

        res.status(200).json(
          successMessage(
            "Teacher fetched successfully",
            selectedTest // return only matched test
          )
        );

        // res
        //   .status(200)
        //   .json(
        //     successMessage("Teacher fetched successfully", { [id]: teacher })
        //   );
        break;
      }

      case "POST": {
        break;
      }

      case "PUT": {
        break;
      }

      case "DELETE": {
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

export default studentMiddleware(handler);
