/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TeacherResponse,
  DeleteTeacherPayload,
  TeacherPayload,
} from "@/structures/interfaceFile";

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

export const delTeacher = async (
  payload: DeleteTeacherPayload
): Promise<TeacherResponse> => {
  const res = await fetch(`/api/teacher`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: TeacherResponse = await res.json();
  return data;
};

export const createTest = async (
  payload: TeacherPayload
): Promise<TeacherResponse> => {
  const res = await fetch(`/api/teacher`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: TeacherResponse = await res.json();
  return data;
};

export const deleteTest = async (
  payload: TeacherPayload
): Promise<TeacherResponse> => {
  const res = await fetch(`/api/teacher`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: TeacherResponse = await res.json();
  return data;
};
