"use client";

import { useState, useRef, useEffect } from "react";
import { SearchIcon } from "@heroicons/react/solid";
import DineList from "./DineList";
import { useDineSuggestions } from "../../Suggestions";
import { ref as dbRef, onValue, update } from "firebase/database";
import { db } from "@/utils/firebase";
import { DineData } from "@/utils/Types";
import { dinesReference } from "@/utils/References";
import { AutoComplete } from "antd";

const Dine = () => {
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [backgroundHeight, setBackgroundHeight] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [dineData, setDineData] = useState<DineData[]>([]);
  const suggestions = useDineSuggestions(dineData, searchTerm);

  useEffect(() => {
    const shopsRef = dbRef(db, dinesReference);

    const unsubscribe = onValue(shopsRef, (snapshot) => {
      if (snapshot.exists()) {
        const list: DineData[] = [];

        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();

          const data: DineData = {
            id: childData.id,
            title: childData.title,
            description: childData.description,
            photo: childData.photo,
            openingHour: childData.openingHour,
            location: childData.location,
            contactInformation: childData.contactInformation,
            email: childData.email,
            closingHour: childData.closingHours,
            searchs: childData.searchs,
            clicks: childData.clicks,
            cloudPanoSceneID: childData.cloudPanoSceneID
              ? childData.cloudPanoSceneID
              : "",
          };

          list.push(data);
        });

        setDineData(list);
      }
    });

    return () => unsubscribe();
  }, [searchTerm]);

  useEffect(() => {
    const updateBackgroundHeight = () => {
      if (searchBarRef.current) {
        const searchBarHeight = searchBarRef.current.offsetHeight;
        const searchBarOffset = searchBarRef.current.offsetTop;
        const middleOfSearchBar = searchBarOffset + searchBarHeight / 2;

        setBackgroundHeight(middleOfSearchBar);
      }
    };

    const resizeObserver = new ResizeObserver(updateBackgroundHeight);
    if (searchBarRef.current) {
      resizeObserver.observe(searchBarRef.current);
    }

    // Initial adjustment on mount
    updateBackgroundHeight();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Convert shopData to suggestions for AutoComplete
  const autoCompleteOptions = suggestions.map((shop) => ({
    value: shop.title,
    label: (
      <div key={shop.id} className="flex items-center">
        <img
          src={shop.photo}
          alt={shop.title}
          className="w-6 h-6 rounded-full mr-2"
        />
        <span>{shop.title}</span>
      </div>
    ),
  }));

  const handleSelect = (value: string) => {
    setSearchTerm(value); // Update search term when an option is selected
  };

  return (
    <div className="relative">
      {/* Background Image with overlay */}
      <div
        className="absolute inset-x-0 top-0 z-0"
        style={{
          height: `${backgroundHeight}px`,
        }}
      >
        <div
          className="h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('/image2.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
      </div>

      {/* Main content wrapped */}
      <div className="relative z-10 container mx-auto px-4 sm:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start justify-start space-y-10 md:space-y-0">
          {/* Left Section - Title and "Start your search" text */}
          <div className="md:w-2/3">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight md:text-left text-left">
              Dine 'Til You Drop at Outlets Lipa!
            </h1>
            <p className="mt-6 sm:mt-8 text-white max-w-lg text-base sm:text-lg md:text-xl md:text-left text-left">
              Explore a vibrant array of dining options at Outlets Lipa,
              featuring unique restaurants and eateries. Whether you're looking
              for a quick bite or a full meal, there's something for every taste
              in our exciting dining scene!
            </p>
          </div>
          <div className="hidden md:block w-[280px]"></div>
        </div>

        {/* Modern Search Bar */}
        <div
          ref={searchBarRef}
          className="relative z-20 mt-12 flex justify-center"
        >
          <div className="p-3 sm:p-4 md:p-5 bg-white bg-opacity-20 backdrop-blur-xl rounded-full shadow-lg flex items-center justify-between max-w-3xl w-full space-x-3 sm:space-x-4">
            <AutoComplete
              options={autoCompleteOptions}
              onSelect={handleSelect}
              onSearch={(value) => setSearchTerm(value)} // Update searchTerm on input
              value={searchTerm}
              style={{ width: "100%" }}
            >
              <input
                type="text"
                placeholder="Looking for something special?"
                className="bg-transparent text-black placeholder-black border-none focus:outline-none focus:ring-0 w-full text-sm sm:text-lg px-3 sm:px-4"
              />
            </AutoComplete>

            <button className="bg-gradient-to-r from-red-700 to-red-900 text-white rounded-full p-2 sm:p-3 md:p-4 shadow-lg hover:from-red-800 hover:to-red-900 transition duration-300">
              <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Dine List */}
        <div className="mt-12">
          <DineList dineName={searchTerm} />
          {/* Pass filtered dines to DineList */}
        </div>
      </div>
    </div>
  );
};

export default Dine;
