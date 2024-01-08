import { useEffect, useState } from "react";

import { urlServer } from "../utils/constants";

import { Carousel } from "react-responsive-carousel";

import axios from "axios";
import toast from "react-hot-toast";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./styles.css";

const images = ["image1.jpg", "image2.jpg", "image1.jpg", "image2.jpg", "image1.jpg", "image2.jpg"];

const CustomCarousel = () => {
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentIndex]);

  useEffect(() => {
    axios
      .get(`${urlServer}/featured-destinations`)
      .then((res) => setFeaturedDestinations(res.data))
      .catch(() => toast.error("Hubo un error al obtener los destinos destacados"));
  }, []);

  const handleClickFeaturedDestination = (destionation: any) => {
    console.log({ destionation });
  };

  return (
    <section className="flex flex-col items-center justify-center gap-5">
      <h2>Destinos destacados que podrías visitar:</h2>
      <Carousel showArrows={false} showStatus={false} showThumbs={false} infiniteLoop={true} selectedItem={currentIndex}>
        {featuredDestinations?.map((destination: any, idx) => (
          <div className="w-full cursor-pointer" onClick={() => handleClickFeaturedDestination(destination)} key={idx}>
            <h3 className="font-semibold text-xl">{destination?.TITLE}</h3>
            <h4>{destination?.DESCRIPTION}</h4>
            <img src={`${urlServer}/featured-destinations/image/${destination?.PATH_IMAGE}`} alt="Imagen 1" className="h-60 max-w-xl object-cover object-center mb-14" />
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default CustomCarousel;
