// Represents a single Q&A object
export interface Question {
  [key: string]: string; // e.g., { "q1": "Question text", "a1": "Answer text" }
}

// Represents the teacher payload
export interface TeacherPayload {
  teacher: {
    code: string; // Firestore document ID
    test_code: string; // Unique test identifier
    subject?: string; // Optional: subject name
    questions?: Question[]; // Optional: array of questions for that subject
  };
}

// Subjects object (subject name → array of questions)
export interface Subjects {
  [subjectName: string]: Question[];
}

// Each test object
export interface Test {
  test_code: string;
  subjects: Subjects;
  test_name: string;
}

// Document structure (docId → tests array)
export interface TeacherDocument {
  [docId: string]: {
    tests: Test[];
  };
}

// API response structure
export interface TeacherResponse {
  isSuccessful: boolean;
  message: string;
  data: TeacherDocument;
}
