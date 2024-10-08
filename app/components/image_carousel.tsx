import { useState, useEffect } from "react";

interface ImageCarouselProps {
  imgSources: string[];
}

const ImageCarousel = ({ imgSources }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const nextImage = () => {
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === imgSources.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevImage = () => {
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imgSources.length - 1 : prevIndex - 1,
    );
  };

  useEffect(() => {
    // Remove the animation class after the transition completes
    const timeout = setTimeout(() => {
      setIsAnimating(false);
    }, 500); // Match the duration of your CSS transition (300ms here)

    return () => clearTimeout(timeout);
  }, [currentIndex]);

  return (
    <div className="align-center relative flex max-h-[600px] w-full items-center justify-center bg-accent p-2">
      <button
        onClick={prevImage}
        className="mx-2 cursor-pointer select-none rounded border-none bg-secondary px-10 py-0 text-4xl text-neutral focus:outline-none"
      >
        {"<"}
      </button>
      <div
        className={`flex max-h-[220px] w-full max-w-screen-sm justify-center overflow-hidden ${
          isAnimating ? "motion-safe:animate-[bounce_0.5s_linear_1]" : ""
        }`}
      >
        {imgSources[currentIndex] ? (
          <img
            src={imgSources[currentIndex]}
            alt={`carousel-img-${currentIndex}`}
            className="h-auto max-w-full object-cover"
          />
        ) : (
          <div className="flex w-full max-w-screen-sm justify-center">
            <p>{"Resource Unavailable :("}</p>
          </div>
        )}
      </div>
      <p className="absolute bottom-2.5 rounded bg-primary p-2 text-center text-neutral">
        {currentIndex + 1 + "/" + imgSources.length}
      </p>
      <button
        onClick={nextImage}
        className="mx-2 cursor-pointer select-none rounded border-none bg-secondary px-10 py-0 text-4xl text-neutral focus:outline-none"
      >
        {">"}
      </button>
    </div>
  );
};

export default ImageCarousel;
