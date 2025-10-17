"use client";

import { useEffect, useState } from "react";
import { ToggleComponent } from "@/components/toggle";
export default function Home() {
  const [role, setRole] = useState("");

  useEffect(() => {}, []);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-sky-100">
      <ToggleComponent role={role} setRole={setRole} />
    </div>
  );
}
