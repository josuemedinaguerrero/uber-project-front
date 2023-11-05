import clsx from "clsx";

interface ButtonProps {
  text: string;
  width?: string;
  type: "submit" | "button";
  handleClick?: () => void;
  bgColor?: string;
}

const Button: React.FC<ButtonProps> = ({ text, bgColor = "bg-lime-500", handleClick, type, width = "w-80" }) => {
  return (
    <button onClick={handleClick} type={type} className={clsx("rounded-full text-white font-bold p-2", bgColor, width)}>
      {text}
    </button>
  );
};

export default Button;
