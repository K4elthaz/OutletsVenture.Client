"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var solid_1 = require("@heroicons/react/solid"); // Using Heroicons for modern icons
var Shop = function () {
    var searchBarRef = react_1.useRef(null);
    var _a = react_1.useState(0), backgroundHeight = _a[0], setBackgroundHeight = _a[1];
    react_1.useEffect(function () {
        var updateBackgroundHeight = function () {
            if (searchBarRef.current) {
                var searchBarHeight = searchBarRef.current.offsetHeight;
                var searchBarOffset = searchBarRef.current.offsetTop;
                var middleOfSearchBar = searchBarOffset + searchBarHeight / 2;
                // Set the background height to the middle of the search bar with some extra space
                setBackgroundHeight(middleOfSearchBar);
            }
        };
        var resizeObserver = new ResizeObserver(updateBackgroundHeight);
        if (searchBarRef.current) {
            resizeObserver.observe(searchBarRef.current);
        }
        // Initial adjustment on mount
        updateBackgroundHeight();
        return function () {
            resizeObserver.disconnect();
        };
    }, []);
    return (React.createElement("div", { className: "relative" },
        React.createElement("div", { className: "absolute inset-x-0 top-0 z-0", style: {
                height: backgroundHeight + "px"
            } },
            React.createElement("div", { className: "h-full bg-cover bg-center", style: {
                    backgroundImage: "url('/image2.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center bottom"
                } },
                React.createElement("div", { className: "absolute inset-0 bg-black opacity-40" }))),
        React.createElement("div", { className: "relative z-10 container mx-auto px-4 sm:px-8 py-8" },
            React.createElement("div", { className: "flex flex-col md:flex-row items-start justify-start space-y-10 md:space-y-0" },
                React.createElement("div", { className: "md:w-2/3" },
                    React.createElement("h1", { className: "text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight md:text-left text-left" }, "Shop 'Til You Drop at Outlets Lipa!"),
                    React.createElement("p", { className: "mt-6 sm:mt-8 text-white max-w-lg text-base sm:text-lg md:text-xl md:text-left text-left" }, "Explore a vibrant array of shops at Outlets Lipa, featuring trendy boutiques and unique finds. Whether you\u2019re after the latest styles or special gifts, there\u2019s something for everyone in our exciting shopping scene!")),
                React.createElement("div", { className: "hidden md:block w-[280px]" })),
            React.createElement("div", { ref: searchBarRef, className: "relative z-20 mt-12 flex justify-center" },
                React.createElement("div", { className: "p-3 sm:p-4 md:p-5 bg-white bg-opacity-20 backdrop-blur-xl rounded-full shadow-lg flex items-center justify-between max-w-3xl w-full space-x-3 sm:space-x-4" },
                    React.createElement("input", { type: "text", placeholder: "Looking for something special?", className: "bg-transparent text-black placeholder-black border-none focus:outline-none focus:ring-0 w-full text-sm sm:text-lg px-3 sm:px-4" }),
                    React.createElement("button", { className: "bg-gradient-to-r from-red-700 to-red-900 text-white rounded-full p-2 sm:p-3 md:p-4 shadow-lg hover:from-red-800 hover:to-red-900 transition duration-300" },
                        React.createElement(solid_1.SearchIcon, { className: "h-4 w-4 sm:h-5 sm:w-5" })))))));
};
exports["default"] = Shop;
