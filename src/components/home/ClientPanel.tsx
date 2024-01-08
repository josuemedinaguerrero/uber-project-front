import { useEffect, useMemo, useState } from "react";

import getTravelTime from "../../utils/getTravelTime";
import Button from "../Button";
import CustomCarousel from "../CustomCarousel";
import animationMap from "../../assets/map.json";

import { urlServer } from "../../utils/constants";
import { Driver, User } from "../../types/types";

import { Marker, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import Lottie from "lottie-react";
import axios from "axios";
import moment from "moment";

type Session = User & Driver;

interface UserLocationTypes {
  startLocation: [number, number] | null;
  endLocation: [number, number] | null;
  startLocationMarked?: boolean;
  endLocationMarked?: boolean;
}

const ClientPanel = () => {
  const [userLocation, setUserLocation] = useState<UserLocationTypes>({ startLocation: null, endLocation: null, endLocationMarked: false, startLocationMarked: false });
  const [routes, setRoutes] = useState([]);

  const navigate = useNavigate();
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
    axios.get(`${urlServer}/routes/${user?.CEDULE}`).then((res) => {
      res.data?.error && toast.error(res.data?.message);

      // const dateFormat = res.data?.data;
      const dateFormat = res.data?.data?.filter((info: any) => new Date(info?.TIME_LIMIT) >= new Date(Date.now()));

      setRoutes(dateFormat);
    });
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation((prev) => ({ ...prev, startLocation: [position.coords.latitude, position.coords.longitude], endLocation: null }));
    });
  }, []);

  useEffect(() => {
    axios
      .get(`${urlServer}/security-alerts`)
      .then((res) => toast.success(res.data?.[Math.floor(Math.random() * res.data?.length)]?.ALERT_DESCRIPTION, { duration: 8000 }))
      .catch(() => toast.error("Hubo un error al obtener las alertas de seguridad."));
  }, []);

  const HandleMapClick = () => {
    useMapEvents({
      click(e) {
        setUserLocation((prev) => ({
          ...prev,
          [!userLocation.startLocationMarked ? "startLocation" : "endLocation"]: [e.latlng.lat, e.latlng.lng],
          [!userLocation.startLocationMarked ? "startLocationMarked" : "endLocationMarked"]: true,
        }));
      },
    });
    return null;
  };

  const handleClickGetRoute = async () => {
    if (!userLocation.endLocation) {
      toast.error("Debe seleccionar una ubicación de destino");
      return;
    }

    const getTime = getTravelTime(userLocation.startLocation![0], userLocation.startLocation![1], userLocation.endLocation[0], userLocation.endLocation[1]);

    if (getTime.error) {
      toast.error(getTime.message, { duration: 8000 });
      return;
    }

    const timeDriver = Number((Math.random() * ((getTime.timeM || 0) / 2 - 0.3) + 0.3).toFixed(2));

    const date = moment(new Date())
      .add(timeDriver + (getTime.timeM || 0), "minutes")
      .toDate();

    try {
      const formData = new FormData();
      formData.append("start_latitude", userLocation?.startLocation?.[0]?.toString() || "");
      formData.append("start_longitude", userLocation?.startLocation?.[1]?.toString() || "");
      formData.append("end_latitude", userLocation?.endLocation?.[0]?.toString() || "");
      formData.append("end_longitude", userLocation?.endLocation?.[1]?.toString() || "");
      formData.append("time", date.toISOString());
      formData.append("cedule", user?.CEDULE);

      const res = await axios.post(`${urlServer}/create-route`, formData);
      if (res.data?.error) throw new Error(res.data?.message);

      localStorage.removeItem("comment");

      toast.success(`Su destino tiene una distancia de ${getTime.distanceKm}Km con un tiempo aproximado de ${getTime.timeM} minutos`, { duration: 8000 });
      navigate(`/route/${res.data?.data?.ID_ROUTE}`, { state: { time: timeDriver, resCreateRoute: { ...res.data?.data, TIME_LIMIT: date } } });
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleClickRoute = (route: any) => {
    navigate(`/route/${route?.ID_ROUTE}`, { state: { resCreateRoute: route } });
  };

  return (
    <>
      {routes?.length > 0 ? (
        <div>
          <h2>Estimado cliente, antes de poder solicitar una nueva ruta, por favor, las demás deben completarse o cancelarse.</h2>
          <h3>Rutas pendientes:</h3>
          <div className="w-full flex flex-col gap-3 mt-5">
            {routes.map((route: any) => (
              <ul key={route?.ID_ROUTE} onClick={() => handleClickRoute(route)} className="w-full cursor-pointer hover:bg-gray-100 p-4 rounded-lg">
                {[
                  { label: "Id", value: route?.ID_ROUTE },
                  { label: "Color del vehículo", value: route?.COLOR },
                  { label: "Cédula del conductor", value: route?.CEDULE },
                  { label: "Nombres del conductor", value: route?.NAMES + " " + route?.SURNAMES },
                  { label: "TIEMPO CULMINACIÓN CALCULADO", value: moment(route?.TIME_LIMIT).format("DD/MM/YYYY - HH:ss") },
                ].map(({ label, value }, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{label}:</span> {value}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ) : (
        userLocation?.startLocation && (
          <div className="w-full flex flex-col items-center gap-10 relative">
            <h3>Seleccione su ubicación de {!userLocation.startLocationMarked ? "partida" : "llegada"}:</h3>
            <div className="w-[90%] h-[350px] md:h-[400px] max-w-[900px] relative">
              <div className="absolute -top-16 -right-16 w-32">
                <Lottie animationData={animationMap} />
              </div>
              <MapContainer center={userLocation.startLocation} zoom={16} scrollWheelZoom={false} style={{ width: "100%", height: "100%" }}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <HandleMapClick />
                <Marker position={userLocation.startLocation} />
                <Marker position={userLocation.endLocation || userLocation.startLocation} />
              </MapContainer>
            </div>
            <Button text="Solicitar ruta" handleClick={handleClickGetRoute} type="button" />

            <CustomCarousel />
          </div>
        )
      )}
    </>
  );
};

export default ClientPanel;
