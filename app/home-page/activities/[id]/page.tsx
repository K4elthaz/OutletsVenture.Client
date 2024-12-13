"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation"; // Import useRouter for getting the [id]
import { db } from "@/utils/firebase"; // Adjust the path based on your project structure
import { ref as dbRef, onValue } from "firebase/database";
import { ActivityData, ActivitySubData } from "@/utils/Types"; // Assuming you have these types defined
import { ActivityRef } from "@/utils/References"; // Firebase reference

export default function ActivityDetails() {
  const [activity, setActivity] = useState<ActivityData | null>(null); // State to hold the ActivityData from Firebase
  const { id } = useParams();

  // Fetch ActivityData based on [id]
  useEffect(() => {
    if (!id) return; // Wait until id is available

    const fetchActivityData = () => {
      const activityRef = dbRef(db, `${ActivityRef}/${id}`); // Use the dynamic id to get the specific ActivityData

      onValue(activityRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const subData = data?.subData ? Object.values(data.subData) : [];
          setActivity({
            ...data,
            id: Number(id), // Ensure the ID is a number
            subData,
          });
        }
      });
    };

    fetchActivityData();
  }, [id]);

  if (!activity) {
    return <div>Loading...</div>; // Loading state
  }

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
          src={activity.photo} // Dynamic header background image
          alt={activity.title}
          layout="fill"
          objectFit="cover"
        />
        {/* Centered Title Bar */}
        <div className="absolute inset-x-0 bottom-[-30px] flex justify-center z-10">
          <div className="p-3 sm:p-4 bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center max-w-2xl w-full space-x-3 sm:space-x-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
              {activity.title}
            </h1>
          </div>
        </div>
      </div>

      {/* SubData Cards Section */}
      <div className="container mx-auto px-5 py-12 mt-5">
        {activity.subData?.map((subData: ActivitySubData, index: number) => (
          <div
            key={subData.id}
            className={`relative bg-white shadow-lg rounded-lg overflow-hidden flex flex-col sm:flex-row mb-8 max-w-screen-lg mx-auto ${
              index % 2 === 1 ? "sm:flex-row-reverse" : ""
            }`}
            style={{ height: "300px" }} // Adjusted height of the cards
          >
            {/* Image section - 35% width and alternates between left and right */}
            <div className="relative w-full sm:w-[35%] h-full">
              <Image
                src={subData.photo} // Dynamic photo from subData
                alt={subData.title}
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
              />
            </div>

            {/* Text Section */}
            <div className="p-6 sm:w-[65%] flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {subData.title}
              </h3>
              <p className="text-gray-700">{subData.essay}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
