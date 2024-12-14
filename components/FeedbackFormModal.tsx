"use client";

import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { ref, push, get } from "firebase/database";
import { Star, StarBorder, Close, Chat } from "@mui/icons-material";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
  Fab,
  Slide,
} from "@mui/material";

export default function FeedbackFormModal() {
  const [open, setOpen] = useState(false);
  const [overallExperience, setOverallExperience] = useState(0);
  const [usedAmenities, setUsedAmenities] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

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

  useEffect(() => {
    const checkSubmissionStatus = () => {
      // Function to get the value of a specific cookie by name
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts?.pop()?.split(";").shift();
        return null;
      };

      // Check if the feedbackSubmitted cookie is set
      const submitted = getCookie("feedbackSubmitted");

      if (submitted === "true") {
        setHasSubmitted(true);
      }
    };

    checkSubmissionStatus();
  }, []);

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

      // Set a cookie to prevent multiple submissions
      const expireDate = new Date();
      expireDate.setHours(expireDate.getHours() + 1); // Expires in 1 hour
      document.cookie = `feedbackSubmitted=true; expires=${expireDate.toUTCString()}; path=/;`;

      setHasSubmitted(true);
      setOpen(false);
    } catch (error) {
      console.error("Error saving feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  // useEffect(() => {
  //   const fetchFeedbackOnce = async () => {
  //     try {
  //       const feedbackRef = ref(db, "feedback");
  //       const snapshot = await get(feedbackRef);
  //       if (snapshot.exists()) {
  //         const data = snapshot.val();
  //         console.log("Feedback data:", data);
  //         return data;
  //       } else {
  //         console.log("No feedback data available.");
  //         return null;
  //       }
  //     } catch (error) {
  //       console.error("Error fetching feedback data:", error);
  //       throw error;
  //     }
  //   };

  //   fetchFeedbackOnce();
  // }, []);

  if (hasSubmitted) {
    return null;
  }

  return (
    <>
      <Fab
        color="error"
        aria-label="feedback"
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setOpen(!open)}
      >
        <Chat />
      </Fab>
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Box className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
          <Box className="bg-red-500 p-2 flex justify-between items-center">
            <Typography variant="h6" className="text-white font-bold">
              Feedback Form
            </Typography>
            <IconButton
              onClick={() => setOpen(false)}
              size="small"
              className="text-white"
            >
              <Close />
            </IconButton>
          </Box>
          <Box className="p-4 max-h-[70vh] overflow-y-auto">
            <Typography variant="body2" className="text-gray-600 mb-4">
              Please share your feedback with us!
            </Typography>

            <Box className="mb-4">
              <Typography
                variant="subtitle2"
                className="font-bold text-gray-700 mb-2"
              >
                1. Overall Experience
              </Typography>
              <Box className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconButton
                    key={star}
                    onClick={() => handleStarClick(star)}
                    color={star <= overallExperience ? "primary" : "default"}
                    size="small"
                  >
                    {star <= overallExperience ? (
                      <Star fontSize="small" />
                    ) : (
                      <StarBorder fontSize="small" />
                    )}
                  </IconButton>
                ))}
              </Box>
            </Box>

            <Box className="mb-4">
              <Typography
                variant="subtitle2"
                className="font-bold text-gray-700 mb-2"
              >
                2. Amenities Used
              </Typography>
              <Box className="grid grid-cols-1 gap-1">
                {amenitiesList.map((amenity, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={usedAmenities.includes(amenity)}
                        onChange={() =>
                          handleCheckboxChange(
                            amenity,
                            usedAmenities,
                            setUsedAmenities
                          )
                        }
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">{amenity}</Typography>}
                  />
                ))}
              </Box>
            </Box>

            <Box className="mb-4">
              <Typography
                variant="subtitle2"
                className="font-bold text-gray-700 mb-2"
              >
                3. Preferences
              </Typography>
              <Box className="grid grid-cols-1 gap-1">
                {amenitiesList.map((preference, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={preferences.includes(preference)}
                        onChange={() =>
                          handleCheckboxChange(
                            preference,
                            preferences,
                            setPreferences
                          )
                        }
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">{preference}</Typography>
                    }
                  />
                ))}
              </Box>
            </Box>

            <Box className="mt-4 flex justify-end">
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                size="small"
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Slide>
    </>
  );
}
