"use strict";
exports.__esModule = true;
var react_1 = require("react");
var GetApp = function () {
    return (react_1["default"].createElement("section", { className: "relative flexCenter w-full flex-col pb-[100px] px-6 py-12 sm:flex-row sm:gap-12 sm:py-24 lg:px-20 xl:max-h-[598px] 2xl:rounded-5xl", style: {
            backgroundImage: "url('/img_great_deals.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative'
        } },
        react_1["default"].createElement("div", { style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(128, 0, 0, 0.7), rgba(220, 20, 60, 0.7))',
                backdropFilter: 'blur(10px)',
                zIndex: -1,
                opacity: 0.8,
                borderRadius: '25px'
            } }),
        react_1["default"].createElement("div", { className: "z-20 flex w-full flex-1 flex-col items-start justify-center gap-12" },
            react_1["default"].createElement("h2", { className: "text-white font-bold text-4xl lg:text-6xl" }, "Get for free now!"),
            react_1["default"].createElement("p", { className: "text-gray-100 regular-16" }, "Available on iOS and Android"),
            react_1["default"].createElement("div", { className: "flex w-full flex-col gap-3 whitespace-nowrap xl:flex-row" }))));
};
exports["default"] = GetApp;
