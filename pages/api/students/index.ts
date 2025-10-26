import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/firebaseAdmin";
import { errorMessage, successMessage } from "@/utils/responses";
import { TeacherData } from "@/structures/typeFile";
import { Question } from "@/structures/interfaceFile";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;

    switch (method) {
      case "GET": {
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

export default handler;
