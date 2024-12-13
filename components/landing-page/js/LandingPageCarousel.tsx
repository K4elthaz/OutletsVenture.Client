"use client";
import React, { useState, useEffect } from "react";
import EmblaCarousel from "./EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import "../css/base.css";
import "../css/landingpage_embla.css";
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "@/utils/firebase";
import { PhotoData } from "@/utils/Types";
import { landingPageCarousel1 } from "@/utils/References";

const OPTIONS: EmblaOptionsType = { align: "start" };

// const SLIDES = [{ url: "/image1.jpeg", name: "Slide 1" }];

const CarouselPage: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoData[]>([]);

  useEffect(() => {
    const photosRef = dbRef(db, landingPageCarousel1);

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
    <div
      id="landingpage"
      style={{
        background: "url('/img_navbar.png') no-repeat center center fixed",
        backgroundSize: "cover",
        padding: "10px",
        boxSizing: "border-box",
        height: "auto",
        width: "100%",
      }}
    >
      <EmblaCarousel slides={photos} options={OPTIONS} />
    </div>
  );
};

export default CarouselPage;
