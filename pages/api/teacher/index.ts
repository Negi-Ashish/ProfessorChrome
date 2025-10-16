/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
        res.status(200).json({ Teachers: "POST MADE" });
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
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    console.error("Error handling request:", e);
    res.status(500).json({ error: "Internal server error" });
  }
}
