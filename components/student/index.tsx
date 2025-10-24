/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BackButton } from "../back";
import { StudentMode } from "@/structures/typeFile";
import { Card } from "../card";
import { OfflineTest } from "./offline_one_at_a_time";
import { destroyProofreader, initProofreader } from "@/utils/proofreaderClient";
import { TestsType } from "./offline_tests";

interface StudentProp {
  setRole: Dispatch<SetStateAction<string>>;
}

export function StudentComponent({ setRole }: StudentProp) {
  const [studentMode, setStudentMode] = useState<StudentMode>("");
  const [selectedTest, setSelectedTest] = useState<"" | keyof TestsType>("");
  const [result, setResult] = useState<any>([]);
  const [promptResult, setPromptResult] = useState<any>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [pressedAnalyze, setPressedAnalyze] = useState<boolean[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [total, setTotal] = useState<any>(null);
  const [promptSession, setPromptSession] = useState<any>(null);

  const [proofreaderSession, setProofReaderSession] =
    useState<Proofreader | null>(null);

  const testState = {
    selectedTest,
    setSelectedTest,
    result,
    setResult,
    promptResult,
    setPromptResult,
    answers,
    setAnswers,
    pressedAnalyze,
    setPressedAnalyze,
    currentIndex,
    setCurrentIndex,
    showScore,
    setShowScore,
    total,
    setTotal,
  };

  const chromeAPI = {
    proofreaderSession,
    setProofReaderSession,
    promptSession,
    setPromptSession,
  };

  const isTestReset = () => {
    return (
      selectedTest === "" &&
      result.length === 0 &&
      promptResult.length === 0 &&
      answers.length === 0 &&
      pressedAnalyze.length === 0 &&
      currentIndex === 0 &&
      showScore === false &&
      total === null &&
      promptSession === null
    );
  };

  const handleBack = () => {
    if (isTestReset()) {
      setStudentMode("");
    } else {
      setSelectedTest("");
      setResult([]);
      setPromptResult([]);
      setAnswers([]);
      setPressedAnalyze([]);
      setCurrentIndex(0);
      setShowScore(false);
      setTotal(null);
      setPromptSession(null);
    }
  };

  const renderStudentMode = () => {
    switch (studentMode) {
      case "offline":
        return (
          <div>
            <BackButton handleBack={() => handleBack()} />
            <OfflineTest testState={testState} chromeAPI={chromeAPI} />
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

  useEffect(() => {
    async function fetchData() {
      const proofreader = await initProofreader();
      setProofReaderSession(proofreader);
    }

    fetchData();
    return () => {
      if (studentMode == "") {
        console.log("ok");
        destroyProofreader();
        setProofReaderSession(null);
      } // cleanup on unmount
    };
  }, [studentMode]);

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
        <div className="overflow-y-auto overflow-x-hidden custom-scrollbar">
          {renderStudentMode()}
        </div>
      )}
    </div>
  );
}
