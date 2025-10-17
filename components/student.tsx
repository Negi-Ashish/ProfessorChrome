import { Dispatch, SetStateAction } from "react";
import { BackButton } from "./back";

interface StudentProp {
  text?: string; // optional prop
  setRole: Dispatch<SetStateAction<string>>;
}

export function StudentComponent(props: StudentProp) {
  return (
    <div className="relative flex flex-col items-center ">
      <BackButton handleBack={() => props.setRole("")} />
    </div>
  );
}
