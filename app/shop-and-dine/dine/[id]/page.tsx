"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Import MUI back arrow icon
import PhoneIcon from "@mui/icons-material/Phone"; // Import phone icon
import EmailIcon from "@mui/icons-material/Email"; // Import email icon
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Import icon for opening hours
import { DineData } from "@/utils/Types";
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "@/utils/firebase";
import { cloudPano, dinesReference } from "@/utils/References";
import Loading from "@/components/loading/Loading";

const dineDetails = () => {
  const [dine, setDine] = useState<DineData | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const shopRef = dbRef(db, `${dinesReference}/${id}`);

    const unsubscribe = onValue(shopRef, (snapshot) => {
      if (snapshot.exists()) {
        const childData = snapshot.val();

        const shop: DineData = {
          id: childData.id,
          title: childData.title,
          description: childData.description
            ? childData.description
            : "Lorem Epsum Dolor Sit Amet",
          photo: childData.photo,
          openingHour: childData.openingHour ? childData.openingHour : "N/A",
          location: childData.location ? childData.location : "Outlets",
          contactInformation: childData.contactInformation
            ? childData.contactInformation
            : "N/A",
          email: childData.email ? childData.email : "N/A",
          closingHour: childData.closingHours ? childData.closingHours : "N/A",
          searchs: childData.searchs,
          clicks: childData.clicks,
          cloudPanoSceneID: childData.cloudPanoSceneID
            ? childData.cloudPanoSceneID
            : "",
        };

        setDine(shop);
      }
      setPageLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (pageLoading) {
    return <Loading />;
  }

  if (!dine) {
    notFound();
  }

  return (
    <div
      className="w-full min-h-64 mb-5"
      style={{
        backgroundImage: 'url("/img_background_pattern.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f0f0f0", // Fallback color
      }}
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-0 max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center lg:text-left lg:w-full mt-4 mb-4 lg:mb-0">
          <h1 className="text-5xl lg:text-8xl font-extrabold text-red-800 mb-2 mt-6">
            Outlets Lipa Diners {/* Title for diners */}
          </h1>
          <p className="text-xl text-gray-600">
            Discover amazing deals and exclusive offers!
          </p>
          <div className="w-64 h-1 bg-red-800 mt-4 mx-auto lg:mx-0"></div>
        </div>
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <img
            src="/img_cartoon_deals.png"
            alt="Deals Illustration"
            className="w-64 lg:w-80"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full min-h-64 py-8">
        {/* Content Width Adjusted to max-w-screen-xl */}
        <div
          className="max-w-screen-xl mx-auto bg-white rounded-lg overflow-hidden"
          style={{
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)", // Custom shadow with more intensity
          }}
        >
          {/* Main Content Container */}
          <div className="lg:flex">
            {/* Image Section */}
            <div className="lg:w-1/2">
              <img
                src={dine.photo}
                alt={dine.title}
                className="object-cover w-full h-full rounded-l-lg"
              />
            </div>

            {/* Text Section */}
            <div className="p-6 lg:w-1/2 flex flex-col justify-between">
              {/* dine Name */}
              <div className="mb-4">
                <h1 className="text-4xl font-extrabold text-gray-900">
                  {dine.title}
                </h1>
              </div>

              {/* Opening Hours */}
              <div className="flex items-center text-gray-600 mt-2">
                <AccessTimeIcon className="text-red-800 mr-2" />{" "}
                {/* Time Icon */}
                <span>{dine.openingHour}</span>
              </div>

              {/* Closing Hours */}
              <div className="flex items-center text-gray-600 mt-2">
                <AccessTimeIcon className="text-red-800 mr-2" />{" "}
                {/* Time Icon */}
                <span>{dine.closingHour}</span>
              </div>

              {/* Email */}
              <div className="flex items-center text-gray-600 mt-4">
                <EmailIcon className="text-red-800 mr-2" /> {/* Email Icon */}
                <span>{dine.email}</span>
              </div>

              {/* Contact */}
              <div className="flex items-center text-gray-600 mt-2">
                <PhoneIcon className="text-red-800 mr-2" /> {/* Phone Icon */}
                <span>{dine.contactInformation}</span>
              </div>

              {/* dine Description */}
              <div className="mb-4 mt-4">
                <p className="text-gray-600 mt-2">{dine.description}</p>
              </div>

              {/* Buttons Section */}
              <div className="mt-auto flex flex-col space-y-4 items-end w-full">
                {/* View 360 Virtual Tour Button */}
                <a
                  onClick={() =>
                    router.push(
                      `/mall-map/360?sceneId=${dine.cloudPanoSceneID}`
                    )
                  }
                  className="w-full border border-red-700 text-red-700 py-3 px-8 rounded-full text-center font-semibold transition-all duration-300 hover:bg-red-700 hover:text-white"
                >
                  View 360 Virtual Tour
                </a>

                {/* Back Button */}
                <button
                  className="w-full bg-gradient-to-r from-red-500 to-red-800 text-white py-3 px-8 rounded-full flex items-center justify-center hover:from-red-600 hover:to-red-900 transition"
                  onClick={() => router.back()} // Back to previous page
                >
                  <ArrowBackIcon className="mr-2" /> {/* Back icon */}
                  Back to Dines
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dineDetails;
