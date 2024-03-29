import { useCallback, useState, useEffect } from "react";

import Button from "../Button";
import animationDocuments from "../../assets/documents.json";
import Input from "../Input";

import { urlServer } from "../../utils/constants";
import { Driver } from "../../types/types";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiFillWarning, AiOutlineIdcard, AiFillCar, AiOutlineFileDone } from "react-icons/ai";
import { GrLicense } from "react-icons/gr";

import toast from "react-hot-toast";
import Lottie from "lottie-react";
import axios from "axios";

interface DriverPanelInterface {
  user: Driver;
}

const DriverPanel: React.FC<DriverPanelInterface> = ({ user }) => {
  const [documents, setDocuments] = useState<File[]>([]);
  const [imageProfile, setImageProfile] = useState<File | null>();
  const [storedVehicle, setStoredVehicle] = useState(false);

  const { register, handleSubmit } = useForm<FieldValues>({ defaultValues: { cedule: "", password: "" } });

  useEffect(() => {
    axios.get(`${urlServer}/car/${user.CEDULE}`).then((res) => setStoredVehicle(res.data?.data?.DRIVER));
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = event.target.files?.[0];

    if (file?.type === "application/pdf") {
      setDocuments((prevDocuments) => {
        const documentsUpdated = [...prevDocuments];
        documentsUpdated[id] = file;
        return documentsUpdated;
      });
    } else {
      toast.error("Ingrese un archivo PDF válido!!!");
    }
  };

  const uploadDocuments = useCallback(async () => {
    const formData = new FormData();
    formData.append("cedule", documents[0]);
    formData.append("registration", documents[1]);
    formData.append("license", documents[2]);
    formData.append("cedule", user?.CEDULE);

    const { data } = await axios.put(`${urlServer}/driver-documents`, formData);

    if (data?.error) {
      toast.error(data?.message);
      return;
    }

    toast.success(data?.message, { duration: 8000 });
    localStorage.setItem("user", JSON.stringify({ ...user, DOCUMENTS: 1 }));
  }, [documents, user]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const formData = new FormData();
      console.log({ data });

      formData.append("plate", data?.plate);
      formData.append("color", data?.color);
      formData.append("cedule", user.CEDULE);
      imageProfile && formData.append("image", imageProfile);

      const res = await axios.post(`${urlServer}/upload-car`, formData);

      if (res.data?.error) throw new Error(res.data?.message);

      toast.success(res.data?.message);
      setStoredVehicle(true);
    } catch (error: any) {
      toast.error(error?.message);
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
    <div className="mt-10">
      {!user?.STATE_DOCUMENTS && (
        <div className="w-[100%] md:w-[70%] flex items-center justify-center gap-3 m-auto bg-orange-500 text-white font-bold rounded-full p-5">
          <div>
            <AiFillWarning size={25} />
          </div>
          <p>Estimado conductor, le recordamos que tiene pendiente subir los documentos; si no ingresa sus documentos a la plataforma, no habilitaremos sus servicios.</p>
        </div>
      )}

      <div className="flex flex-col items-center gap-2 mt-5">
        <h3 className="font-bold">Documentos:</h3>

        {!user?.STATE_DOCUMENTS && (
          <>
            <p>No tiene documentos</p>
            <p className="text-sm">
              Los documentos que debe subir serás los siguientes: licencia, matrícula y cédula. <span className="font-bold">SOLO SE ADMITE FORMATO PDF!!!</span>
            </p>
          </>
        )}

        <div className="flex gap-10 my-5">
          {[
            { Icon: AiOutlineIdcard, text: "Cédula", inputId: "cedulaInput" },
            { Icon: AiFillCar, text: "Matrícula", inputId: "matriculaInput" },
            { Icon: GrLicense, text: "Licencia", inputId: "licenciaInput" },
          ].map(({ Icon, inputId, text }, idx) => (
            <label key={idx} htmlFor={inputId} className="bg-[#F0F0F0] text-[#373737] cursor-pointer rounded-2xl py-3 px-8 flex flex-col items-center gap-2">
              <Icon size={70} />
              <div className="flex justify-center items-center gap-2">
                {text}
                {documents?.[idx] || user?.STATE_DOCUMENTS ? <AiOutlineFileDone className="text-green-500 text-2xl" /> : null}
              </div>
            </label>
          ))}
        </div>

        {!user.STATE_DOCUMENTS && (
          <>
            <div style={{ display: "none" }}>
              <input type="file" id="cedulaInput" accept=".pdf" onChange={(e) => handleFileChange(e, 0)} />
              <input type="file" id="matriculaInput" accept=".pdf" onChange={(e) => handleFileChange(e, 1)} />
              <input type="file" id="licenciaInput" accept=".pdf" onChange={(e) => handleFileChange(e, 2)} />
            </div>

            <Button type="button" text="Subir documentos" handleClick={uploadDocuments} />
          </>
        )}

        {user.STATE_DOCUMENTS ? (
          <>
            {user.STATE_DOCUMENTS === 3 && (
              <>
                <div>En estos momentos estamos asignando una revisión para tus documentos, por favor, ten un poco de paciencia...</div>
                <Lottie style={{ width: "70%" }} animationData={animationDocuments} />
              </>
            )}

            {user.STATE_DOCUMENTS === 2 && (
              <div className="w-full">
                <p className="bg-red-500 py-2 px-4 rounded-2xl text-white text-sm">Sus documentos han sido rechazados, por favor, revisar su correo electrónico para mayor información.</p>
              </div>
            )}

            {user.STATE_DOCUMENTS === 1 && (
              <div className="w-full flex flex-col items-center">
                <p className="bg-green-500 max-w-[600px] py-2 text-center px-4 rounded-2xl text-white text-sm">Felicidades, sus documentos cumplen con los requisitos especificados.</p>

                {!storedVehicle && (
                  <div className="mt-10 w-[80%]">
                    <h3 className="text-center">Ahora, por favor, deberá subir la información de su vehículo, así como una fotografía.</h3>

                    <form className="w-full flex flex-col items-center gap-5 mt-5" onSubmit={handleSubmit(onSubmit)}>
                      <Input register={register} placeholder="Número de placa" required name="plate" />
                      <Input register={register} placeholder="Color" required name="color" />

                      <div className="max-w-[500px] h-[300px]">
                        <input id="fileInput" className="hidden" type="file" accept="image/*" onChange={handleImageUpload} />
                        <img
                          onClick={handleImageClick}
                          className="w-full h-full object-cover object-center"
                          src={imageProfile ? URL.createObjectURL(imageProfile) : "./images/default_driver.jpg"}
                          alt="image profile"
                        />
                      </div>

                      <Button text="Guardar" type="submit" />
                    </form>
                  </div>
                )}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default DriverPanel;
