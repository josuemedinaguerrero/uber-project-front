import { useEffect, useState } from "react";

import { urlServer } from "../../utils/constants";

import toast from "react-hot-toast";
import axios from "axios";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${urlServer}/users`)
      .then((res) => setUsers(res.data || []))
      .catch(() => toast.error("Hubo un error al obtener los usuarios."));
  }, []);

  return (
    <div className="w-full text-center">
      <h1 className="font-bold my-5 text-2xl">Usuarios</h1>
      <div className="w-full">
        <div className="w-full flex cursor-pointer p-2 font-semibold">
          <div className="w-[15%]">No.</div>
          <div className="w-[25%]">Cédula</div>
          <div className="w-[25%]">Nombre de usuario</div>
          <div className="w-[35%]">Correo electrónico</div>
        </div>

        {users?.map((user: any, idx: number) => (
          <div key={user?.CEDULE} className="w-full p-2 flex">
            <div className="w-[15%]">{idx + 1}</div>
            <div className="w-[25%]">{user?.CEDULE}</div>
            <div className="w-[25%]">{user?.USERNAME}</div>
            <div className="w-[35%]">{user?.EMAIL}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
