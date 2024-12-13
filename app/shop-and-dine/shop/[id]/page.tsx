"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Import icon for opening hours
import { ShopData } from "@/utils/Types";
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "@/utils/firebase";
import { cloudPano, shopsReference } from "@/utils/References";
import Loading from "@/components/loading/Loading";

const ShopDetails = () => {
  const [shop, setShop] = useState<ShopData>();
  const [pageLoading, setPageLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const shopRef = dbRef(db, `${shopsReference}/${id}`);

    const unsubscribe = onValue(shopRef, (snapshot) => {
      if (snapshot.exists()) {
        const shopData = snapshot.val();

        const shop: ShopData = {
          id: shopData.id,
          title: shopData.title,
          description: shopData.description
            ? shopData.description
            : "Lorem Epsum Dolor Sit Amet",
          photo: shopData.photo,
          openingHour: shopData.openingHour ? shopData.openingHour : "N/A",
          location: shopData.location ? shopData.location : "Outlets",
          contactInformation: shopData.contactInformation
            ? shopData.contactInformation
            : "N/A",
          email: shopData.email ? shopData.email : "N/A",
          closingHour: shopData.closingHours ? shopData.closingHours : "N/A",
          searchs: shopData.searchs,
          clicks: shopData.clicks,
          cloudPanoSceneID: shopData.cloudPanoSceneID
            ? shopData.cloudPanoSceneID
            : "",
        };

        setShop(shop);
      }
      setPageLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (pageLoading) {
    return <Loading />;
  }

  if (!shop) {
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
            Outlets Lipa Shops {/* Title from the image */}
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
                src={shop.photo}
                alt={shop.title}
                className="object-cover w-full h-full rounded-l-lg"
              />
            </div>

            {/* Text Section */}
            <div className="p-6 lg:w-1/2 flex flex-col justify-between">
              {/* shop Name */}
              <div className="mb-4">
                <h1 className="text-4xl font-extrabold text-gray-900">
                  {shop.title}
                </h1>
                {/* shop Description */}
                <p className="text-gray-600 mt-2 text-justify">
                  {shop.description}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {/* Opening Hours */}
                <div className="flex items-center text-gray-600 ">
                  <AccessTimeIcon className="text-red-800 mr-2" />{" "}
                  {/* Time Icon */}
                  <span>{shop.openingHour}</span>
                </div>

                {/* Closing Hours */}
                <div className="flex items-center text-gray-600 ">
                  <AccessTimeIcon className="text-red-800 mr-2" />{" "}
                  {/* Time Icon */}
                  <span>{shop.closingHour}</span>
                </div>

                {/* Email */}
                <div className="flex items-center text-gray-600">
                  <EmailIcon className="text-red-800 mr-2" /> {/* Email Icon */}
                  <span>{shop.email}</span>
                </div>

                {/* Contact */}
                <div className="flex items-center text-gray-600 ">
                  <PhoneIcon className="text-red-800 mr-2" /> {/* Phone Icon */}
                  <span>{shop.contactInformation}</span>
                </div>
              </div>

              {/* Buttons Section */}
              <div className="mt-auto flex flex-col space-y-4 items-end w-full">
                {/* View 360 Virtual Tour Button */}
                <a
                  onClick={() =>
                    router.push(
                      `/mall-map/360?sceneId=${shop.cloudPanoSceneID}`
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
                  Back to Shops
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
