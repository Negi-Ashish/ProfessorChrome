import Link from "next/link";

interface CardProps {
  title: string;
  description?: string;
  href?: string; // optional, defaults to "#"
}

export function Card({ title, description = "", href = "#" }: CardProps) {
  return (
    <Link
      href={href}
      className=" w-64 h-32 p-6 bg-blue-200 border border-gray-200 rounded-lg shadow-sm
                 hover:bg-blue-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700
                 flex flex-col justify-center items-center text-center"
    >
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {description}
      </p>
    </Link>
  );
}
