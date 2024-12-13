// components/shop-and-dine/js/ShopCard.tsx
"use client"; // Ensure this component is client-side

import { useRouter } from "next/navigation";

interface ShopCardProps {
  id: number;
  shopName: string;
  openingHours: string;
  contactNumber: string;
  shopLocation: string;
  imageUrl: string;
}

const ShopCard: React.FC<ShopCardProps> = ({
  id,
  shopName,
  contactNumber,
  openingHours,
  shopLocation,
  imageUrl,
}) => {
  const router = useRouter();

  const handleVisitClick = () => {
    router.push(`/shop-and-dine/shop/${encodeURIComponent(id)}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={shopName}
          className="h-full w-full object-cover transform hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{shopName}</h3>
        <p className="text-sm text-gray-500 mb-1">Hours: {openingHours}</p>
        <p className="text-sm text-gray-500 mb-1">Contact: {contactNumber}</p>
        <p className="text-sm text-gray-500 mb-3">Location: {shopLocation}</p>
        <button
          className="inline-block bg-gradient-to-r from-red-700 to-red-900 text-white py-2 px-6 rounded-full text-sm hover:from-red-800 hover:to-red-900 transition-colors duration-300"
          onClick={handleVisitClick}
        >
          Visit
        </button>
      </div>
    </div>
  );
};

export default ShopCard;
