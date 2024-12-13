"use client";
import React, { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { EventData } from "@/utils/Types";
import { eventsReference } from "@/utils/References";
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "@/utils/firebase";
import Loading from "@/components/loading/Loading";
const ITEMS_PER_PAGE = 2;

const Events = () => {
  const [eventsData, setEventsData] = useState<EventData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const eventsRef = dbRef(db, eventsReference);

    const unsubscribe = onValue(eventsRef, (snapshot) => {
      if (snapshot.exists()) {
        const eventsList: EventData[] = [];

        snapshot.forEach((childSnapshot) => {
          const eventData = childSnapshot.val();

          const event: EventData = {
            id: eventData.id,
            title: eventData.title,
            description: eventData.description,
            location: eventData.location,
            startDate: eventData.startDate,
            endDate: eventData.endDate,
            photo: eventData.photo,
            email: eventData.email,
            contactInformation: eventData.contactInformation,
            clicks: eventData.clicks,
            featured: eventData.featured,
            guests: eventData.guests,
          };

          eventsList.push(event);
        });

        setEventsData(eventsList);
      }
      setIsMounted(true);
    });
    return () => unsubscribe();
  }, []);

  if (!isMounted) {
    return <Loading />;
  }

  if (eventsData.length === 0) {
    notFound();
  }

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentEvents = eventsData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePagination = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const handleReadMore = (eventsId: number) => {
    router.push(`/promos-and-events/upcoming-events/${eventsId}`);
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
      {/* Title and Image Row */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8 max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center lg:text-left lg:w-full mt-4 mb-4 lg:mb-0">
          <h1 className="text-4xl lg:text-7xl font-extrabold text-red-800 mb-2 mt-6">
            UPCOMING EVENTS!
          </h1>
          <p className="text-xl text-gray-600">
            Don't miss out on this month's latest events!
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

      {/* Events Cards */}
      <div className="w-full py-5 rounded-t-3xl">
        <div className="relative max-w-screen-xl mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {currentEvents.map((events) => (
              <div
                key={events.id}
                className="bg-white rounded-lg overflow-hidden flex flex-col h-auto"
                style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)" }}
              >
                <div className="w-full h-48 lg:h-64 bg-gray-200">
                  <img
                    src={events.photo}
                    alt={events.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {events.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed line-clamp-2 mb-6">
                      {events.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleReadMore(events.id)}
                    className="inline-block text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 py-3 px-6 rounded-full text-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    READ MORE
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Pills */}
          <div className="flex justify-center mt-12 space-x-4">
            {Array(Math.ceil(eventsData.length / ITEMS_PER_PAGE))
              .fill(0)
              .map((_, index) => (
                <button
                  key={index}
                  className={`h-4 w-8 rounded-full ${
                    index === currentPage
                      ? "bg-red-800 opacity-100"
                      : "bg-red-800 opacity-50"
                  } focus:outline-none transform transition-transform hover:scale-110`}
                  onClick={() => handlePagination(index)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
