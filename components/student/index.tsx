import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BackButton } from "../back";
import { StudentMode } from "@/structures/typeFile";
import { Card } from "../card";
import { OfflineTest } from "./offline";

interface StudentProp {
  text?: string; // optional prop
  setRole: Dispatch<SetStateAction<string>>;
}

export function StudentComponent({ setRole }: StudentProp) {
  const [studentMode, setStudentMode] = useState<StudentMode>("");

  const renderTeacherMode = () => {
    switch (studentMode) {
      case "offline":
        return (
          <div>
            <BackButton handleBack={() => setStudentMode("")} />
            <OfflineTest />
          </div>
        );
      case "online":
        return (
          <div>
            <BackButton handleBack={() => setStudentMode("")} />
          </div>
        );
      case "leaderboard":
        return (
          <div>
            <BackButton handleBack={() => setStudentMode("")} />
          </div>
        );
      default:
        return <p>No valid mode selected.</p>;
    }
  };

  function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState<boolean>(true);

    useEffect(() => {
      const updateStatus = () => setIsOnline(navigator.onLine);

      updateStatus(); // initial check
      window.addEventListener("online", updateStatus);
      window.addEventListener("offline", updateStatus);

      return () => {
        window.removeEventListener("online", updateStatus);
        window.removeEventListener("offline", updateStatus);
      };
    }, []);

    return isOnline;
  }

  const isOnline: boolean = useOnlineStatus();

  console.log("isOnline", isOnline);

  return (
    <div className=" flex items-center">
      {studentMode == "" && (
        <div className="relative bg-amber-400">
          <BackButton styling="-top-2 right-2" handleBack={() => setRole("")} />
        </div>
      )}
      {studentMode == "" ? (
        <div>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-4 max-h-[80vh] overflow-auto p-4 justify-center">
              {/* Offline Tests */}
              <button
                className="flex-shrink-0"
                onClick={() => setStudentMode("offline")}
              >
                <Card
                  title="Offline Tests"
                  styling="hover:bg-green-300 cursor-pointer"
                />
              </button>
              {/* Online Tests */}
              <button
                className="flex-shrink-0"
                disabled={!isOnline}
                onClick={() => setStudentMode("online")}
              >
                <Card
                  title="Online Tests"
                  styling={
                    isOnline
                      ? `hover:bg-green-300 cursor-pointer`
                      : `hover:bg-red-300 opacity-50 cursor-not-allowed`
                  }
                />
              </button>
              {/* Check Leaderboard */}
              <button
                className="flex-shrink-0"
                disabled={!isOnline}
                onClick={() => setStudentMode("leaderboard")}
              >
                <Card
                  title="Leaderboard"
                  styling={
                    isOnline
                      ? `hover:bg-green-300 cursor-pointer`
                      : `hover:bg-red-300 opacity-50 cursor-not-allowed`
                  }
                />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="">{renderTeacherMode()}</div>
      )}
    </div>
  );
}
