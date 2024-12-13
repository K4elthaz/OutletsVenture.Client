"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams, notFound } from "next/navigation";

// Import MUI icons
import EventIcon from "@mui/icons-material/Event";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { EventData, GuestData } from "@/utils/Types";
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "@/utils/firebase";
import { eventsReference } from "@/utils/References";
import Loading from "@/components/loading/Loading";

export default function EventDetails() {
  const [event, setEvent] = useState<EventData | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const shopRef = dbRef(db, `${eventsReference}/${id}`);

    const unsubscribe = onValue(shopRef, (snapshot) => {
      if (snapshot.exists()) {
        const childData = snapshot.val();

        const event: EventData = {
          id: childData.id,
          title: childData.title,
          description: childData.description
            ? childData.description
            : "Lorem Ipsum Dolor Sit Amet",
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
          guests: childData.guests ? childData.guests : [], // Get guests data from Firebase
        };

        setEvent(event);
      }
      setPageLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (pageLoading) {
    return <Loading />;
  }

  if (!event || !event.featured) {
    notFound();
  }

  return (
    <div
      className="w-full min-h-64"
      style={{
        backgroundImage: 'url("/img_background_pattern.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f0f0f0", // Fallback color
      }}
    >
      {/* Header with image */}
      <div className="relative w-full h-[400px]">
        <img
          src={event.photo}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content */}
      <div className="w-full min-h-full">
        <div className="max-w-screen-xl mx-auto overflow-hidden p-8">
          {/* Back Button */}
          <div className="flex justify-start mb-8">
            <button
              className="text-gray-800 py-2 px-6 rounded-full flex items-center hover:bg-gray-400 transition"
              onClick={() => router.back()}
            >
              <ArrowBackIcon className="mr-2" /> Return to Featured Events
            </button>
          </div>

          <h1 className="relative text-5xl font-bold text-gray-900 mb-8 text-center after:block after:mx-auto after:h-1 after:w-[30%] after:bg-red-800 after:mt-4">
            {event.title}
          </h1>

          {/* Date and Contact Section (Centered) */}
          <div className="flex flex-col items-center text-center text-gray-600 mb-8 text-lg">
            {/* Date Section */}
            <div className="flex items-center text-gray-600 mb-2 text-xl">
              <EventIcon className="text-red-800 mr-2" />
              <span>
                {new Date(event.startDate).toLocaleDateString()} -{" "}
                {new Date(event.endDate).toLocaleDateString()}{" "}
                {new Date(event.endDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* Contact Section */}
            <div className="flex items-center text-gray-600 mb-2 text-xl">
              <EmailIcon className="text-red-800 mr-2" />
              <span>{event.email}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-4 text-xl">
              <PhoneIcon className="text-red-800 mr-2" />
              <span>{event.contactInformation}</span>
            </div>

            {/* View Calendar Link (Positioned Below) */}
            <a href="#" className="text-red-600 mt-2 text-lg">
              View Calendar
            </a>
          </div>

          {/* Description */}
          <div className="mb-4 px-6">
            <hr className="border-t border-gray-300 mb-4" />{" "}
            {/* Gray thin line */}
            <h2 className="text-2xl font-semibold text-gray-900">
              Event Details
            </h2>
            <p className="text-gray-700 mt-2 text-lg">{event.description}</p>
          </div>

          {/* Special Guests Section */}
          <div className="mb-8 px-6">
            <hr className="border-t border-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Special Guests
            </h2>
            <div className="flex flex-wrap mt-4">
              {event.guests.length > 0 ? (
                event.guests.map((guest, index) => (
                  <div key={index} className="w-40 p-2">
                    <img
                      src={guest.photo}
                      alt={guest.name}
                      className="w-full h-40 object-cover rounded-lg shadow-md mb-2"
                    />
                    <p className="text-center font-semibold">{guest.name}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No special guests available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
