interface CardProps {
  title: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleClick?: () => any;
}

export function Card({
  title,
  description = "",
  handleClick = () => {},
}: CardProps) {
  return (
    <div
      onClick={handleClick}
      className=" w-64 h-32 p-6 bg-blue-200 border border-gray-200 rounded-lg shadow-sm
       hover:bg-green-300 cursor-pointer flex flex-col justify-center items-center text-center"
    >
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
