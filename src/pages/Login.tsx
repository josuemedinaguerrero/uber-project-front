import Button from "../components/Button";
import Input from "../components/Input";

import { urlServer } from "../utils/constants";

import { useNavigate } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<FieldValues>({ defaultValues: { cedule: "", password: "" } });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("cedule", data.cedule);
      formData.append("password", data.password);

      const res = await axios.post(`${urlServer}/login`, formData);

      if (res?.data?.error) {
        toast.error(res?.data?.message);
        return;
      }

      toast.success(res?.data?.message);

      localStorage.setItem("user", JSON.stringify(res.data?.data));
      navigate("/");
    } catch (_) {
      toast.error("Error durante la petición!");
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <h1 className="text-2xl">Proyecto Grupo C</h1>

      <form className="w-full flex flex-col items-center gap-5" onSubmit={handleSubmit(onSubmit)}>
        <Input register={register} placeholder="Número de cédula" required name="cedule" />
        <Input register={register} placeholder="Contraseña" required type="password" name="password" />

        <br />

        <Button text="Iniciar sesión" type="submit" />
        <Button text="Regístrate" type="button" handleClick={() => navigate("/register")} />
      </form>
    </div>
  );
};

export default Login;
