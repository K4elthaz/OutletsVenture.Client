"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { EventData } from "@/utils/Types";
import { eventsReference } from "@/utils/References";
import { ref as dbRef, onValue } from "firebase/database";
import { db } from "@/utils/firebase";
import Loading from "@/components/loading/Loading";

// Sample data for cards with unique IDs
// const eventData = [
//   {
//     id: 1,
//     title: "Taylor's Version - Cruel Summer",
//     image: "/image1.jpeg",
//     date: "August 12, 2023",
//     description: "Time to cure the CRUEL SUMMER blues!",
//   },
//   {
//     id: 2,
//     title: "Garelli Cup 2024",
//     image: "/image2.jpg",
//     date: "July 28, 2024",
//     description: "The excitement of the Garelli Cup game tomorrow",
//   },
//   {
//     id: 3,
//     title: "Car-Free Sundays",
//     image: "/image3.jpg",
//     date: "Every Sunday",
//     description: "Join us at LIMA Estate!",
//   },
//   {
//     id: 4,
//     title: "K-Fest Rhythm of Seoul",
//     image: "/image5.jpg",
//     date: "August 4, 2024",
//     description: "The K-Fest (Rhythm of Seoul) event",
//   },
// ];

const EventsPage = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
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

          if (event.featured) eventsList.push(event);
        });

        setEvents(eventsList);
      }
      setPageLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCardClick = (id: number) => {
    router.push(`events/${id}`);
  };

  if (pageLoading) {
    return <Loading />;
  }

  if (events.length === 0) {
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
      <div className="relative w-full h-[300px]">
        <Image
          src="/img_great_deals.png"
          alt="Featured Event"
          layout="fill"
          objectFit="cover"
        />
        {/* Centered text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-bold text-white bg-opacity-70 px-8 py-4 rounded-md">
            FEATURED EVENTS
          </h2>
        </div>
      </div>

      {/* Events Section */}
      <div className="container mx-auto px-5 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-transform duration-300"
              onClick={() => handleCardClick(event.id)} // Pass the event ID to the dynamic route
            >
              <div className="relative h-72">
                <Image
                  src={event.photo}
                  alt={event.title}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-30"></div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-red-600 mb-2">
                  {event.title} {/* Title in red */}
                </h3>

                <p className="text-sm text-gray-500 mb-1">
                  {new Date(event.startDate).toLocaleDateString()} to{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsPage;
