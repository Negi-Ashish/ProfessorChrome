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
          const { id } = req.query; // expecting /api/teacher?id=q1w23

          if (!id || typeof id !== "string") {
            return res
              .status(400)
              .json(
                errorMessage("Invalid Request", "Missing or invalid teacher ID")
              );
          }
          req.body = id;
          console.log("teacherMiddleware GET Request");
          return handler(req, res);
        case "POST":
        case "PUT": {
          // Handle POST request
          const { teacher } = req.body;

          if (
            !teacher ||
            !teacher.code ||
            !teacher.test_name ||
            !teacher.test_code ||
            !teacher.mode
          ) {
            return res
              .status(400)
              .json({ error: "Teacher object is invalid." });
          }
          // Checking if teacher code already exists
          const docId = teacher.code;
          const docRef = db.collection("Teacher").doc(docId);
          const docSnap = await docRef.get();

          if (!docSnap.exists) {
            return res
              .status(405)
              .json(
                errorMessage(
                  "Unauthorized Attempt",
                  `Teacher with id "${docId}" doesnot exists.`
                )
              );
          }

          req.body.docSnap = docSnap;
          req.body.docRef = docRef;

          console.log("teacherMiddleware POST Request");

          return handler(req, res);
        }
        // case "PUT":
        //   // Handle PUT request
        //   console.log("teacherMiddleware PUT Request");
        //   return handler(req, res);
        case "DELETE":
          // Handle DELETE request
          const { teacher } = req.body;
          if (!teacher || !teacher.code || !teacher.test_code) {
            return res
              .status(400)
              .json({ error: "Teacher delete object is invalid." });
          }
          const docId = teacher.code; // e.g. "q1w23"
          const docRef = db.collection("Teacher").doc(docId);
          const docSnap = await docRef.get();

          const data = docSnap.data();

          if (!docSnap.exists) {
            return res
              .status(404)
              .json(
                errorMessage("Teacher doesnot exists", "Document not found.")
              );
          }

          req.body.data = data;
          req.body.docRef = docRef;

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
