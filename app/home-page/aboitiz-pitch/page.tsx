"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "@/utils/firebase"; // Adjust the path to your Firebase instance

// Define the type for Aboitiz Pitch Data
export type AboitizPitchData = {
  id: number;
  title: string;
  description: string;
  photo: string; // Main photo (replacing qrCodeImage)
  subData: AboitizPitchSubData[];
};

export type AboitizPitchSubData = {
  qrCodeImage: string;
};

// Aboitiz Pitch Page component
const AboitizPitchPage = () => {
  const [aboitizPitchData, setAboitizPitchData] =
    useState<AboitizPitchData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const aboitizPitchRef = dbRef(db, "AboitizPitch/2");

    // Fetch the data from Firebase (or your API)
    const unsubscribe = onValue(aboitizPitchRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAboitizPitchData(data);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Loading state while fetching
  }

  if (!aboitizPitchData) {
    return <div>No data found.</div>; // Fallback if no data is found
  }

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
      <div className="relative w-full h-[400px]">
        <Image
          src="/img_great_deals.png"
          alt="Featured Event"
          layout="fill"
          objectFit="cover"
        />
        {/* Centered Title */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-bold text-white bg-opacity-70 px-8 py-4 rounded-md">
            {aboitizPitchData.title}
          </h2>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto py-12 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {/* Description Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">{aboitizPitchData.title}</h3>
          <p className="text-gray-700">{aboitizPitchData.description}</p>
        </div>

        {/* QR Code Card */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-center items-center">
          <h3 className="text-xl font-bold mb-4">
            Scan for Reservation/Inquiry
          </h3>
          <Image
            src={aboitizPitchData.photo} // Dynamically load the QR code image
            alt="QR Code for Reservation"
            width={200}
            height={200}
            className="rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default AboitizPitchPage;
