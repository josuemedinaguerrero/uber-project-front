import clsx from "clsx";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  placeholder: string;
  name: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  type?: string;
  width?: string;
}

const Input: React.FC<InputProps> = ({ register, name, placeholder, required, type, width = "w-full" }) => {
  return (
    <div className={clsx("flex items-center justify-between", width)}>
      <div className="w-[30%]">{placeholder}</div>
      <input {...register(name)} required={required} type={type} className="bg-gray-100 w-[70%] py-2 px-3 rounded-full outline-none" />
    </div>
  );
};

export default Input;
