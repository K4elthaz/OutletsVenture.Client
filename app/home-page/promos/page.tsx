"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { PromoData } from "@/utils/Types";
import { promosReference } from "@/utils/References";
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "@/utils/firebase";
import Loading from "@/components/loading/Loading";

// Utility function to create a URL-friendly string from the title
const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/\s+/g, "-");
};

// Sample promo data for the slider
// const promoData = [
//   {
//     id: 1,
//     image: "/img_promo_1.jpg", // Replace with actual image path
//     title: "Anniversary Sale",
//     description: "Get 44% Off on All Items",
//     headerImage: "/img_promo_header_1.jpg", // Replace with the image for the header
//   },
//   {
//     id: 2,
//     image: "/img_promo_2.jpg", // Replace with actual image path
//     title: "Mid-Year Clearance",
//     description: "Up to 70% Off",
//     headerImage: "/img_promo_header_2.jpg", // Replace with the image for the header
//   },
//   {
//     id: 3,
//     image: "/img_promo_3.jpg", // Replace with actual image path
//     title: "Black Friday",
//     description: "Buy 1 Get 1 Free",
//     headerImage: "/img_promo_header_3.jpg", // Replace with the image for the header
//   },
// ];

const PromosPage = () => {
  const [promos, setPromos] = useState<PromoData[]>([]);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [currentPromo, setCurrentPromo] = useState<PromoData>(
    promos[currentPromoIndex]
  );
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const eventsRef = dbRef(db, promosReference);

    const unsubscribe = onValue(eventsRef, (snapshot) => {
      if (snapshot.exists()) {
        const promoList: PromoData[] = [];

        snapshot.forEach((childSnapshot) => {
          const promoData = childSnapshot.val();

          const promo: PromoData = {
            id: promoData.id,
            title: promoData.title,
            description: promoData.description,
            location: promoData.location,
            contactInformation: promoData.contactInformation,
            email: promoData.email,
            startDate: promoData.startDate,
            endDate: promoData.endDate,
            photo: promoData.photo,
            clicks: promoData.clicks,
            featured: promoData.featured,
          };
          if (promo.featured) promoList.push(promo);
        });

        setPromos(promoList);
        setCurrentPromo(promoList[currentPromoIndex]);
      }
      setPageLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Handles the navigation of the slider
  const goToNextPromo = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent the card's click event from firing
    setCurrentPromoIndex((prevIndex) =>
      prevIndex === promos.length - 1 ? 0 : prevIndex + 1
    );
    setCurrentPromo(promos[currentPromoIndex]);
  };

  const goToPrevPromo = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent the card's click event from firing
    setCurrentPromoIndex((prevIndex) =>
      prevIndex === 0 ? promos.length - 1 : prevIndex - 1
    );
    setCurrentPromo(promos[currentPromoIndex]);
  };

  const handlePromoClick = () => {
    router.push(`/promos-and-events/great-deals/${currentPromo.id}`);
  };

  if (pageLoading) {
    return <Loading />;
  }

  if (promos.length === 0) {
    notFound();
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
          alt="Featured Promo"
          fill
          objectFit="cover"
        />
        {/* Centered text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-bold text-white bg-opacity-70 px-8 py-4 rounded-md">
            FEATURED PROMOS
          </h2>
        </div>
      </div>

      {/* Promo Slider Section */}
      <div className="container mx-auto py-12 flex justify-center items-center relative">
        {/* Promo Image and Content */}
        <div
          className="relative w-full max-w-2xl h-[400px] flex items-center justify-center bg-white rounded-lg shadow-xl overflow-hidden cursor-pointer"
          onClick={handlePromoClick} // Handle click on promo
        >
          {/* Previous Arrow */}
          <button
            onClick={goToPrevPromo}
            className="absolute left-4 lg:left-6 bg-white hover:bg-red-700 text-gray-800 hover:text-white rounded-full shadow-lg z-10 transition duration-300 ease-in-out transform top-1/2 -translate-y-1/2 flex items-center justify-center"
            type="button"
            style={{ width: "50px", height: "50px" }} // Perfect circle
          >
            <span className="text-2xl">&#8249;</span> {/* Left arrow icon */}
          </button>

          <Image
            src={currentPromo.photo}
            alt={currentPromo.title}
            fill
            objectFit="cover"
            className="rounded-lg transition-transform duration-300 ease-in-out"
          />

          {/* Featured Promo Tag */}
          <div className="absolute top-5 left-5 bg-red-700 text-white px-4 py-2 rounded-md shadow-lg">
            <h2 className="text-md font-bold">Featured Promo</h2>
          </div>

          {/* Promo Details Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-transparent p-6">
            <h3 className="text-2xl font-bold text-white">
              {currentPromo.title}
            </h3>
            <p className="text-white mt-1">{currentPromo.description}</p>
          </div>

          {/* Next Arrow */}
          <button
            onClick={goToNextPromo}
            className="absolute right-4 lg:right-6 bg-white hover:bg-red-700 text-gray-800 hover:text-white rounded-full shadow-lg z-10 transition duration-300 ease-in-out transform top-1/2 -translate-y-1/2 flex items-center justify-center"
            type="button"
            style={{ width: "50px", height: "50px" }} // Perfect circle
          >
            <span className="text-2xl">&#8250;</span> {/* Right arrow icon */}
          </button>
        </div>
      </div>

      {/* Slider Navigation Dots */}
      <div className="flex justify-center mb-8">
        {promos.map((_, index) => (
          <span
            key={index}
            className={`h-3 w-3 mx-2 rounded-full ${
              index === currentPromoIndex ? "bg-red-700" : "bg-gray-300"
            } transition duration-300 ease-in-out`}
            onClick={() => setCurrentPromoIndex(index)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default PromosPage;
