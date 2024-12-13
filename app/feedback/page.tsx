"use client";
import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { ref, push, get } from "firebase/database";
import { FaStar } from "react-icons/fa";

export default function FeedbackForm() {
  const [overallExperience, setOverallExperience] = useState(0); // Changed to 0 for star-based rating
  const [usedAmenities, setUsedAmenities] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);

  const amenitiesList = [
    "Restrooms",
    "Seating Areas",
    "Bike Stations",
    "Vending Machine",
    "Trash Bins",
    "Smoking Area",
    "Fire Extinguisher",
    "PWD Ramps",
    "ATM",
    "Breastfeeding",
    "Parking Facilities",
  ];

  const handleCheckboxChange = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList((prev: string[]) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleStarClick = (rating: number) => {
    setOverallExperience(rating);
  };

  const handleSubmit = async () => {
    const feedbackData = {
      overallExperience,
      usedAmenities,
      preferences,
      timestamp: new Date().toISOString(),
    };

    try {
      const feedbackRef = ref(db, "feedback");
      await push(feedbackRef, feedbackData);
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error saving feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  useEffect(() => {
    const fetchFeedbackOnce = async () => {
      try {
        const feedbackRef = ref(db, "feedback");
        const snapshot = await get(feedbackRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log("Feedback data:", data);
          return data;
        } else {
          console.log("No feedback data available.");
          return null;
        }
      } catch (error) {
        console.error("Error fetching feedback data:", error);
        throw error;
      }
    };

    fetchFeedbackOnce();
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url("/img_background_pattern.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f0f0f0", // Fallback color
      }}
    >
      <div className="bg-white shadow-md rounded-lg max-w-2xl w-full p-6">
        {/* Form Content */}
        <h2 className="text-2xl font-bold text-red-500 text-center mb-2">
          Feedback Form
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Please share your feedback with us!
        </p>

        {/* Overall Experience */}
        <div className="mb-6">
          <label className="block font-bold text-gray-700 mb-2">
            1. Overall Experience
          </label>
          <p className="text-sm italic text-gray-500 mb-2">
            Rate your overall satisfaction with your visit!
          </p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={40}
                className={`cursor-pointer ${
                  star <= overallExperience
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
                onClick={() => handleStarClick(star)}
              />
            ))}
          </div>
        </div>

        {/* Used Amenities */}
        <div className="mb-6">
          <label className="block font-bold text-gray-700 mb-2">
            2. Amenities Used
          </label>
          <div className="grid grid-cols-2 gap-4">
            {amenitiesList.map((amenity, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={usedAmenities.includes(amenity)}
                  onChange={() =>
                    handleCheckboxChange(
                      amenity,
                      usedAmenities,
                      setUsedAmenities
                    )
                  }
                  className="mr-2 text-red-500"
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-6">
          <label className="block font-bold text-gray-700 mb-2">
            3. Preferences
          </label>
          <div className="grid grid-cols-2 gap-4">
            {amenitiesList.map((preference, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.includes(preference)}
                  onChange={() =>
                    handleCheckboxChange(
                      preference,
                      preferences,
                      setPreferences
                    )
                  }
                  className="mr-2 text-red-500"
                />
                {preference}
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
