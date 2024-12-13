"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { AboitizPitchData } from "@/utils/Types";
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "@/utils/firebase";
import Loading from "../loading/Loading";
import { AboitizPitchRef } from "@/utils/References";

// const aboitizPitchData = {
//   title: "Aboitiz Pitch",
//   description:
//     "Ready to host the country's major soccer tournaments, The Outlets at Lipa proudly features the Aboitiz Pitch, a state-of-the-art synthetic-grass football facility nestled within its vibrant complex.",
//   headerImage: "/image1.jpeg",
//   buttonText: "Read More",
//   id: "aboitiz-pitch",
// };

const AboitizPitchPage = () => {
  const [aboitizPitchData, setAboitizPitchData] = useState<AboitizPitchData>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const aboitizPitchRef = dbRef(db, AboitizPitchRef);
    const unsubscribe = onValue(aboitizPitchRef, (snapshot) => {
      if (snapshot.exists()) {
        const aboitizPitchData = snapshot.val();
        setAboitizPitchData(aboitizPitchData);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) return <Loading />;
  if (!aboitizPitchData) notFound();

  const handleReadMoreClick = () => {
    router.push(`/aboitiz-pitch/details`);
  };

  return (
    <section
      className="w-full"
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
          src="/img_great_deals.png"
          alt="Tourist Page"
          fill
          className="object-cover"
        />
        {/* Centered Title */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-bold text-white bg-opacity-70 px-8 py-4 rounded-md">
            Tourist Page
          </h2>
        </div>
      </div>

      {/* Content Section - Single Card */}
      <div className="container mx-auto py-12 px-4">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center max-w-5xl mx-auto">
          {/* Left section - Description */}
          <div className="flex-1 p-4">
            <h3 className="text-2xl font-bold mb-4">
              {aboitizPitchData.title}
            </h3>
            <p className="text-gray-700 mb-4">{aboitizPitchData.description}</p>
            <button
              onClick={handleReadMoreClick}
              className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-2 rounded-full shadow-lg hover:from-red-600 hover:to-red-800 transition duration-300"
            >
              Read More
            </button>
          </div>

          {/* Right section - Image without padding */}
          <div className="flex-1">
            <Image
              src={aboitizPitchData.photo}
              alt={aboitizPitchData.title}
              width={600}
              height={400}
              className="rounded-lg shadow-md object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboitizPitchPage;
