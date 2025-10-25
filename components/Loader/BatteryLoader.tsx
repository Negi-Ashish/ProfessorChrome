"use client";
import { useEffect, useState } from "react";

export default function BatteryLoader() {
  const [charge, setCharge] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCharge((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen  text-white">
      {/* Battery Outline */}
      <div className="relative w-40 h-20 border-4 border-green-400 rounded-md p-1">
        {/* Battery Level */}
        <div
          className="h-full bg-green-400 transition-all duration-300 rounded-sm shadow-[0_0_20px_#22c55e]"
          style={{ width: `${charge}%` }}
        ></div>
        {/* Battery Cap */}
        <div className="absolute -right-3 top-6 w-2 h-8 bg-green-400 rounded-sm"></div>
      </div>

      {/* Charging Text */}
      <p className="mt-6 text-lg font-medium">Charging... {charge}%</p>
    </div>
  );
}
