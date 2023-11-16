import { useState, useEffect } from "react";

import ModalContainer from "../components/ModalContainer";
import Button from "../components/Button";
import Input from "../components/Input";
import animationDriver from "../assets/driver.json";

import { urlServer } from "../utils/constants";

import { useLocation, useNavigate } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FaStar, FaRegStar } from "react-icons/fa";

import Lottie from "lottie-react";
import toast from "react-hot-toast";
import axios from "axios";

const CreateRoute = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(10);
  const [hasComment, setHasComment] = useState(false);

  const { register, watch, handleSubmit } = useForm<FieldValues>();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.resCreateRoute?.CEDULE) navigate("/");

    axios.get(`${urlServer}/review/${location.state?.resCreateRoute?.ID_ROUTE}`).then((res) => setHasComment(res.data?.data?.ROUTE));
  }, []);

  const handleCancelRoute = () => onSubmit({ cancellation: watch("cancellation") });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("id_route", location.state?.resCreateRoute?.ID_ROUTE);
      formData.append("comment_cancellation", data?.cancellation);

      const res = await axios.post(`${urlServer}/cancellation-route`, formData);

      if (res.data?.error) throw new Error(res.data?.message);

      toast.success(res.data?.message);
      navigate("/");
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const onSubmitComment: SubmitHandler<FieldValues> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("rate", rating?.toString());
      formData.append("comment_review", data?.comment);
      formData.append("route_id", location.state?.resCreateRoute?.ID_ROUTE);

      const res = await Promise.all([
        axios.put(`${urlServer}/completed-races/${location.state?.resCreateRoute?.CEDULE}`),
        axios.put(`${urlServer}/rate-driver/${location.state?.resCreateRoute?.CEDULE}`, formData),
      ]);

      if (res[0].data?.error || res[1].data?.error) throw new Error(res[0].data?.message || res[1].data?.message);

      setHasComment(true);
      toast.success("Gracias por calificar tu viaje, nos servirá mucho tu comentario");
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleClickStar = (item: number) => setRating(item);

  return (
    <div className="w-full">
      <div className="w-full flex gap-5 justify-center">
        <div>
          <p className="mb-5">Estimado usuario, el vehículo más cercano llegará a su ubicación en aproximadamente {location.state?.time} minuto(s).</p>
          <Button type="button" bgColor="bg-red-400" text="Cancelar ruta" handleClick={() => setIsOpen(true)} />
        </div>
        <Lottie className="w-32" animationData={animationDriver} />
      </div>

      <div className="w-full flex flex-col gap-5 items-center mt-5">
        <p>Para que pueda identificar el vehículo, estas son las características:</p>
        <div className="flex justify-evenly items-center">
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="font-bold">Información del vehículo:</h3>
              <ul>
                <li>
                  <span className="font-bold">Color:</span> {location.state?.resCreateRoute?.COLOR}
                </li>
                <li>
                  <span className="font-bold">Placa:</span> {location.state?.resCreateRoute?.PLATE}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold">Información del conductor:</h3>
              <ul>
                <li>
                  <span className="font-bold">Nombres:</span> {location.state?.resCreateRoute?.NAMES} {location.state?.resCreateRoute?.SURNAMES}
                </li>
                <li>
                  <span className="font-bold">Número de teléfono:</span> {location.state?.resCreateRoute?.PHONE}
                </li>
                <li>
                  <span className="font-bold">Correo electrónico:</span> {location.state?.resCreateRoute?.EMAIL}
                </li>
                <li>
                  <span className="font-bold">Número de cédula:</span> {location.state?.resCreateRoute?.CEDULE}
                </li>
              </ul>
            </div>
          </div>
          <img className="w-[30%]" src="/images/carro1.png" />
        </div>
      </div>

      {!hasComment && (
        <div className="mt-5 flex flex-col gap-5 items-center">
          <h2 className="font-bold">CALIFICA TU VIAJE!!!</h2>

          <form className="w-full flex flex-col items-center gap-5" onSubmit={handleSubmit(onSubmitComment)}>
            <Input register={register} placeholder="Deja algún comentario" name="comment" />

            <div className="w-full flex justify-center gap-5">
              {Array.from({ length: 10 }).map((_, idx) =>
                idx + 1 <= rating ? (
                  <FaStar key={idx} size={40} onClick={() => handleClickStar(idx + 1)} className="cursor-pointer text-yellow-500" />
                ) : (
                  <FaRegStar key={idx} size={40} onClick={() => handleClickStar(idx + 1)} className="cursor-pointer" />
                )
              )}
            </div>

            <Button type="submit" text="Enviar" width="w-[45%]" />
          </form>
        </div>
      )}

      <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="p-7 rounded-2xl border-2 sm:w-[700px] w-[400px]">
          <p>¿Está seguro de que desea cancelar su ruta?</p>
          <form className="w-full flex flex-col items-center gap-5 mt-5" onSubmit={handleSubmit(onSubmit)}>
            <Input register={register} placeholder="Motivo" name="cancellation" />
          </form>

          <div className="flex w-full justify-between mt-3">
            <Button type="button" text="Volver" width="w-[45%]" bgColor="bg-gray-400" handleClick={() => setIsOpen(false)} />
            <Button type="button" text="Cancelar ruta" width="w-[45%]" bgColor="bg-red-400" handleClick={handleCancelRoute} />
          </div>
        </div>
      </ModalContainer>
    </div>
  );
};

export default CreateRoute;
