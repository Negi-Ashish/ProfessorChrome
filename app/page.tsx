"use client";

import { useEffect, useState } from "react";
import { ToggleComponent } from "@/components/toggle";
export default function Home() {
  const [role, setRole] = useState("");

  useEffect(() => {}, []);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#0d0f1a] text-white">
      <ToggleComponent role={role} setRole={setRole} />
    </div>
  );
}
