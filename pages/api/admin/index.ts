// // Make this API as super admin, he can add or remove teachers.
// import type { NextApiRequest, NextApiResponse } from "next";
// import { db } from "../../lib/firebaseAdmin";
// import { successMessage, errorMessage } from "../../utils/response";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const { teacher } = req.body;
//     const docId = teacher.code; // e.g. "q1w23"
//     const testCode = teacher.test_code; // e.g. "asdfg"
//     const subject = teacher.subject; // e.g. "history"
//     const questions = teacher.questions; // e.g. [{ q1: "...", a1: "..." }]

//     const docRef = db.collection("Teacher").doc(docId);
//     const docSnap = await docRef.get();

//     // Create document if not exists
//     if (!docSnap.exists) {
//       await docRef.set({
//         tests: [
//           {
//             test_code: testCode,
//             subjects: {
//               [subject]: questions,
//             },
//           },
//         ],
//       });
//       return res.status(200).json(successMessage("Test and subject created successfully", questions));
//     }

//     // Get current data
//     const data = docSnap.data();
//     const tests = data?.tests || [];

//     // Find test by test_code
//     const testIndex = tests.findIndex((t: any) => t.test_code === testCode);

//     // If test doesn't exist, add new test
//     if (testIndex === -1) {
//       tests.push({
//         test_code: testCode,
//         subjects: {
//           [subject]: questions,
//         },
//       });
//     } else {
//       const existingTest = tests[testIndex];

//       // Check if subject already exists under this test
//       if (existingTest.subjects[subject]) {
//         return res
//           .status(400)
//           .json(errorMessage("Subject already exists under this test. Please modify or delete it."));
//       }

//       // Add new subject to this test
//       existingTest.subjects[subject] = questions;
//     }

//     // Update Firestore document
//     await docRef.update({ tests });

//     res.status(200).json(successMessage("Subject added successfully", questions));
//   } catch (err: any) {
//     console.error("Error adding subject:", err);
//     res.status(500).json(errorMessage("Internal server error"));
//   }
// }
