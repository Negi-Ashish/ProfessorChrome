/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiArrowLeft } from "react-icons/fi";

type BackButtonProps = {
  handleBack: () => any;
  styling?: string;
};

export function BackButton({ handleBack, styling }: BackButtonProps) {
  return (
    <div
      onClick={handleBack}
      className={`absolute ${styling} flex items-center text-[20px] cursor-pointer text-gray-700 hover:text-gray-900 transition-colors`}
    >
      <FiArrowLeft />
    </div>
  );
}
