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
      className="cursor-pointer bg-blue-300 min-w-xl max-w-2xl min-h-12 rounded-xl flex items-center justify-center hover:bg-green-400 mt-2"
    >
      <h1 className="text-xl font-extrabold">{name}</h1>
    </section>
  );
}
