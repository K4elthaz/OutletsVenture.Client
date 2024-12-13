"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ref as dbRef, onValue, update } from "firebase/database";
import { db } from "@/utils/firebase";
import { DineData } from "@/utils/Types";
import { dinesReference } from "@/utils/References";

const DineList = ({ dineName = undefined }: { dineName?: string }) => {
  const [dines, setDines] = useState<DineData[]>([]);
  const router = useRouter();

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

          if (dineName) {
            if (data.title.toLowerCase().includes(dineName.toLowerCase()))
              list.push(data);
          } else list.push(data);
        });

        setDines(list);
      }
    });

    return () => unsubscribe();
  }, [dineName]);

  const OnDataClickedEvent = async (data: DineData) => {
    await update(dbRef(db, `${dinesReference}/${data.id}`), {
      clicks: data.clicks ? data.clicks + 1 : 1,
    });

    if (dineName !== undefined && dineName !== "")
      await update(dbRef(db, `${dinesReference}/${data.id}`), {
        searchs: data.searchs ? data.searchs + 1 : 1,
      });

    router.push(`/shop-and-dine/dine/${encodeURIComponent(data.id)}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      {/* Grid layout for dines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dines.length > 0
          ? dines.map((dine) => (
              <div
                key={dine.title}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <img
                  src={dine.photo}
                  alt={dine.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{dine.title}</h2>
                  <p className="text-gray-600">{dine.openingHour}</p>
                  <p className="text-gray-600">{dine.location}</p>

                  {/* Contact Information */}
                  <p className="text-gray-600">
                    Contact: {dine.contactInformation}
                  </p>

                  {/* Widened and Right-Aligned Visit Button */}
                  <div className="mt-4 flex justify-end">
                    <a
                      onClick={() => OnDataClickedEvent(dine)}
                      className="bg-gradient-to-r from-red-600 to-red-800 text-white py-2 px-10 rounded-full text-center inline-block shadow-lg hover:from-red-700 hover:to-red-900 transition duration-300"
                    >
                      Visit
                    </a>
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default DineList;
