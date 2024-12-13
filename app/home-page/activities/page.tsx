"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { db } from "@/utils/firebase"; // Adjust the path based on your project structure
import { ref as dbRef, onValue } from "firebase/database";
import { ActivityData } from "@/utils/Types"; // Assuming you have this type defined
import { ActivityRef } from "@/utils/References";

// Dynamic array for the page title and background image
const pageTitleData = {
  title: "Leisure & Activities",
  backgroundImage: "/img_great_deals.png", // Dynamic image URL for the background
};

export default function ActivitiesCards() {
  const [activities, setActivities] = useState<ActivityData[]>([]); // State to hold activities from Firebase
  const router = useRouter(); // Initialize the router

  // Fetch activities data from Firebase
  useEffect(() => {
    const fetchActivities = () => {
      const activitiesRef = dbRef(db, ActivityRef); // Adjust the Firebase reference to match your structure

      onValue(activitiesRef, (snapshot) => {
        const data = snapshot.val();
        const activitiesArray: ActivityData[] = [];

        if (data) {
          for (const id in data) {
            if (data.hasOwnProperty(id)) {
              activitiesArray.push({
                ...data[id],
                id: Number(id), // Ensure the ID is a number
              });
            }
          }
        }

        setActivities(
          activitiesArray?.filter(
            (activity: any) => activity.id && activity.title
          )
        ); // Update the state with the fetched data
      });
    };

    fetchActivities();
  }, []);

  // Function to handle card click
  const handleCardClick = (id: number) => {
    router.push(`activities/${id}`); // Navigate to /activities/[id]
  };

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
          src={pageTitleData.backgroundImage} // Dynamic header background image
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
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            onClick={() => handleCardClick(activity.id)} // Call handleCardClick on click
            className={`relative bg-white shadow-lg rounded-lg overflow-hidden flex flex-col sm:flex-row mb-8 max-w-screen-lg mx-auto cursor-pointer ${
              index % 2 === 1 ? "sm:flex-row-reverse" : ""
            }`}
            style={{ height: "300px" }} // Adjusted height of the cards
          >
            {/* Image section - 35% width and alternates between left and right */}
            <div className="relative w-full sm:w-[35%] h-full">
              <Image
                src={activity.photo} // Dynamic photo from Firebase
                alt={activity.title}
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
              />
            </div>

            {/* Text Section */}
            <div className="p-6 sm:w-[65%] flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {activity.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
