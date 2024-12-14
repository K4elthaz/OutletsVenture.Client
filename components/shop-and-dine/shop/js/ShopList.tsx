"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ref as dbRef, onValue, update } from "firebase/database";
import { db } from "@/utils/firebase";
import { ShopData } from "@/utils/Types";
import { shopsReference } from "@/utils/References";

const ShopList = ({ shopName = undefined }: { shopName?: string }) => {
  const [shops, setShops] = useState<ShopData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const shopsRef = dbRef(db, shopsReference);

    const unsubscribe = onValue(shopsRef, (snapshot) => {
      if (snapshot.exists()) {
        const shopList: ShopData[] = [];

        snapshot.forEach((childSnapshot) => {
          const shopData = childSnapshot.val();

          const shop: ShopData = {
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

          if (shopName) {
            if (shop.title.toLowerCase().includes(shopName.toLowerCase()))
              shopList.push(shop);
          } else shopList.push(shop);
        });

        setShops(shopList);
      }
    });

    return () => unsubscribe();
  }, [shopName]);

  const OnShopClickedEvent = async (shop: ShopData) => {
    await update(dbRef(db, `${shopsReference}/${shop.id}`), {
      clicks: shop.clicks ? shop.clicks + 1 : 1,
    });

    if (shopName !== undefined && shopName !== "")
      await update(dbRef(db, `${shopsReference}/${shop.id}`), {
        searchs: shop.searchs ? shop.searchs + 1 : 1,
      });

    router.push(`/shop-and-dine/shop/${encodeURIComponent(shop.id)}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      {/* Grid layout for shops */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {shops.length > 0
          ? shops.map((shop) => (
              <div
                key={shop.title}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <img
                  src={shop.photo}
                  alt={shop.title}
                  className="w-full h-48 object-contain"
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
  );
};

export default ShopList;
