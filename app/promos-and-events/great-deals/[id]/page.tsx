"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import dealsData from "@/components/promos-and-events/great-deals/js/dealsData";

// Import MUI icons
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PromoData } from "@/utils/Types";
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "@/utils/firebase";
import { promosReference } from "@/utils/References";
import Loading from "@/components/loading/Loading";

export default function DealDetails() {
  const [promo, setPromo] = useState<PromoData | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const shopRef = dbRef(db, `${promosReference}/${id}`);

    const unsubscribe = onValue(shopRef, (snapshot) => {
      if (snapshot.exists()) {
        const childData = snapshot.val();

        const shop: PromoData = {
          id: childData.id,
          title: childData.title,
          description: childData.description
            ? childData.description
            : "Lorem Epsum Dolor Sit Amet",
          email: childData.email ? childData.email : "N/A",
          contactInformation: childData.contactInformation
            ? childData.contactInformation
            : "N/A",
          photo: childData.photo,
          startDate: childData.startDate,
          endDate: childData.endDate,
          location: childData.location ? childData.location : "Outlets",
          clicks: childData.clicks,
          featured: childData.featured,
        };

        setPromo(shop);
      }
      setPageLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (pageLoading) {
    return <Loading />;
  }

  if (!promo) {
    notFound();
  }

  return (
    <div
      className="w-full min-h-64 mb-8"
      style={{
        backgroundImage: 'url("/img_background_pattern.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f0f0f0", // Fallback color
      }}
    >
      {/* Title and Image Row */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-2 max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center lg:text-left lg:w-full mt-4 mb-4 lg:mb-0">
          <h1 className="text-4xl lg:text-7xl font-extrabold text-red-800 mb-2 mt-6">
            GREAT DEALS & FINDS
          </h1>
          <p className="text-xl text-gray-600">
            Don't miss out on this month's latest offers!
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
                src={promo.photo}
                alt={promo.title}
                className="object-cover w-full h-full rounded-l-lg"
              />
            </div>

            {/* Text Section */}
            <div className="p-6 lg:w-1/2 flex flex-col justify-between">
              {/* Title */}
              <div className="mb-4">
                <h1 className="text-3xl font-extrabold text-gray-900">
                  {promo.title}
                </h1>
                <p className="text-gray-600 mt-2">{promo.description}</p>
              </div>

              {/* Date Section */}
              <div className="flex items-center text-gray-600 mt-4">
                <EventIcon className="text-red-800 mr-2" />
                <span>
                  {new Date(promo.startDate).toLocaleDateString()} to{" "}
                  {new Date(promo.endDate).toLocaleDateString()}{" "}
                  {new Date(promo.endDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <a
                  onClick={() =>
                    router.push(`/promos-and-events/great-deals/calendar`)
                  }
                  className="ml-2 text-red-600"
                >
                  View Calendar
                </a>
              </div>

              {/* Location Section */}
              <div className="flex items-center text-gray-600 mt-4">
                <PlaceIcon className="text-red-800 mr-2" />
                <span>{promo.location}</span>
              </div>

              {/* Contact Section */}
              <div className="flex items-center text-gray-600 mt-4">
                <EmailIcon className="text-red-800 mr-2" />
                <span>{promo.email}</span>
              </div>
              <div className="flex items-center text-gray-600 mt-2">
                <PhoneIcon className="text-red-800 mr-2" />
                <span>{promo.contactInformation}</span>
              </div>

              {/* Back Button aligned right with gradient and back icon */}
              <div className="mt-6 flex justify-end">
                <button
                  className="bg-gradient-to-r from-red-500 to-red-800 text-white py-2 px-6 rounded-full flex items-center hover:from-red-600 hover:to-red-900 transition"
                  onClick={() => router.back()}
                >
                  <ArrowBackIcon className="mr-2" />{" "}
                  {/* Back icon added here */}
                  Back to Deals
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
