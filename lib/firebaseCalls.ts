// lib/getUsers.ts
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebaseConfig";

const getTeacher = async (): Promise<void> => {
  const snapshot = await getDocs(collection(firestore, "Teacher"));
  snapshot.forEach((doc) => {
    console.log(doc.id, doc.data());
  });
};

const getStudents = async (): Promise<void> => {
  const snapshot = await getDocs(collection(firestore, "Students"));
  snapshot.forEach((doc) => {
    console.log(doc.id, doc.data());
  });
};

export { getTeacher, getStudents };
