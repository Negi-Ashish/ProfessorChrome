import { Dispatch, SetStateAction } from "react";

interface StudentProp {
  text?: string; // optional prop
  setTeacher?: Dispatch<SetStateAction<boolean>>;
}

export function StudentComponent(props: StudentProp) {
  return (
    <h1 className="text-3xl font-bold underline bg-sky-500/60 p-4 rounded text-center">
      {props.text || "Hello student!"}
    </h1>
  );
}
