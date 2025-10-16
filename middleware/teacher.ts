import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { errorMessage } from "../utils/responses";
import { db } from "@/lib/firebaseAdmin";

const teacherMiddleware = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Convert string from Frontend to JSON if needed
      if (req.body && typeof req.body === "string") {
        req.body = JSON.parse(req.body);
      }
      // Handelling all request possible
      switch (req.method) {
        case "GET":
          // Handle GET request
          console.log("teacherMiddleware GET Request");
          return handler(req, res);
        case "POST":
          // Handle POST request
          const { teacher } = req.body;

          if (!teacher || !teacher.subject) {
            return res
              .status(400)
              .json({ error: "Teacher object with 'id' is required." });
          }
          // Checking if subject already exists
          const docId = teacher.subject;
          const docRef = db.collection("Teacher").doc(docId);
          const docSnap = await docRef.get();

          if (docSnap.exists) {
            res
              .status(405)
              .json(
                errorMessage(
                  "Subject Already Exists",
                  `Teacher with id "${docId}" already exists.`
                )
              );
          }
          console.log("teacherMiddleware POST Request");

          return handler(req, res);
        case "PUT":
          // Handle PUT request
          console.log("teacherMiddleware PUT Request");
          return handler(req, res);
        case "DELETE":
          // Handle DELETE request
          console.log("teacherMiddleware DELETE Request");
          return handler(req, res);
        default:
          return res
            .status(405)
            .json(
              errorMessage(
                "Method Not Allowed",
                `HTTP method ${req.method} not supported.`
              )
            );
      }
    } catch (error) {
      console.error(error);
      return res
        .status(401)
        .json(errorMessage("Invalid Request", `Invalid payload`));
    }
  };
};

export default teacherMiddleware;
