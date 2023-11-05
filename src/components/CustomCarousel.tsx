import { useEffect, useState } from "react";

import { Carousel } from "react-responsive-carousel";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./styles.css";

const images = ["image1.jpg", "image2.jpg", "image1.jpg", "image2.jpg", "image1.jpg", "image2.jpg"];

const CustomCarousel = () => {
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

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <h2>Destinos destacados que podrías visitar</h2>
      <Carousel showArrows={false} showStatus={false} showThumbs={false} infiniteLoop={true} selectedItem={currentIndex}>
        {images.map((img, idx) => (
          <div className="w-full" key={idx}>
            <img src={`./images/${img}`} alt="Imagen 1" className="h-60 max-w-xl object-cover object-center mb-14" />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CustomCarousel;
