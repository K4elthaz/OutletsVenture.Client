"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { ServiceData } from "@/utils/Types";
import { ref as dbRef, onValue, update } from "firebase/database";
import { db } from "@/utils/firebase";
import { cloudPano, servicesReference } from "@/utils/References";
import Loading from "@/components/loading/Loading";
import { getRecommendedShops } from "@/components/shop-and-dine/Suggestions";

const ServiceDetails = () => {
  const [service, setService] = useState<ServiceData | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();
  const [otherShops, setOtherShops] = useState<ServiceData[]>([]);

  const OnShopClickedEvent = async (shop: ServiceData) => {
    await update(dbRef(db, `${servicesReference}/${shop.id}`), {
      clicks: shop.clicks ? shop.clicks + 1 : 1,
    });

    await update(dbRef(db, `${servicesReference}/${shop.id}`), {
      searchs: shop.searchs ? shop.searchs + 1 : 1,
    });

    router.push(`/shop-and-dine/shop/${encodeURIComponent(shop.id)}`);
  };

  useEffect(() => {
    const shopRef = dbRef(db, `${servicesReference}/${id}`);

    const unsubscribe = onValue(shopRef, (snapshot) => {
      if (snapshot.exists()) {
        const childData = snapshot.val();

        const shop: ServiceData = {
          id: childData.id,
          title: childData.title,
          description: childData.description
            ? childData.description
            : "Lorem Epsum Dolor Sit Amet",
          photo: childData.photo,
          openingHour: childData.openingHour ? childData.openingHour : "N/A",
          location: childData.location ? childData.location : "Outlets",
          contactInformation: childData.contactInformation
            ? childData.contactInformation
            : "N/A",
          email: childData.email ? childData.email : "N/A",
          closingHour: childData.closingHours ? childData.closingHours : "N/A",
          searchs: childData.searchs,
          clicks: childData.clicks,
          cloudPanoSceneID: childData.cloudPanoSceneID
            ? childData.cloudPanoSceneID
            : "",
        };

        setService(shop);
      }
      setPageLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    const shopsRef = dbRef(db, servicesReference);

    const unsubscribe = onValue(shopsRef, (snapshot) => {
      if (snapshot.exists()) {
        const shopList: ServiceData[] = [];

        snapshot.forEach((childSnapshot) => {
          const shopData = childSnapshot.val();

          const shop: ServiceData = {
            id: shopData.id,
            title: shopData.title,
            description: shopData.description,
            photo: shopData.photo,
            openingHour: shopData.openingHour,
            location: shopData.location,
            contactInformation: shopData.contactInformation,
            email: shopData.email,
            closingHour: shopData.closingHours,
            searchs: shopData.searchs,
            clicks: shopData.clicks,
            cloudPanoSceneID: shopData.cloudPanoSceneID
              ? shopData.cloudPanoSceneID
              : "",
          };

          shopList.push(shop);
        });

        setOtherShops(shopList?.filter((shop) => shop.id?.toString() !== id));
      }
    });

    return () => unsubscribe();
  }, [id]);

  if (pageLoading) {
    return <Loading />;
  }

  if (!service) {
    notFound();
  }

  const recommendedShops = getRecommendedShops(service, otherShops);

  return (
    <div
      className="w-full min-h-64 mb-5"
      style={{
        backgroundImage: 'url("/img_background_pattern.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f0f0f0", // Fallback color
      }}
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-0 max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center lg:text-left lg:w-full mt-4 mb-4 lg:mb-0">
          <h1 className="text-5xl lg:text-8xl font-extrabold text-red-800 mb-2 mt-6">
            Outlets Lipa Services {/* Title for services */}
          </h1>
          <p className="text-xl text-gray-600">
            Discover amazing services and exclusive offers!
          </p>
          <div className="w-64 h-1 bg-red-800 mt-4 mx-auto lg:mx-0"></div>
        </div>
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <img
            src="/img_cartoon_services.png"
            alt="Services Illustration"
            className="w-64 lg:w-80"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full min-h-64 py-8">
        {/* Content Width Adjusted to max-w-screen-xl */}
        <div
          className="max-w-screen-xl mx-auto bg-white rounded-lg overflow-hidden"
          style={{
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)", // Custom shadow with more intensity
          }}
        >
          {/* Main Content Container */}
          <div className="lg:flex">
            {/* Image Section */}
            <div className="lg:w-1/2">
              <img
                src={service.photo}
                alt={service.title}
                className="object-cover w-full h-full rounded-l-lg"
              />
            </div>

            {/* Text Section */}
            <div className="p-6 lg:w-1/2 flex flex-col justify-between">
              {/* Service Name */}
              <div className="mb-4">
                <h1 className="text-4xl font-extrabold text-gray-900">
                  {service.title}
                </h1>
              </div>

              {/* Opening Hours */}
              <div className="flex items-center text-gray-600 mt-2">
                <AccessTimeIcon className="text-red-800 mr-2" />{" "}
                {/* Time Icon */}
                <span>{service.openingHour}</span>
              </div>

              {/* Closing Hours */}
              <div className="flex items-center text-gray-600 mt-2">
                <AccessTimeIcon className="text-red-800 mr-2" />{" "}
                {/* Time Icon */}
                <span>{service.closingHour}</span>
              </div>

              {/* Email */}
              <div className="flex items-center text-gray-600 mt-4">
                <EmailIcon className="text-red-800 mr-2" /> {/* Email Icon */}
                <span>{service.email}</span>
              </div>

              {/* Contact */}
              <div className="flex items-center text-gray-600 mt-2">
                <PhoneIcon className="text-red-800 mr-2" /> {/* Phone Icon */}
                <span>{service.contactInformation}</span>
              </div>

              {/* Service Description */}
              <div className="mb-4 mt-4">
                <p className="text-gray-600 mt-2">{service.description}</p>
              </div>

              {/* Buttons Section */}
              <div className="mt-auto flex flex-col space-y-4 items-end w-full">
                {/* View 360 Virtual Tour Button */}
                <a
                  onClick={() =>
                    router.push(
                      `/mall-map/360?sceneId=${service.cloudPanoSceneID}`
                    )
                  }
                  className="w-full border border-red-700 text-red-700 py-3 px-8 rounded-full text-center font-semibold transition-all duration-300 hover:bg-red-700 hover:text-white"
                >
                  View 360 Virtual Tour
                </a>

                {/* Back Button */}
                <button
                  className="w-full bg-gradient-to-r from-red-500 to-red-800 text-white py-3 px-8 rounded-full flex items-center justify-center hover:from-red-600 hover:to-red-900 transition"
                  onClick={() => router.back()} // Back to previous page
                >
                  <ArrowBackIcon className="mr-2" /> {/* Back icon */}
                  Back to Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-8 max-w-screen-xl mx-auto px-4 lg:px-8">
        <div className="text-center lg:text-left lg:w-full mt-4 mb-4 lg:mb-0">
          <h1 className="text-5xl lg:text-4xl font-extrabold text-red-800 mb-2 mt-6">
            Also you may like
          </h1>
          <p className="text-xl text-gray-600">
            Discover amazing deals and exclusive offers!
          </p>
        </div>

        <div className="container mx-auto px-4 sm:px-8">
          {/* Grid layout for shops */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedShops.length > 0
              ? recommendedShops.map((shop: ServiceData) => (
                  <div
                    key={shop.title}
                    className="bg-white shadow-md rounded-lg overflow-hidden"
                  >
                    <img
                      src={shop.photo}
                      alt={shop.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-lg font-semibold">{shop.title}</h2>
                      <p className="text-gray-600">{shop.openingHour}</p>
                      <p className="text-gray-600">{shop.location}</p>

                      {/* Contact Information */}
                      <p className="text-gray-600">
                        Contact: {shop.contactInformation}
                      </p>

                      {/* Widened and Right-Aligned Visit Button */}
                      <div className="mt-4 flex justify-end">
                        <a
                          onClick={() => OnShopClickedEvent(shop)}
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
      </div>
    </div>
  );
};

export default ServiceDetails;