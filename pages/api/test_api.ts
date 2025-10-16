/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../lib/firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const snapshot = await db.collection("Teacher").get();
    const teachers: any[] = [];

    snapshot.forEach((doc) => {
      teachers.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ Teachers: teachers });
  } catch (e) {
    console.error("Error fetching teachers:", e);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
}
