// components/shop-and-dine/js/DineCard.tsx
"use client"; // Ensure this component is client-side

import { useRouter } from "next/navigation";

interface DineCardProps {
  dineName: string;
  openingHours: string;
  contactNumber: string;
  dineLocation: string;
  imageUrl: string;
}

const DineCard: React.FC<DineCardProps> = ({ dineName, openingHours, contactNumber, dineLocation, imageUrl }) => {
  const router = useRouter();

  const handleVisitClick = () => {
    router.push(`/shop-and-dine/dine/${encodeURIComponent(dineName)}`); // Navigate to the dine details page
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={dineName}
          className="h-full w-full object-cover transform hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{dineName}</h3>
        <p className="text-sm text-gray-500 mb-1">Hours: {openingHours}</p>
        <p className="text-sm text-gray-500 mb-1">Contact: {contactNumber}</p>
        <p className="text-sm text-gray-500 mb-3">Location: {dineLocation}</p>
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

export default DineCard;
