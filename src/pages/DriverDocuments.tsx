import { useCallback, useEffect, useState } from "react";

import { urlServer } from "../utils/constants";
import { Driver } from "../types/types";

import { AiOutlineIdcard, AiFillCar, AiFillStar, AiOutlineStar, AiOutlineSend } from "react-icons/ai";
import { GrLicense } from "react-icons/gr";

import toast from "react-hot-toast";
import axios from "axios";
import clsx from "clsx";
import Input from "../components/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/Button";

const DriverDocuments = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [documents, setDocuments] = useState<ArrayBuffer[]>([]);
  const [driverSelected, setDriverSelected] = useState<Driver>();

  const { register, handleSubmit } = useForm<FieldValues>({ defaultValues: { comment: "", verify: false } });

  useEffect(() => {
    axios.get(`${urlServer}/drivers`).then((res) => {
      setDrivers(res?.data?.filter((d: Driver) => d.DOCUMENTS && !d.VERIFIED_DOCUMENTS));
    });
  }, [localStorage.getItem("user")]);

  const dateUser = useCallback(
    (date: Date): string => {
      const newDate = new Date(date);
      const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
      return `${days?.[newDate.getDay() - 1]}, ${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
    },
    [localStorage.getItem("user")]
  );

  const handleClickDriver = useCallback(
    async (driver: Driver) => {
      try {
        const sameDriver = driver.CEDULE === driverSelected?.CEDULE;

        console.log({ driver, driverSelected, sameDriver });

        if (!sameDriver) {
          let [doc_cedule, doc_registration, doc_license] = await Promise.all([
            axios.get(`${urlServer}/documents/cedule/${driver.CEDULE}`, { responseType: "arraybuffer" }),
            axios.get(`${urlServer}/documents/registration/${driver.CEDULE}`, { responseType: "arraybuffer" }),
            axios.get(`${urlServer}/documents/license/${driver.CEDULE}`, { responseType: "arraybuffer" }),
          ]);

          setDocuments([doc_cedule.data, doc_registration.data, doc_license.data]);
        }

        setDriverSelected((prev) => (prev?.CEDULE === driver.CEDULE ? undefined : driver));
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [driverSelected?.CEDULE]
  );

  const handleClickOpenDocument = (idx: number) => {
    const pdfBlob = new Blob([documents[idx]], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  const submitComment: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();
    formData.append("cedule", driverSelected!.CEDULE);
    formData.append("destination", driverSelected!.EMAIL);
    formData.append("body", data?.comment);
    formData.append("subject", "Documentos | UBER");
    formData.append("verified_documents", data?.verify);

    try {
      const { data } = await axios.put(`${urlServer}/verificate-documents`, formData);
      console.log({ data });
    } catch (_) {
      toast.error("Ha ocurrido un error");
    }
  };

  return (
    <div className="w-full text-center">
      <h1 className="font-bold my-5 text-2xl">Conductores</h1>
      <div className="w-full">
        <div className="w-full flex cursor-pointer p-3 font-semibold">
          <div className="w-[15%]">Cédula</div>
          <div className="w-[18%]">Nombres</div>
          <div className="w-[17%]">Apellidos</div>
          <div className="w-[20%]">Correo electrónico</div>
          <div className="w-[15%]">Teléfono</div>
          <div className="w-[15%]">Estado</div>
        </div>
        {drivers.map((driver) => (
          <div key={driver.CEDULE} className="w-full flex flex-col items-center">
            <div
              onClick={() => handleClickDriver(driver)}
              className={clsx("w-full flex items-center cursor-pointer transition p-3 hover:bg-gray-100", driverSelected?.CEDULE === driver.CEDULE && "bg-gray-100")}
            >
              <div className="w-[15%]">{driver.CEDULE}</div>
              <div className="w-[18%]">{driver.NAMES}</div>
              <div className="w-[17%]">{driver.SURNAMES}</div>
              <div className="w-[20%]">{driver.EMAIL}</div>
              <div className="w-[15%]">{driver.PHONE}</div>
              <div className="w-[15%]">
                <span className={clsx(!driver.VERIFIED_DOCUMENTS && "bg-red-600 inline-block rounded-full min-w-[25px] text-white")}>{driver.STATUS}</span>
              </div>
            </div>
            <div className={clsx("w-[80%] mt-3 mb-5", driverSelected?.CEDULE !== driver.CEDULE && "hidden")}>
              <div className="flex items-center">
                <ul className="w-[50%] flex flex-col items-start text-start">
                  {[
                    { label: "Calificación", value: driver.QUALIFICATION },
                    { label: "Rutas completadas", value: driver.COMPLETED_RACES },
                    { label: "Fecha de nacimiento", value: dateUser(driver.BIRTHDATE) },
                    { label: "Dirección", value: driver.ADDRESS },
                    { label: "Ciudad", value: driver.CITY },
                  ].map(({ label, value }, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">{label}: </span>
                      <span className="inline-flex gap-1 items-center">
                        {value} {label === "Calificación" && ((value as number) >= 5 ? <AiFillStar color="#FFD700" /> : <AiOutlineStar color="#FFD700" />)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="w-[50%] flex justify-center gap-3">
                  {[
                    { Icon: AiOutlineIdcard, text: "Cédula" },
                    { Icon: AiFillCar, text: "Matrícula" },
                    { Icon: GrLicense, text: "Licencia" },
                  ].map(({ Icon, text }, idx) => (
                    <div key={idx} onClick={() => handleClickOpenDocument(idx)} className="bg-[#F0F0F0] text-[#373737] cursor-pointer min-w-[110px] rounded-2xl p-4 flex flex-col items-center gap-1">
                      <Icon size={30} />
                      <div className="flex justify-center items-center gap-2">{text}</div>
                    </div>
                  ))}
                </div>
              </div>
              <form onSubmit={handleSubmit(submitComment)} className="w-full mt-2 flex flex-col items-center gap-2">
                <div className="flex gap-2">
                  <input type="checkbox" {...register("verify")} id="verify" />
                  <label htmlFor="verify">Verificar documentos</label>
                </div>
                <div className="w-full flex items-center gap-2">
                  <Input register={register} placeholder="Enviar comentario..." name="comment" />
                  <Button type="submit" text="Enviar" width="w-[200px]" Icon={AiOutlineSend} />
                </div>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverDocuments;
