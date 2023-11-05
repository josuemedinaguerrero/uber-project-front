import { useMemo } from "react";

import DriverPanel from "../components/home/DriverPanel";
import ClientPanel from "../components/home/ClientPanel";

import { Driver, Roles } from "../types/types";

import "leaflet/dist/leaflet.css";

const Home = () => {
  const user: Roles = useMemo(() => JSON.parse(localStorage.getItem("user") || ""), [localStorage.getItem("user")]);

  switch (user.ROL) {
    case "CLIENT":
      return <ClientPanel />;
    case "DRIVER":
      return <DriverPanel user={user as Driver} />;

    default:
      break;
  }
};

export default Home;
