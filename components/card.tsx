interface CardProps {
  title: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleClick?: () => any;
  styling?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
}

export function Card({
  title,
  description = "",
  handleClick = () => {},
  styling,
  icon,
}: CardProps) {
  return (
    <div
      onClick={handleClick}
      className={` w-64 h-32 p-6 bg-[#18c99d] border border-green-500 rounded-lg shadow-sm 
         ${styling} flex flex-col justify-center items-center text-center`}
    >
      {icon && <div className="text-black">{icon}</div>}

      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
