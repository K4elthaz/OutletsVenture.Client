"use client";
import React, { useState } from "react";

const eventsData = [
  {
    id: 1,
    date: "2024-06-28",
    title: "Clearance Sale at USDS Outlet",
    description: "Buy 1, Take 1 promo, and discounts up to 70% off until June 30.",
  },
  {
    id: 2,
    date: "2024-07-05",
    title: "Summer Sale at XYZ Store",
    description: "Enjoy discounts up to 50% on all summer collections.",
  },
  {
    id: 3,
    date: "2024-07-10",
    title: "Exclusive Discounts at Store X",
    description: "Special discounts for all Store X customers.",
  },
  {
    id: 4,
    date: "2024-07-15",
    title: "Back-to-School Promo at ABC Store",
    description: "Discounts on school supplies and apparel until July 31.",
  },
];

const promosData = [
  {
    id: 1,
    startDate: "2024-06-25",
    endDate: "2024-06-30",
    title: "Clearance Sale",
    description: "Visit USDS Outlet for clearance sale, with up to 70% off.",
  },
  {
    id: 2,
    startDate: "2024-07-01",
    endDate: "2024-07-10",
    title: "Summer Splash Deals",
    description: "Huge summer discounts at XYZ Store!",
  },
];

const Calendar = () => {
  const [currentMonth] = useState("July 2024");

  return (
    <div className="w-full max-w-screen-lg mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">{currentMonth} Calendar</h1>

      {/* Events Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-red-800 mb-6">Upcoming Events</h2>
        <div className="space-y-6">
          {eventsData.map((event) => (
            <div key={event.id} className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <span className="text-sm text-gray-500">Date: {event.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Promos Section */}
      <section>
        <h2 className="text-3xl font-semibold text-red-800 mb-6">Current Promos</h2>
        <div className="space-y-6">
          {promosData.map((promo) => (
            <div key={promo.id} className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
              <p className="text-gray-600 mb-4">{promo.description}</p>
              <span className="text-sm text-gray-500">
                Valid from {promo.startDate} to {promo.endDate}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Calendar;
