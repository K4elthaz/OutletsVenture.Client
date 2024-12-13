"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var dealsData = [
    {
        id: 1,
        imageUrl: "/image1.jpeg",
        title: "Great deals at USDS Outlet!",
        description: 'The Clearance Sale at #TheOutletsAtLipa continues TODAY until tomorrow, June 30! Visit USDS Outlet, take advantage of their "Buy 1, Take 1" promo, and discounted items up to 70% off. Enjoy shopping during this Clearance Sale!'
    },
    {
        id: 2,
        imageUrl: "/image2.jpg",
        title: "Great deals at USDS Outlet!",
        description: 'The Clearance Sale at #TheOutletsAtLipa continues TODAY until tomorrow, June 30! Visit USDS Outlet, take advantage of their "Buy 1, Take 1" promo, and discounted items up to 70% off. Enjoy shopping during this Clearance Sale!'
    },
    {
        id: 3,
        imageUrl: "/image3.jpg",
        title: "Exclusive Discounts at Store X!",
        description: "Special discounts for all Store X customers. Hurry and grab your favorite products at unbeatable prices!"
    },
    {
        id: 4,
        imageUrl: "/image5.jpg",
        title: "Summer Sale at XYZ Store!",
        description: "Get ready for the Summer Sale at XYZ Store. Discounts up to 50% on all summer collections. Don’t miss out!"
    },
    {
        id: 5,
        imageUrl: "/image3.jpg",
        title: "Exclusive Discounts at Store X!",
        description: "Special discounts for all Store X customers. Hurry and grab your favorite products at unbeatable prices!"
    },
    {
        id: 6,
        imageUrl: "/image5.jpg",
        title: "Summer Sale at XYZ Store!",
        description: "Get ready for the Summer Sale at XYZ Store. Discounts up to 50% on all summer collections. Don’t miss out!"
    },
];
var ITEMS_PER_PAGE = 2;
var GreatDeals = function () {
    var _a = react_1.useState(0), currentPage = _a[0], setCurrentPage = _a[1];
    var startIndex = currentPage * ITEMS_PER_PAGE;
    var currentDeals = dealsData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    var handlePagination = function (pageIndex) {
        setCurrentPage(pageIndex);
    };
    return (react_1["default"].createElement("div", { className: "w-full min-h-screen", style: {
            backgroundImage: 'url("/img_background_pattern.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#f0f0f0"
        } },
        react_1["default"].createElement("div", { className: "flex flex-col lg:flex-row items-center justify-between mb-8 max-w-screen-xl mx-auto px-4 lg:px-8" },
            react_1["default"].createElement("div", { className: "text-center lg:text-left lg:w-full mt-4 mb-4 lg:mb-0" },
                react_1["default"].createElement("h1", { className: "text-4xl lg:text-7xl font-extrabold text-red-800 mb-2 mt-6" }, "GREAT DEALS & FINDS"),
                react_1["default"].createElement("p", { className: "text-xl text-gray-600" }, "Don't miss out on this month's latest offers!"),
                react_1["default"].createElement("div", { className: "w-64 h-1 bg-red-800 mt-4 mx-auto lg:mx-0" })),
            react_1["default"].createElement("div", { className: "lg:w-1/2 flex justify-center lg:justify-end" },
                react_1["default"].createElement("img", { src: "/img_cartoon_deals.png" // Replace with your image path
                    , alt: "Deals Illustration", className: "w-64 lg:w-80" }))),
        react_1["default"].createElement("div", { className: "w-full py-10 rounded-t-3xl" },
            react_1["default"].createElement("div", { className: "relative max-w-screen-xl mx-auto px-4 lg:px-12" },
                react_1["default"].createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8" }, currentDeals.map(function (deal, index) { return (react_1["default"].createElement("div", { key: deal.id, className: "bg-white rounded-lg overflow-hidden flex flex-col h-auto animate-slideIn", style: {
                        animationDelay: index * 0.1 + "s",
                        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)"
                    } },
                    react_1["default"].createElement("div", { className: "w-full h-48 lg:h-64 bg-gray-200" },
                        react_1["default"].createElement("img", { src: deal.imageUrl, alt: deal.title, className: "object-cover w-full h-full" })),
                    react_1["default"].createElement("div", { className: "p-6 flex flex-col justify-between flex-grow" },
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("h3", { className: "text-2xl font-bold text-gray-900 mb-4" }, deal.title),
                            react_1["default"].createElement("p", { className: "text-gray-600 leading-relaxed line-clamp-3 mb-6" }, deal.description)),
                        react_1["default"].createElement("a", { href: "#", className: "inline-block text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 py-3 px-6 rounded-full text-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300" }, "READ MORE")))); })),
                react_1["default"].createElement("div", { className: "flex justify-center mt-12 space-x-4" }, Array(Math.ceil(dealsData.length / ITEMS_PER_PAGE))
                    .fill(0)
                    .map(function (_, index) { return (react_1["default"].createElement("button", { key: index, className: "h-4 w-8 rounded-full " + (index === currentPage
                        ? "bg-red-800 opacity-100"
                        : "bg-red-800 opacity-50") + " focus:outline-none transform transition-transform hover:scale-110", onClick: function () { return handlePagination(index); } })); }))))));
};
exports["default"] = GreatDeals;
