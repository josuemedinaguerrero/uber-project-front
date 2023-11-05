import { IconType } from "react-icons";

import clsx from "clsx";

interface ButtonProps {
  text: string;
  width?: string;
  type: "submit" | "button";
  handleClick?: () => void;
  bgColor?: string;
  Icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({ text, Icon, bgColor = "bg-lime-500", handleClick, type, width = "w-80" }) => {
  return (
    <button onClick={handleClick} type={type} className={clsx("rounded-full text-white font-bold p-2", bgColor, width, Icon && "flex justify-center items-center gap-2")}>
      {text} {Icon && <Icon />}
    </button>
  );
};

export default Button;
