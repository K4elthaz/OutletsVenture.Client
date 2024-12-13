"use client";
import React, { useState, useEffect } from "react";
import { ref as dbRef, onValue, set, update, get } from "firebase/database";
import { db } from "@/utils/firebase";
import { landingPageVideoURL } from "@/utils/References";

const trackVisit = async () => {
  const visitsRef = dbRef(db, "Visits");
  const currentDate = Date.now();

  const currentDayKey = new Date().toISOString().slice(0, 10);

  try {
    const snapshot = await get(visitsRef);

    let visitData = snapshot.exists() ? snapshot.val() : {};

    let dailyVisits = visitData[currentDayKey]
      ? visitData[currentDayKey].count
      : 0;
    dailyVisits += 1;

    const updatedVisitData = {
      ...visitData,
      [currentDayKey]: {
        count: dailyVisits,
        lastVisit: currentDate,
      },
    };

    await set(visitsRef, updatedVisitData);
  } catch (error) {
    console.error("Failed to track visit", error);
  }
};

const LandingPage = () => {
  const [videoURL, setVideoURL] = useState<string>("");
  useEffect(() => {
    const videoRef = dbRef(db, landingPageVideoURL);

    const unsubscribe = onValue(videoRef, (snapshot) => {
      if (snapshot.exists()) {
        setVideoURL(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, []);

  if (videoURL !== "") trackVisit();

  return (
    <section className="relative w-full h-[50vh] overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={videoURL}
        autoPlay
        muted
        loop
      />
    </section>
  );
};

export default LandingPage;
