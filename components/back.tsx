/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiArrowLeft } from "react-icons/fi";

type BackButtonProps = {
  handleBack: () => any;
};

export function BackButton({ handleBack }: BackButtonProps) {
  return (
    <div
      onClick={handleBack}
      className="absolute top-6 left-3 flex items-center text-[20px] cursor-pointer text-gray-700 hover:text-gray-900 transition-colors"
    >
      <FiArrowLeft />
    </div>
  );
}
