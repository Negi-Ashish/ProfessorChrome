import { Dispatch, SetStateAction } from "react";
import { TeacherComponent } from "./teacher";
import { StudentComponent } from "./student";

interface ToggleProp {
  teacher: boolean; // optional prop
  setTeacher: Dispatch<SetStateAction<boolean>>;
}

export function ToggleComponent(props: ToggleProp) {
  return (
    <div>
      {props.teacher == true ? <TeacherComponent /> : <StudentComponent />}
    </div>
  );
}
