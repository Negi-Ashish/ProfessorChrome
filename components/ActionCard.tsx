import React from "react";

interface ActionCardProp {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleClick?: () => any;
}
export function ActionCard({ name, handleClick }: ActionCardProp) {
  return (
    <section
      onClick={handleClick}
      className="bg-[#18c99d] border border-green-500  min-w-xl max-w-2xl min-h-12 rounded-xl 
      flex items-center justify-center hover:bg-blue-300 cursor-pointer hover:border-blue-900 mt-2"
    >
      <h1 className="text-xl text-black font-extrabold">{name}</h1>
    </section>
  );
}
