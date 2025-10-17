"use client";

import { useEffect, useState } from "react";
import { ToggleComponent } from "@/components/toggle";
export default function Home() {
  const [teacher, setTeacher] = useState(true);

  useEffect(() => {}, []);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-sky-100">
      <ToggleComponent teacher={teacher} setTeacher={setTeacher} />
    </div>
  );
}
