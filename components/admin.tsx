import { Dispatch, SetStateAction } from "react";

interface AdminProp {
  text?: string; // optional prop
  setRole?: Dispatch<SetStateAction<string>>;
}

export function AdminComponent(props: AdminProp) {
  return (
    <h1 className="text-3xl font-bold underline bg-sky-500/60 p-4 rounded text-center">
      {props.text || "Hello student!"}
    </h1>
  );
}
