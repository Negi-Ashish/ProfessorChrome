// lib/getUsers.ts
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebaseConfig";

const getTeacher = async (): Promise<void> => {
  try {
    const snapshot = await getDocs(collection(firestore, "Teacher"));
    snapshot.forEach((doc) => {
      console.log(doc.id, doc.data());
    });
  } catch (e) {
    console.log(e);
  }
};

const getStudents = async (): Promise<void> => {
  try {
    const snapshot = await getDocs(collection(firestore, "Students"));
    snapshot.forEach((doc) => {
      console.log(doc.id, doc.data());
    });
  } catch (e) {
    console.log(e);
  }
};

export { getTeacher, getStudents };
