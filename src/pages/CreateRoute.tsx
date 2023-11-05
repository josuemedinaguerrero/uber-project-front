import { useState } from "react";

import ModalContainer from "../components/ModalContainer";
import Button from "../components/Button";
import animationDriver from "../assets/driver.json";

import { useLocation } from "react-router-dom";

import Lottie from "lottie-react";

const CreateRoute = () => {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();

  const handleCancelRoute = () => {
    console.log("CANCELAR RUTA");
  };

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
        <div className="w-full flex justify-center items-center gap-10">
          <ul>
            <li>
              <span className="font-bold">Marca:</span> nose
            </li>
            <li>
              <span className="font-bold">Modelo:</span> nose
            </li>
            <li>
              <span className="font-bold">Número de placa:</span> nose
            </li>
            <li>
              <span className="font-bold">Color:</span> nose
            </li>
            <li>
              <span className="font-bold">Tipo:</span> nose
            </li>
          </ul>
          <img className="w-[30%]" src="./images/carro1.png" />
        </div>
      </div>

      <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="p-7 rounded-2xl border-2">
          <p>¿Está seguro de que desea cancelar su ruta?</p>
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
