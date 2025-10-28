import { Dispatch, SetStateAction } from "react";
import { TeacherComponent } from "./teacher";
import { StudentComponent } from "./student";
import { AdminComponent } from "./admin";
import { Card } from "./card";

import { BookUser, GraduationCap } from "lucide-react";

interface ToggleProp {
  role: string; // optional prop
  setRole: Dispatch<SetStateAction<string>>;
}

export function ToggleComponent(props: ToggleProp) {
  return (
    <div>
      {(() => {
        switch (props.role) {
          case "teacher":
            return <TeacherComponent setRole={props.setRole} />;
          case "student":
            return <StudentComponent setRole={props.setRole} />;
          case "admin":
            return <AdminComponent setRole={props.setRole} />;
          default:
            return (
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-wrap gap-4 max-h-[80vh] overflow-auto p-4 justify-center">
                  {/* Teacher Button */}
                  <button
                    className="flex-shrink-0"
                    onClick={() => props.setRole("teacher")}
                  >
                    <Card
                      styling="hover:bg-blue-300 cursor-pointer hover:border-blue-900"
                      title="Teacher"
                      icon={<BookUser size={50} />}
                    />
                  </button>
                  {/* Student Button */}
                  <button
                    className="flex-shrink-0"
                    onClick={() => props.setRole("student")}
                  >
                    <Card
                      styling="hover:bg-blue-300 cursor-pointer hover:border-blue-900"
                      title="Student"
                      icon={<GraduationCap size={50} />}
                    />
                  </button>
                  {/* Admin Button */}
                  {/* <button
                    className="flex-shrink-0"
                    onClick={() => props.setRole("admin")}
                  >
                    <Card
                      styling="hover:bg-green-300 cursor-pointer hover:border-blue-900"
                      title="Admin"
                    />
                  </button> */}
                </div>
              </div>
            );
        }
      })()}
    </div>
  );
}
