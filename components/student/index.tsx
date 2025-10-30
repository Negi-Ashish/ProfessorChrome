/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BackButton } from "../back";
import { StudentMode } from "@/structures/typeFile";
import { Card } from "../card";
import { OfflineTestOneByOne } from "./offline_one_at_a_time";
import { destroyProofreader, initProofreader } from "@/utils/proofreaderClient";
import { TestsType } from "./offline_tests";
import { OfflineCompleteTest } from "./offline_complete_test";
import { OnlineCompleteTestComponent } from "./online_complete_test";
import { OnlineTestOneByOne } from "./online_one_at_a_time";
import { BookLock, BookKey, NotebookPen, BookOpenCheck } from "lucide-react";

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
      case "offline_oneByone":
        return (
          <div>
            <BackButton handleBack={() => handleBack()} />
            <OfflineTestOneByOne testState={testState} chromeAPI={chromeAPI} />
          </div>
        );
      case "offline_complete_test":
        return (
          <div>
            <BackButton handleBack={() => handleBack()} />
            <OfflineCompleteTest testState={testState} chromeAPI={chromeAPI} />
          </div>
        );
      case "online_oneByone":
        return (
          <div>
            <OnlineTestOneByOne
              handleBack={() => handleBack()}
              testState={testState}
              chromeAPI={chromeAPI}
            />
          </div>
        );
      case "online_complete_test":
        return (
          <div>
            <OnlineCompleteTestComponent
              handleBack={() => handleBack()}
              testState={testState}
              chromeAPI={chromeAPI}
            />
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
        <div className="relative ">
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
                onClick={() => setStudentMode("offline_oneByone")}
              >
                <Card
                  title="One by one Practice Sets"
                  styling="hover:bg-blue-300 cursor-pointer hover:border-blue-900"
                  icon={<BookOpenCheck size={50} />}
                />
              </button>
              <button
                className="flex-shrink-0"
                onClick={() => setStudentMode("offline_complete_test")}
              >
                <Card
                  title="Complete Practice Sets"
                  styling="hover:bg-blue-300 cursor-pointer hover:border-blue-900"
                  icon={<NotebookPen size={50} />}
                />
              </button>
              {/* Online Tests */}
              <button
                className="flex-shrink-0"
                disabled={!isOnline}
                onClick={() => setStudentMode("online_oneByone")}
              >
                <Card
                  title="One by one Live Tests"
                  styling={
                    isOnline
                      ? `hover:bg-blue-300 cursor-pointer hover:border-blue-900`
                      : `hover:bg-red-300 opacity-50 cursor-not-allowed hover:border-red-900`
                  }
                  icon={<BookKey size={50} />}
                />
              </button>
              <button
                className="flex-shrink-0"
                disabled={!isOnline}
                onClick={() => setStudentMode("online_complete_test")}
              >
                <Card
                  title="Complete Live Tests"
                  styling={
                    isOnline
                      ? `hover:bg-blue-300 cursor-pointer hover:border-blue-900`
                      : `hover:bg-red-300 opacity-50 cursor-not-allowed hover:border-red-900`
                  }
                  icon={<BookLock size={50} />}
                />
              </button>
              {/* Check Leaderboard */}
              {/* <button
                className="flex-shrink-0"
                disabled={!isOnline}
                onClick={() => setStudentMode("leaderboard")}
              >
                <Card
                  title="Leaderboard"
                  styling={
                    isOnline
                      ? `hover:bg-blue-300 cursor-pointer hover:border-blue-900`
                      : `hover:bg-red-300 opacity-50 cursor-not-allowed hover:border-red-900`
                  }
                />
              </button> */}
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
