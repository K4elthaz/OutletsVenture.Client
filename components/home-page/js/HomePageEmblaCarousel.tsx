"use client";
import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import { DotButton, useDotButton } from "./HomePageEmblaCarouselDotButton";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./HomePageEmblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";
import { PhotoData } from "@/utils/Types";

// type SlideType = {
//   src: string;
//   alt: string;
// };

type PropType = {
  slides: PhotoData[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = ({ slides, options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
<section id="homepage" className="embla relative w-full mx-auto">
  {/* Previous Button */}
  <PrevButton
    onClick={onPrevButtonClick}
    disabled={prevBtnDisabled}
    className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 sm:p-3 hover:bg-gray-200 transition"
  />

  {/* Embla Viewport */}
  <div
    className="embla__viewport w-full h-[250px] sm:h-[400px] md:h-[300px] mx-auto relative"
    ref={emblaRef}
  >
    <div className="embla__container flex gap-x-2">
      {slides.map((slide, index) => (
        <div
          className="embla__slide flex-[0_0_100%] max-w-full relative"
          key={index}
        >
          <div className="embla__slide__inner w-full">
            <img
              src={slide.url}
              alt={slide.name}
              className="embla__slide__img w-full h-full object-contain"
            />
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Next Button */}
  <NextButton
    onClick={onNextButtonClick}
    disabled={nextBtnDisabled}
    className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 sm:p-3 hover:bg-gray-200 transition"
  />

  {/* Dots Navigation */}
  <div className="embla__dots flex justify-center mt-4 space-x-2">
    {scrollSnaps.map((_, index) => (
      <DotButton
        key={index}
        onClick={() => onDotButtonClick(index)}
        className={"embla__dot".concat(
          index === selectedIndex ? " embla__dot--selected" : ""
        )}
      />
    ))}
  </div>
</section>


  );
};

export default EmblaCarousel;
