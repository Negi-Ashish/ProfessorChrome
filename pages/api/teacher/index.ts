/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/firebaseAdmin";
import teacherMiddleware from "@/middleware/teacher";
import { errorMessage } from "@/utils/responses";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;

    switch (method) {
      case "GET":
        // Fetch all teachers
        const snapshot = await db.collection("Teacher").get();
        const teachers: any[] = [];
        snapshot.forEach((doc) => {
          teachers.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json({ Teachers: teachers });
        break;

      case "POST":
        // Add a new teacher
        const { teacher } = req.body;

        // Store the ID then remove it from the object
        const docId = teacher.subject;
        delete teacher.subject; // remove subject from the object so it's not saved
        const docRef = db.collection("Teacher").doc(docId);

        // Add teacher object to Firestore
        await docRef.set(teacher);

        res
          .status(201)
          .json({ message: "Teacher added successfully", teacher });
        break;

      case "PUT":
        // Update a teacher by id (expecting req.body to have id + fields to update)
        res.status(200).json({ Teachers: "PUT MADE" });
        break;

      case "DELETE":
        // Delete a teacher by id (expecting req.body.id)
        res.status(200).json({ Teachers: "DELETE MADE" });
        break;

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
