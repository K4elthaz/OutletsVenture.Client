"use client";
import { useState, useCallback, MouseEvent, useEffect } from "react";
import { NAV_LINKS } from "@/constants";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IconButton, Collapse } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

// Utility function for debouncing actions like scroll
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const Navbar = () => {
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [isShopAndDineOpen, setIsShopAndDineOpen] = useState(false);
  const [isPromosAndEventsOpen, setIsPromosAndEventsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [activePromosSubMenu, setActivePromosSubMenu] = useState<string | null>(
    null
  );
  const router = useRouter();

  const handleScroll = useCallback(
    debounce((id: string) => {
      setIsPromosAndEventsOpen(false);
      setIsShopAndDineOpen(false);
      setActiveSubMenu(null);
      setActivePromosSubMenu(null);
      if (id === "home") {
        router.push("/home-page");
        setActiveLink(id);
      } else if (id === "mall_map") {
        router.push("/mall-map");
        setActiveLink(id);
      } else if (id === "routes") {
        router.push("/routes");
        setActiveLink(id);
      } else if (id === "aboitiz_pitch") {
        router.push("/aboitiz-pitch");
        setActiveLink(id);
      } else if (id === "feedback") {
        router.push("/feedback");
        setActiveLink(id);
      } else if (id === "landing") {
        router.push("/");
        setActiveLink(null);
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          setActiveLink(id);
        }
      }
    }, 100),
    []
  );

  const handleShopAndDineClick = (e: React.MouseEvent, linkKey: string) => {
    e.preventDefault();
    setIsShopAndDineOpen((prev) => {
      if (!prev) {
        // Close Promos and Events dropdown if Shop and Dine is opening
        setIsPromosAndEventsOpen(false);
        setActivePromosSubMenu(null);
      }
      return !prev;
    });
    setActiveLink(linkKey);
  };

  const handlePromosAndEventsClick = (e: React.MouseEvent, linkKey: string) => {
    e.preventDefault();
    setIsPromosAndEventsOpen((prev) => {
      if (!prev) {
        // Close Shop and Dine dropdown if Promos and Events is opening
        setIsShopAndDineOpen(false);
        setActiveSubMenu(null);
      }
      return !prev;
    });
    setActiveLink(linkKey);
  };

  const handleSubMenuClick = (link: string) => {
    setActiveSubMenu(link);
    setIsShopAndDineOpen(false);
    if (link === "Shop") {
      router.push("/shop-and-dine/shop");
    } else if (link === "Dine") {
      router.push("/shop-and-dine/dine");
    } else {
      router.push("/shop-and-dine/services");
    }
  };

  const handlePromosSubMenuClick = (link: string) => {
    setActivePromosSubMenu(link);
    setIsPromosAndEventsOpen(false);
    if (link === "Great Deals and Finds") {
      router.push("/promos-and-events/great-deals");
    } else {
      router.push("/promos-and-events/upcoming-events");
    }
  };

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Automatically close the mobile menu after selecting an option
  const handleLinkClick = (linkKey: string) => {
    setIsMobileMenuOpen(false);
    setActiveLink(linkKey);
  };

  return (
    <nav
      id="navbar"
      className="bg-[url('/img_navbar.png')] bg-cover bg-center bg-no-repeat shadow-md sticky top-0 z-50"
    >
      <div className="flex justify-between w-full px-5 xl:px-32 py-8">
        <Link
          href=""
          onClick={() => {
            handleScroll("landing");
          }}
        >
          <Image src="/outlets_logo.svg" alt="logo" width={74} height={29} />
        </Link>

        <ul className="hidden h-full gap-12 lg:flex ml-auto">
          {NAV_LINKS.map((link) => (
            <li key={link.key} className="relative group">
              <Link
                href={link.href}
                onClick={(e) => {
                  if (link.key === "home") {
                    e.preventDefault();
                    handleScroll("home");
                  } else if (link.key === "shop_and_dine") {
                    handleShopAndDineClick(e, link.key);
                  } else if (link.key === "promos_and_events") {
                    handlePromosAndEventsClick(e, link.key);
                  } else {
                    e.preventDefault();
                    handleScroll(link.key);
                  }
                }}
                className={`regular-16 text-white flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold ${
                  activeLink === link.key ? "font-bold" : ""
                }`}
              >
                {link.label}
              </Link>
              <span
                className={`absolute bottom-0 left-0 h-1 w-0 bg-white transition-all group-hover:w-full ${
                  activeLink === link.key ? "w-full" : ""
                }`}
              ></span>

              {link.key === "shop_and_dine" && isShopAndDineOpen && (
                <ul className="absolute top-full mt-2 left-0 bg-white text-black shadow-lg py-2 rounded-lg">
                  <li
                    className={`px-4 py-2 hover:bg-gray-200 cursor-pointer ${
                      activeSubMenu === "Shop" ? "bg-gray-300 font-bold" : ""
                    }`}
                    onClick={() => handleSubMenuClick("Shop")}
                  >
                    <a>Shop</a>
                  </li>
                  <li
                    className={`px-4 py-2 hover:bg-gray-200 cursor-pointer ${
                      activeSubMenu === "Dine" ? "bg-gray-300 font-bold" : ""
                    }`}
                    onClick={() => handleSubMenuClick("Dine")}
                  >
                    <a>Dine</a>
                  </li>
                  <li
                    className={`px-4 py-2 hover:bg-gray-200 cursor-pointer ${
                      activeSubMenu === "Services"
                        ? "bg-gray-300 font-bold"
                        : ""
                    }`}
                    onClick={() => handleSubMenuClick("Services")}
                  >
                    <a>Services</a>
                  </li>
                </ul>
              )}

              {link.key === "promos_and_events" && isPromosAndEventsOpen && (
                <ul className="absolute top-full mt-2 left-0 bg-white text-black shadow-lg py-2 rounded-lg">
                  <li
                    className={`px-4 py-2 hover:bg-gray-200 cursor-pointer ${
                      activePromosSubMenu === "Great Deals and Finds"
                        ? "bg-gray-300 font-bold"
                        : ""
                    }`}
                    onClick={() =>
                      handlePromosSubMenuClick("Great Deals and Finds")
                    }
                  >
                    <a>Great Deals and Finds</a>
                  </li>
                  <li
                    className={`px-4 py-2 hover:bg-gray-200 cursor-pointer ${
                      activePromosSubMenu === "Upcoming Events"
                        ? "bg-gray-300 font-bold"
                        : ""
                    }`}
                    onClick={() => handlePromosSubMenuClick("Upcoming Events")}
                  >
                    <a>Upcoming Events</a>
                  </li>
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Hamburger Icon for Mobile Menu */}
        <IconButton onClick={toggleMobileMenu} className="lg:hidden">
          {isMobileMenuOpen ? (
            <CloseIcon className="text-white" />
          ) : (
            <MenuIcon className="text-white" />
          )}
        </IconButton>
      </div>

      {/* Sliding Mobile Menu */}
      <Collapse in={isMobileMenuOpen} timeout="auto" className="lg:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="absolute right-0 top-0 bg-white w-2/3 h-full z-50 p-6">
            <button
              className="self-end mb-4 text-gray-600"
              onClick={toggleMobileMenu}
            >
              Close
            </button>
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.key} className="mb-4">
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      if (link.key === "home") {
                        e.preventDefault();
                        handleScroll("home");
                      } else if (link.key === "shop_and_dine") {
                        handleShopAndDineClick(e, link.key);
                      } else if (link.key === "promos_and_events") {
                        handlePromosAndEventsClick(e, link.key);
                      } else {
                        e.preventDefault();
                        handleScroll(link.key);
                      }
                    }} // Close the mobile menu after clicking an option
                    className={`block text-gray-800 font-bold ${
                      activeLink === link.key ? "text-blue-500" : ""
                    }`} // Highlight active link in mobile view
                  >
                    {link.label}
                  </Link>

                  {/* Sub-menu for Shop & Dine */}
                  {link.key === "shop_and_dine" && (
                    <ul className="ml-4 mt-2">
                      <li className="mb-2">
                        <Link
                          href="/shop-and-dine/shop"
                          onClick={() => handleLinkClick("Shop")}
                        >
                          Shop
                        </Link>
                      </li>
                      <li className="mb-2">
                        <Link
                          href="/shop-and-dine/dine"
                          onClick={() => handleLinkClick("Dine")}
                        >
                          Dine
                        </Link>
                      </li>
                      <li className="mb-2">
                        <Link
                          href="/shop-and-dine/services"
                          onClick={() => handleLinkClick("Services")}
                        >
                          Services
                        </Link>
                      </li>
                    </ul>
                  )}

                  {/* Sub-menu for Promos & Events */}
                  {link.key === "promos_and_events" && (
                    <ul className="ml-4 mt-2">
                      <li className="mb-2">
                        <Link
                          href="/promos-and-events/great-deals"
                          onClick={() =>
                            handleLinkClick("Great Deals and Finds")
                          }
                        >
                          Great Deals and Finds
                        </Link>
                      </li>
                      <li className="mb-2">
                        <Link
                          href="/promos-and-events/upcoming-events"
                          onClick={() => handleLinkClick("Upcoming Events")}
                        >
                          Upcoming Events
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Collapse>
    </nav>
  );
};

export default Navbar;
