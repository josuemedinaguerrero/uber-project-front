import { FieldValues, UseFormRegister } from "react-hook-form";

import clsx from "clsx";

interface InputProps {
  placeholder: string;
  name: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  type?: string;
  width?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ register, name, placeholder, disabled, required, type, width = "w-full" }) => {
  return (
    <div className={clsx("flex items-center justify-between", width)}>
      <div className="w-[30%]">{placeholder}</div>
      <input {...register(name)} required={required} type={type} disabled={disabled} className={clsx("bg-gray-100 w-[70%] py-2 px-3 rounded-full outline-none", disabled && "text-gray-400")} />
    </div>
  );
};

export default Input;
