"use client"; // Mark this file as a client component

import React from 'react';
import { useRouter } from 'next/navigation';

// Sample data for cards
const cardData = [
  {
    title: "Events",
    image: "/image4.webp",
    route: "/home-page/events" // Static route for Events
  },
  {
    title: "Promos",
    image: "/image3.jpg",
    route: "/home-page/promos" // Static route for Promos
  },
  {
    title: "Activities",
    image: "/image1.jpeg",
    route: "/home-page/activities" // Static route for Activities
  },
  {
    title: "Aboitiz Pitch",
    image: "/image2.jpg",
    route: "/home-page/aboitiz-pitch" // Static route for Aboitiz Pitch
  },
];

const Guide = () => {
  const router = useRouter();

  // Function to handle card click and navigate to the specific static page
  const handleCardClick = (route: string) => {
    router.push(route); // Navigate to the static route
  };

  return (
    <section className="flexCenter flex-col">
      <div className="padding-container max-container w-full pb-24">
        <p className="uppercase regular-18 -mt-1 mb-3 text-red-700">
          We are here for you
        </p>
        <div className="flex flex-wrap justify-between gap-5 lg:gap-10">
          <h2 className="bold-40 lg:bold-64 xl:max-w-[390px]">Guide You to Easy Path</h2>
          <p className="regular-16 text-gray-30 xl:max-w-[520px]">
          Explore the vibrant world of the Outlets at Lipa with ease and convenience. Outletsventure is your go-to platform for discovering the best shopping, dining, and services the mall has to offer. Whether you're planning your visit, finding your favorite stores, or navigating through 2D and 360 maps, we've got you covered.
          </p>
        </div>
      </div>

      {/* Responsive grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 max-container w-full pl-5 pr-5"> 
        {cardData.map((card, index) => (
          <div 
            key={index} 
            className="relative h-[350px] shadow-md bg-white rounded-tl-[5px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[5px] cursor-pointer"
            onClick={() => handleCardClick(card.route)} // Navigate to the specific static route
          >
            <div
              className="h-full w-full bg-cover bg-center rounded-tl-[5px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[5px]"
              style={{ backgroundImage: `url(${card.image})` }}>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-tl-[5px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[5px]">
              <div className="bg-red-800 py-2 px-4 w-full text-center relative" style={{ top: '-50px' }}>
                <h3 className="text-white bold-30">{card.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Guide;
