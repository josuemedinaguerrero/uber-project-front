const getTravelTime = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  try {
    const radioTierra = 6371; // Radio de la Tierra en kilómetros

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = radioTierra * c;

    const duracionHoras = distancia / 20;
    const duracionMinutos = duracionHoras * 60;

    return { distanceKm: Number(distancia.toFixed(2)), timeH: Number(duracionHoras.toFixed(2)), timeM: Number(duracionMinutos.toFixed(2)) };
  } catch (_) {
    return { error: true, message: "Hubo un error al calcular el tiempo de viaje" };
  }
};

export default getTravelTime;
