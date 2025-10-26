import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { errorMessage } from "../utils/responses";
// import { db } from "@/lib/firebaseAdmin";

const studentMiddleware = (handler: NextApiHandler) => {
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
          const { id } = req.query; // expecting /api/student?id=10th1

          if (!id || typeof id !== "string") {
            return res
              .status(400)
              .json(
                errorMessage("Invalid Request", "Missing or invalid test ID")
              );
          }
          req.body = id;
          console.log("studentMiddleware GET Request");
          return handler(req, res);
        case "POST":
        case "PUT": {
          // Handle POST request

          return handler(req, res);
        }
        case "DELETE":
          // Handle DELETE request

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

export default studentMiddleware;
