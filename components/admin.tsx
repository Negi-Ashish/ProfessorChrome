import { Dispatch, SetStateAction } from "react";
import { BackButton } from "./back";
import { SignIn } from "./signIn";
interface AdminProp {
  text?: string; // optional prop
  setRole: Dispatch<SetStateAction<string>>;
}

export function AdminComponent(props: AdminProp) {
  return (
    <div className="relative flex flex-col items-center ">
      <BackButton handleBack={() => props.setRole("")} />
      <SignIn />
    </div>
  );
}
