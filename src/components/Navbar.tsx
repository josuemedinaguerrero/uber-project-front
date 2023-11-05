import { useEffect, useMemo, useState } from "react";

import Button from "./Button";

import { urlServer } from "../utils/constants";
import { User, Driver } from "../types/types";

import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";

type Session = User & Driver;

const Navbar = () => {
  const [pendingDocuments, setPendingDocuments] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get(`${urlServer}/drivers`).then((res) => {
      setPendingDocuments(res?.data?.filter((d: Driver) => d.DOCUMENTS && !d.VERIFIED_DOCUMENTS)?.length);
    });
  }, [localStorage.getItem("user")]);

  const user: Session = useMemo(() => {
    const userLocal = localStorage.getItem("user");
    if (!userLocal) {
      navigate("/login");
      return null;
    } else {
      return JSON.parse(userLocal);
    }
  }, [localStorage.getItem("user")]);

  const handleClick = (path: string) => navigate(path);

  const handleCloseSession = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  console.log(user);

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
              <Button text="Carros" type="button" width="w-32" />
              <div className="w-40 relative">
                <Button text="Conductores" type="button" width="w-full" handleClick={() => navigate("/driver-documents")} />
                <span className="cursor-pointer absolute -top-1 -right-1 bg-red-600 rounded-full w-5 h-5 flex justify-center items-center text-white text-sm font-bold">{pendingDocuments}</span>
              </div>
            </>
          )}
          <Button handleClick={handleCloseSession} text="Cerrar sesión" type="button" width="w-32" />
        </div>
      </div>
    )
  );
};

export default Navbar;
