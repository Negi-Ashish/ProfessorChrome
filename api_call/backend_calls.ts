/* eslint-disable @typescript-eslint/no-explicit-any */
import { TeacherResponse } from "@/structures/interfaceFile";

export const getTeacher = async (id: string): Promise<TeacherResponse> => {
  const res = await fetch(`/api/teacher?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: TeacherResponse = await res.json();
  return data;
};
