/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { TeacherDocument } from "@/structures/interfaceFile";

import { BackButton } from "../back";
import { TestCodeInput } from "./TestCode";

interface TeacherProp {
  handleBack: () => any;
}

export function OnlineSingleTestComponent({ handleBack }: TeacherProp) {
  const [testData, setTestData] = useState<TeacherDocument | null>(null);

  return (
    <div className="relative flex flex-col items-center overflow-auto overflow-x-hidden custom-scrollbar">
      {testData ? (
        <div>
          <BackButton styling="top-6 left-3" handleBack={handleBack} />
        </div>
      ) : (
        <div>
          <BackButton styling="top-6 left-3" handleBack={handleBack} />
          <TestCodeInput setTestData={setTestData} />
        </div>
      )}
    </div>
  );
}
