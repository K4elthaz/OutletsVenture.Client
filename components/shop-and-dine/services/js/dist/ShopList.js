"use strict";
exports.__esModule = true;
// components/shop-and-dine/js/ShopList.tsx
var ShopCard_1 = require("./ShopCard");
var shopData_1 = require("./shopData"); // Adjust the path as needed
var ShopList = function () {
    return (React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" }, shopData_1["default"].map(function (shop) { return (React.createElement(ShopCard_1["default"], { key: shop.shopName, shopName: shop.shopName, openingHours: shop.openingHours, contactNumber: shop.contactNumber, shopLocation: shop.shopLocation, imageUrl: shop.imageUrl })); })));
};
exports["default"] = ShopList;
