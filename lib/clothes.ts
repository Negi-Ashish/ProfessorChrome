// lib/getUsers.ts
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebaseConfig";

const getClothes = async (): Promise<void> => {
  const snapshot = await getDocs(collection(firestore, "Clothes"));
  snapshot.forEach((doc) => {
    console.log(doc.id, doc.data());
  });
};

export { getClothes };
