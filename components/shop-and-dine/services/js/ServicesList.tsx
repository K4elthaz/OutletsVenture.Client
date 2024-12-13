"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ref as dbRef, onValue, update } from "firebase/database";
import { db } from "@/utils/firebase";
import { ServiceData } from "@/utils/Types";
import { servicesReference } from "@/utils/References";

const ServiceList = ({ serviceName = undefined }: { serviceName?: string }) => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const shopsRef = dbRef(db, servicesReference);

    const unsubscribe = onValue(shopsRef, (snapshot) => {
      if (snapshot.exists()) {
        const list: ServiceData[] = [];

        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();

          const data: ServiceData = {
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

          if (serviceName) {
            if (data.title.toLowerCase().includes(serviceName.toLowerCase()))
              list.push(data);
          } else list.push(data);
        });

        setServices(list);
      }
    });

    return () => unsubscribe();
  }, [serviceName]);

  const OnDataClickedEvent = async (data: ServiceData) => {
    await update(dbRef(db, `${servicesReference}/${data.id}`), {
      clicks: data.clicks ? data.clicks + 1 : 1,
    });

    if (serviceName !== undefined && serviceName !== "")
      await update(dbRef(db, `${servicesReference}/${data.id}`), {
        searchs: data.searchs ? data.searchs + 1 : 1,
      });

    router.push(`/shop-and-dine/services/${encodeURIComponent(data.id)}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      {/* Grid layout for services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.length > 0
          ? services.map((service) => (
              <div
                key={service.title}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <img
                  src={service.photo}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{service.title}</h2>
                  <p className="text-gray-600">{service.openingHour}</p>
                  <p className="text-gray-600">{service.location}</p>

                  {/* Contact Information */}
                  <p className="text-gray-600">
                    Contact: {service.contactInformation}
                  </p>

                  {/* Widened and Right-Aligned Visit Button */}
                  <div className="mt-4 flex justify-end">
                    <a
                      onClick={() => OnDataClickedEvent(service)}
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

export default ServiceList;
