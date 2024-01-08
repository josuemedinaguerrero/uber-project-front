import { useEffect, useMemo, useState } from "react";

import Button from "./Button";

import { urlServer } from "../utils/constants";
import { User, Driver, FieldClient, FieldDefaultClient } from "../types/types";

import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";

type Session = User & Driver;

const fieldsClient: FieldClient[] = [
  { name: "USERNAME", label: "Nombre de usuario" },
  { name: "CEDULE", label: "Número de cédula", disabled: true },
  { name: "EMAIL", label: "Correo Electrónico" },
];

const Navbar = () => {
  const [pendingDocuments, setPendingDocuments] = useState(0);
  const [profile, setProfile] = useState<{ CEDULE: string; PAYMENT_METHOD: number }>();

  const navigate = useNavigate();
  const location = useLocation();

  const userLocal = localStorage.getItem("user");

  const user: Session = useMemo(() => {
    if (!userLocal) {
      navigate("/login");
      return null;
    } else {
      return JSON.parse(userLocal);
    }
  }, [userLocal]);

  useEffect(() => {
    if (user?.ROL) {
      switch (user.ROL) {
        case "ADMIN":
          axios.get(`${urlServer}/drivers`).then((res) => {
            setPendingDocuments(res?.data?.filter((d: Driver) => d.STATE_DOCUMENTS === 3)?.length);
          });
          break;
        case "CLIENT":
          axios.get(`${urlServer}/profile/${user.CEDULE}`).then((res) => setProfile(res.data?.data));
          break;
        default:
          break;
      }
    }
  }, [userLocal]);

  const handleClick = (path: string) => navigate(path);

  const handleCloseSession = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const defaultValues = useMemo(() => {
    if (!user) {
      return null;
    }

    const obj: FieldDefaultClient = {} as FieldDefaultClient;

    fieldsClient.forEach((field) => {
      obj[field.name] = user[field.name];
    });

    obj.PAYMENT_METHOD = profile?.PAYMENT_METHOD;

    return obj;
  }, [profile]);

  return (
    user?.CEDULE && (
      <div className="w-full h-20 absolute top-0 flex items-center justify-between">
        <h2>
          Bienvenido, {user?.NAMES?.toUpperCase() || user?.USERNAME?.toUpperCase()} | {user.ROL}
        </h2>

        <div className="flex gap-2">
          {location.pathname !== "/" && <Button handleClick={() => handleClick("/")} text="Inicio" type="button" width="w-32" />}
          {user.ROL?.trim() === "ADMIN" && (
            <>
              <div className="w-40 relative">
                <Button text="Conductores" type="button" width="w-full" handleClick={() => navigate("/driver-documents")} />
                <span className="cursor-pointer absolute -top-1 -right-1 bg-red-600 rounded-full w-5 h-5 flex justify-center items-center text-white text-sm font-bold">{pendingDocuments}</span>
              </div>
              <Button text="Configuración" handleClick={() => handleClick("/configuration-admin")} type="button" width="w-32" />
            </>
          )}
          {user.ROL === "CLIENT" && <Button handleClick={() => navigate("/configure-user", { state: { defaultValues, user, fieldsClient } })} text="Configuración" type="button" width="w-40" />}
          <Button handleClick={handleCloseSession} text="Cerrar sesión" type="button" width="w-32" />
        </div>
      </div>
    )
  );
};

export default Navbar;
