"use strict";
exports.__esModule = true;
var router_1 = require("next/router");
var ShopDetails = function () {
    var router = router_1.useRouter();
    var _a = router.query, shopName = _a.shopName, openingHours = _a.openingHours, contactNumber = _a.contactNumber, shopLocation = _a.shopLocation, imageUrl = _a.imageUrl, description = _a.description, contactEmail = _a.contactEmail;
    if (!shopName) {
        return React.createElement("div", null, "Loading...");
    }
    return (React.createElement("div", { className: "container mx-auto px-4 py-8" },
        React.createElement("div", { className: "flex flex-col md:flex-row items-start justify-between space-y-6 md:space-y-0 md:space-x-8" },
            React.createElement("div", { className: "md:w-2/3" },
                React.createElement("img", { src: imageUrl, alt: shopName, className: "rounded-lg shadow-md w-full h-auto object-cover" })),
            React.createElement("div", { className: "md:w-1/3 bg-white rounded-lg shadow-md p-6" },
                React.createElement("h2", { className: "text-3xl font-bold text-red-700 mb-2" }, shopName),
                React.createElement("p", { className: "text-lg font-semibold mb-4" }, openingHours),
                React.createElement("p", { className: "text-gray-600 mb-4" }, description),
                React.createElement("button", { className: "bg-red-600 text-white px-4 py-2 rounded-md w-full mb-4 hover:bg-red-700 transition-colors" }, "View 360 Virtual Tour"),
                React.createElement("div", { className: "space-y-2" },
                    React.createElement("div", { className: "flex items-center" },
                        React.createElement("img", { src: "/email-icon.svg", alt: "Email", className: "w-5 h-5 mr-2" }),
                        React.createElement("a", { href: "mailto:" + contactEmail, className: "text-gray-600" }, contactEmail || 'N/A')),
                    React.createElement("div", { className: "flex items-center" },
                        React.createElement("img", { src: "/phone-icon.svg", alt: "Phone", className: "w-5 h-5 mr-2" }),
                        React.createElement("a", { href: "tel:" + contactNumber, className: "text-gray-600" }, contactNumber || 'N/A')))))));
};
exports["default"] = ShopDetails;
