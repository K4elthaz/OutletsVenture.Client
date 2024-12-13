// components/shop-and-dine/js/ShopCard.tsx
"use client"; // Ensure this component is client-side
"use strict";
exports.__esModule = true;
var navigation_1 = require("next/navigation");
var ShopCard = function (_a) {
    var shopName = _a.shopName, openingHours = _a.openingHours, contactNumber = _a.contactNumber, shopLocation = _a.shopLocation, imageUrl = _a.imageUrl;
    var router = navigation_1.useRouter();
    var handleVisitClick = function () {
        router.push("/shop-and-dine/shop/" + encodeURIComponent(shopName)); // Navigate to the shop details page
    };
    return (React.createElement("div", { className: "bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-transform duration-300" },
        React.createElement("div", { className: "relative h-48 bg-gray-200 overflow-hidden" },
            React.createElement("img", { src: imageUrl, alt: shopName, className: "h-full w-full object-cover transform hover:scale-110 transition-transform duration-300" })),
        React.createElement("div", { className: "p-6" },
            React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-2" }, shopName),
            React.createElement("p", { className: "text-sm text-gray-500 mb-1" },
                "Hours: ",
                openingHours),
            React.createElement("p", { className: "text-sm text-gray-500 mb-1" },
                "Contact: ",
                contactNumber),
            React.createElement("p", { className: "text-sm text-gray-500 mb-3" },
                "Location: ",
                shopLocation),
            React.createElement("button", { className: "inline-block bg-gradient-to-r from-red-700 to-red-900 text-white py-2 px-6 rounded-full text-sm hover:from-red-800 hover:to-red-900 transition-colors duration-300", onClick: handleVisitClick }, "Visit"))));
};
exports["default"] = ShopCard;
