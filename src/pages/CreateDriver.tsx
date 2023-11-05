import { useCallback, useState } from "react";

import Button from "../components/Button";
import Input from "../components/Input";

import { useNavigate } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import DatePicker from "react-date-picker";

import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { urlServer } from "../utils/constants";
import toast from "react-hot-toast";

type ValueDatePicker = Date | null;

const CreateDriver = () => {
  const [imageProfile, setImageProfile] = useState<File | null>();
  const [birthdate, setBirthdate] = useState<ValueDatePicker | [ValueDatePicker, ValueDatePicker]>();
  const { register, handleSubmit } = useForm<FieldValues>({ defaultValues: { cedule: "", password: "" } });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const formData = new FormData();

      for (const key in data) {
        formData.append(key, data[key]);
      }

      imageProfile && formData.append("image", imageProfile);

      if (birthdate instanceof Date) {
        formData.append("birthdate", birthdate.toISOString());
      }

      const res = await axios.post(`${urlServer}/create-driver`, formData);

      if (res.data?.error) {
        toast.error(res.data?.message);
        return;
      }

      toast.success(res.data.message);
    } catch (err) {
      console.log({ err });
    }
  };

  const handleImageClick = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput!.click();
  };

  const handleImageUpload = useCallback(async (event: any) => {
    try {
      const file = event?.target?.files[0];
      setImageProfile(file);
    } catch (_) {}
  }, []);

  return (
    <form className="w-full flex flex-col items-center gap-5" onSubmit={handleSubmit(onSubmit)}>
      <h2>Registro de conductor</h2>
      <div className="w-full flex items-center gap-10">
        <div className="w-[50%] flex flex-col gap-5">
          <Input register={register} placeholder="Cédula" required name="cedule" />
          <Input register={register} placeholder="Nombres" required name="names" />
          <Input register={register} placeholder="Apellidos" required name="surnames" />
        </div>
        <div className="max-w-[150px] h-[180px]">
          <input id="fileInput" className="hidden" type="file" accept="image/*" onChange={handleImageUpload} />
          <img
            onClick={handleImageClick}
            className="w-full h-full object-cover object-center"
            src={imageProfile ? URL.createObjectURL(imageProfile) : "./images/default_driver.jpg"}
            alt="image profile"
          />
        </div>
      </div>

      <div className="flex gap-10">
        Fecha de nacimiento:
        <DatePicker onChange={setBirthdate} value={birthdate} />
      </div>

      <div className="w-full flex flex-wrap justify-between gap-5">
        <Input register={register} width="w-[45%]" placeholder="Dirección residencial" required name="address" />
        <Input register={register} width="w-[45%]" placeholder="Ciudad" required name="city" />
        <Input register={register} width="w-[45%]" placeholder="Correo electrónico" required name="email" />
        <Input register={register} width="w-[45%]" placeholder="Teléfono" required name="phone" />
      </div>

      <div className="w-full flex justify-between mt-5 gap-5">
        <Input register={register} width="w-[45%]" type="password" placeholder="Contraseña" required name="password" />
        <Input register={register} width="w-[45%]" type="password" placeholder="Confirmar contraseña" required name="confirmPassword" />
      </div>

      <br />

      <Button text="Guardar datos" type="submit" />
      <Button text="Volver" type="button" bgColor="bg-gray-500" handleClick={() => navigate("/login")} />
    </form>
  );
};

export default CreateDriver;
