"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AboitizPitchData, AboitizPitchSubData } from "@/utils/Types";
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "@/utils/firebase";
import { AboitizPitchRef } from "@/utils/References";
import Loading from "@/components/loading/Loading";

// const pageTitleData = {
//   title: "Tourist Page",
//   backgroundImage: "/img_great_deals.png",
// };

// // Dynamic array for the Aboitiz Pitch data
// const aboitizPitch = [
//   {
//     id: 1,
//     title: "Field of Rides",
//     description: "Something EGGciting is coming your way this Easter...",
//     image: "/image1.jpeg", // Dummy image URL for the pitch
//   },
//   {
//     id: 2,
//     title: "Playground",
//     description:
//       "Join us for some fun at the playground, perfect for the whole family!",
//     image: "/image2.jpg", // Dummy image URL for the pitch
//   },
//   {
//     id: 3,
//     title: "Dog Park",
//     description:
//       "Join us for a day at the dog park and let your furry friends run free!",
//     image: "/image3.jpg", // Dummy image URL for the pitch
//   },
//   {
//     id: 4,
//     title: "Bike and Running Lane",
//     description: "Enjoy the outdoors at our bike and running lane!",
//     image: "/image5.jpg", // Dummy image URL for the pitch
//   },
// ];

export default function AboitizCards() {
  const [pageTitleData, setPageTitleData] = useState<AboitizPitchData>();
  const [aboitizPitch, setAboitizPitch] = useState<AboitizPitchSubData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const aboitizPitchRef = dbRef(db, AboitizPitchRef);
    const unsubscribe = onValue(aboitizPitchRef, (snapshot) => {
      if (snapshot.exists()) {
        const aboitizPitchData = snapshot.val();
        setPageTitleData(aboitizPitchData);
        if (aboitizPitchData.subData) {
          setAboitizPitch(aboitizPitchData.subData);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) return <Loading />;
  if (!pageTitleData) notFound();

  return (
    <div
      className="w-full min-h-screen"
      style={{
        backgroundImage: 'url("/img_background_pattern.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f0f0f0", // Fallback color
      }}
    >
      {/* Header Section */}
      <div className="relative w-full h-[300px]">
        <Image
          src={pageTitleData.photo}
          alt={pageTitleData.title}
          layout="fill"
          objectFit="cover"
        />
        {/* Centered Title Bar */}
        <div className="absolute inset-x-0 bottom-[-30px] flex justify-center z-10">
          <div className="p-3 sm:p-4 bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center max-w-2xl w-full space-x-3 sm:space-x-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
              {pageTitleData.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="container mx-auto px-5 py-12 mt-5">
        {aboitizPitch.map((pitch, index) => (
          <div
            key={pitch.id}
            className={`relative bg-white shadow-lg rounded-lg overflow-hidden flex flex-col sm:flex-row mb-8 max-w-screen-lg mx-auto ${
              index % 2 === 1 ? "sm:flex-row-reverse" : ""
            }`}
            style={{ height: "300px" }} // Adjusted height of the cards
          >
            {/* Image section - 35% width and alternates between left and right */}
            <div className="relative w-full sm:w-[35%] h-full">
              <Image
                src={pitch.photo}
                alt={pitch.title}
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
              />
            </div>

            {/* Text Section */}
            <div className="p-6 sm:w-[65%] flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {pitch.title}
              </h3>
              <p className="text-gray-700">{pitch.essay}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
