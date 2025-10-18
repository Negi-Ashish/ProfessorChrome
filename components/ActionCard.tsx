import React from "react";

interface ActionCardProp {
  name: string;
}
export function ActionCard({ name }: ActionCardProp) {
  return (
    <section className="cursor-pointer bg-blue-300 min-w-xl max-w-2xl min-h-12 rounded-xl flex items-center justify-center hover:bg-green-400">
      <h1 className="text-xl font-extrabold">{name}</h1>
    </section>
  );
}
