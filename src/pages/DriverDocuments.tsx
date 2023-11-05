import axios from "axios";
import { useEffect, useState } from "react";
import { urlServer } from "../utils/constants";
import { Driver } from "../types/types";
import clsx from "clsx";

const DriverDocuments = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driverSelected, setDriverSelected] = useState<Driver>();

  useEffect(() => {
    axios.get(`${urlServer}/drivers`).then((res) => {
      setDrivers(res?.data?.filter((d: Driver) => d.DOCUMENTS && !d.VERIFIED_DOCUMENTS));
    });
  }, [localStorage.getItem("user")]);

  console.log(drivers, driverSelected);

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
          <div key={driver.CEDULE} className="w-full">
            <div onClick={() => setDriverSelected((prev) => (prev?.CEDULE === driver.CEDULE ? undefined : driver))} className="w-full flex cursor-pointer p-3 hover:bg-gray-100">
              <div className="w-[15%]">{driver.CEDULE}</div>
              <div className="w-[18%]">{driver.NAMES}</div>
              <div className="w-[17%]">{driver.SURNAMES}</div>
              <div className="w-[20%]">{driver.EMAIL}</div>
              <div className="w-[15%]">{driver.PHONE}</div>
              <div className="w-[15%]">{driver.STATUS}</div>
            </div>
            <div className={clsx("w-full flex opacity-0 transition", driverSelected?.CEDULE === driver.CEDULE && "opacity-100")}>
              <ul className="w-[50%] flex flex-col items-start">
                {[
                  { label: "Calificación", value: driver.QUALIFICATION },
                  { label: "Rutas completadas", value: driver.COMPLETED_RACES },
                  { label: "Fecha de nacimiento", value: driver.BIRTHDATE },
                  { label: "Dirección", value: driver.ADDRESS },
                  { label: "Ciudad", value: driver.CITY },
                ].map(({ label, value }, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{label}: </span>
                    {value as string}
                  </li>
                ))}
              </ul>
              <div className="w-[50%]">DOCUMENTOS</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverDocuments;
