import { useEffect, useState } from "react";

import getTravelTime from "../../utils/getTravelTime";
import Button from "../Button";
import CustomCarousel from "../CustomCarousel";
import animationMap from "../../assets/map.json";

import { Marker, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import Lottie from "lottie-react";

interface UserLocationTypes {
  startLocation: [number, number] | null;
  endLocation: [number, number] | null;
  startLocationMarked?: boolean;
  endLocationMarked?: boolean;
}

const ClientPanel = () => {
  const [userLocation, setUserLocation] = useState<UserLocationTypes>({ startLocation: null, endLocation: null, endLocationMarked: false, startLocationMarked: false });

  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation((prev) => ({ ...prev, startLocation: [position.coords.latitude, position.coords.longitude], endLocation: null }));
    });
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

    const timeDriver = (1 + Math.random() * ((getTime.timeM ?? 0) / 2)).toFixed(2);

    toast.success(`Su destino tiene una distancia de ${getTime.distanceKm}Km con un tiempo aproximado de ${getTime.timeM} minutos`, { duration: 8000 });
    navigate("/create-route", { state: { time: timeDriver } });
  };

  return (
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
  );
};

export default ClientPanel;
