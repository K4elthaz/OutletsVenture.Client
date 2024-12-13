"use client";
import React, { useState, useEffect } from "react";
import HomePageEmblaCarousel from "./HomePageSliderEmbla";
import { EmblaOptionsType } from "embla-carousel";
import "../css/base.css";
import "../css/homepage_embla.css";
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "@/utils/firebase";
import { PhotoData } from "@/utils/Types";
import { homePageSlideShow } from "@/utils/References";

const OPTIONS: EmblaOptionsType = { align: "start" };

// const SLIDES = [
//   { src: '/image1.jpeg', alt: 'Slide 1' },
//   { src: '/image2.jpg', alt: 'Slide 2' },
//   { src: '/image3.jpg', alt: 'Slide 3' },
// ];

const CarouselPage: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoData[]>([]);

  useEffect(() => {
    const photosRef = dbRef(db, homePageSlideShow);

    const unsubscribe = onValue(photosRef, (snapshot) => {
      if (snapshot.exists()) {
        const photoList: PhotoData[] = [];

        snapshot.forEach((childSnapshot) => {
          const photoData = childSnapshot.val();

          const photo: PhotoData = {
            url: photoData.url,
            name: photoData.name,
          };

          photoList.push(photo);
        });

        setPhotos(photoList);
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <div id="homepageslider">
      <div>
        <HomePageEmblaCarousel slides={photos} options={OPTIONS} />
      </div>
    </div>
  );
};

export default CarouselPage;
