import Input from "../components/Input";
import Button from "../components/Button";

import { urlServer } from "../utils/constants";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import axios from "axios";

const Register = () => {
  const { register, handleSubmit } = useForm<FieldValues>({ defaultValues: { cedule: "", password: "" } });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("cedule", data.cedule);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);

      const res = await axios.post(`${urlServer}/register`, formData);

      console.log(res.data);

      if (res?.data?.error) {
        toast.error(res?.data?.message);
        return;
      }

      toast.success(res?.data?.message);
      navigate("/");
    } catch (_) {
      toast.error("Error durante la petición!");
    }
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <h2 className="text-gray-700 font-bold text-2xl">Registro</h2>

      <form className="w-full flex flex-col items-center gap-5" onSubmit={handleSubmit(onSubmit)}>
        <Input register={register} placeholder="Nombre de usuario" required name="username" />
        <Input register={register} placeholder="Número de cédula" required name="cedule" />
        <Input register={register} placeholder="Correo electrónico" required name="email" />
        <Input register={register} placeholder="Contraseña" required type="password" name="password" />

        <br />

        <Button text="Guardar" type="submit" />
        <Button text="Regístrate como conductor" type="button" bgColor="bg-indigo-400" handleClick={() => navigate("/create-driver")} />
        <Button text="Volver" type="button" bgColor="bg-gray-500" handleClick={() => navigate("/login")} />
      </form>
    </div>
  );
};

export default Register;
