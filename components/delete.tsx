/* eslint-disable @typescript-eslint/no-explicit-any */
import { RiDeleteBin5Line } from "react-icons/ri";

type BackButtonProps = {
  handleDelete: () => any;
  styling?: string;
};

export function DeleteButton({ handleDelete, styling }: BackButtonProps) {
  return (
    <div
      onClick={handleDelete}
      className={`absolute top-2 right-2 flex items-center text-[20px] 
      cursor-pointer text-gray-700 hover:text-red-900 transition-colors ${styling}`}
    >
      <RiDeleteBin5Line />
    </div>
  );
}
