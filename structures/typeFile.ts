/* eslint-disable @typescript-eslint/no-explicit-any */

export type TeacherData = Record<string, any>;

export type TeacherMode =
  | ""
  | "view"
  | "add"
  | "test_details"
  | "question_details";

export type StudentMode =
  | ""
  | "offline_oneByone"
  | "offline_complete_test"
  | "online"
  | "leaderboard";
