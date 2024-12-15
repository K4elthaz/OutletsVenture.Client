"use client";
import { useState, useEffect } from "react";
import { ref, onValue, push } from "firebase/database";
import { db } from "@/utils/firebase";
import { Modal } from "antd/lib";
import MapCanvas from "@/components/routes/MapCanvas"; // Adjust this path as needed
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
} from "@mui/icons-material";
import { Button, message } from "antd";

type Point = [number, number];
type Shop = { id: string; title: string };

const PathFinder = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [routes, setRoutes] = useState<string[]>(["Select Route"]);
  const [selectedShop, setSelectedShop] = useState<string>("");
  const [selectedRoute, setSelectedRoute] = useState<string>();
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [initialPoints, setInitialPoints] = useState<Point[]>([]);
  const [routeSelections, setRouteSelections] = useState<
    Record<string, number>
  >({});
  const SELECTION_WINDOW = 10 * 60 * 1000; // 10 minutes in milliseconds
  const CONGESTION_THRESHOLD = 10; // Define the threshold for congestion
  const [reversedRoute, setReversedRoute] = useState({
    origin: "",
    destination: "",
  });

  // Fetch shops with onValue for real-time updates
  useEffect(() => {
    const shopsRef = ref(db, "Shops");
    const servicesRef = ref(db, "Services");
    const dinesRef = ref(db, "Dines");
    const emergencyAmenitiesRef = ref(db, "EmergencyAmenities");

    const unsubscribeEmergencyAmenities = onValue(
      emergencyAmenitiesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const emergencyAmenitiesList: any[] = [];
          snapshot.forEach((childSnapshot) => {
            const id = `emergency-amenities-${childSnapshot.key}`;
            const data = childSnapshot.val();
            if (id && data?.title) {
              emergencyAmenitiesList.push({ id: id, title: data.title });
            }
          });
          setShops((prevShops) => [...prevShops, ...emergencyAmenitiesList]);
        }
      }
    );

    const unsubscribeShops = onValue(shopsRef, (snapshot) => {
      if (snapshot.exists()) {
        const shopList: Shop[] = [];
        console.log("Shop data", snapshot.val());
        snapshot.forEach((childSnapshot) => {
          const shopId = `shop-${childSnapshot.key}`;
          const shopData = childSnapshot.val();
          if (shopId && shopData?.title) {
            shopList.push({ id: shopId, title: shopData.title });
          }
        });
        setShops((prevShops) => [...prevShops, ...shopList]);
      }
    });

    const unsubscribeServices = onValue(servicesRef, (snapshot) => {
      if (snapshot.exists()) {
        const serviceList: Shop[] = [];
        console.log("Services daata", snapshot.val());
        snapshot.forEach((childSnapshot) => {
          const serviceId = `service-${childSnapshot.key}`;
          const serviceData = childSnapshot.val();
          if (serviceId && serviceData?.title) {
            serviceList.push({ id: serviceId, title: serviceData.title });
          }
        });
        setShops((prevShops) => [...prevShops, ...serviceList]);
      }
    });

    const unsubscribeDines = onValue(dinesRef, (snapshot) => {
      if (snapshot.exists()) {
        const dineList: Shop[] = [];
        console.log("Dines data", snapshot.val());
        snapshot.forEach((childSnapshot) => {
          const dineId = `dine-${childSnapshot.key}`;
          const dineData = childSnapshot.val();
          if (dineId && dineData?.title) {
            dineList.push({ id: dineId, title: dineData.title });
          }
        });
        setShops((prevShops) => [...prevShops, ...dineList]);
      }
    });

    return () => {
      unsubscribeShops();
      unsubscribeServices();
      unsubscribeDines();
      unsubscribeEmergencyAmenities();
    };
  }, []);

  // Fetch routes with onValue for real-time updates
  useEffect(() => {
    if (!selectedShop || !selectedDestination) return;

    const shopRoutesRef = ref(db, `Routes/${selectedShop}`);
    const destinationRoutesRef = ref(db, `Routes/${selectedDestination}`);

    const unsubscribeShop = onValue(shopRoutesRef, (snapshot) => {
      const shopRoutes = snapshot.exists()
        ? Object.keys(snapshot.val()).filter((route) => {
            const routeData = snapshot.val()[route];
            return (
              (routeData?.origin === selectedShop &&
                routeData?.destination === selectedDestination) ||
              (routeData?.origin === selectedDestination &&
                routeData?.destination === selectedShop)
            );
          })
        : [];

      const unsubscribeDestination = onValue(
        destinationRoutesRef,
        (destinationSnapshot) => {
          const destinationRoutes = destinationSnapshot.exists()
            ? Object.keys(destinationSnapshot.val()).filter((route) => {
                const routeData = destinationSnapshot.val()[route];
                return (
                  (routeData?.origin === selectedShop &&
                    routeData?.destination === selectedDestination) ||
                  (routeData?.origin === selectedDestination &&
                    routeData?.destination === selectedShop)
                );
              })
            : [];

          const combinedRoutes = Array.from(
            new Set(["Select Route", ...shopRoutes, ...destinationRoutes])
          );
          setRoutes(combinedRoutes);
        }
      );

      return () => {
        unsubscribeShop();
        unsubscribeDestination();
      };
    });
  }, [selectedShop, selectedDestination]);

  // Fetch route points with onValue for real-time updates
  useEffect(() => {
    if (!selectedShop && !selectedDestination) {
      setInitialPoints([]);
      return;
    }

    const shopRouteRef = ref(db, `Routes/${selectedShop}/${selectedRoute}`);
    const destinationRouteRef = ref(
      db,
      `Routes/${selectedDestination}/${selectedRoute}`
    );

    const unsubscribeShop = onValue(shopRouteRef, (snapshot) => {
      if (snapshot.exists()) {
        setInitialPoints(snapshot.val().points || []);
      } else {
        const unsubscribeDestination = onValue(
          destinationRouteRef,
          (destinationSnapshot) => {
            if (destinationSnapshot.exists()) {
              setInitialPoints(destinationSnapshot.val().points || []);
            }
          }
        );

        return unsubscribeDestination;
      }
    });

    return () => unsubscribeShop();
  }, [selectedRoute, selectedShop, selectedDestination]);

  // Monitor route selection events for congestion detection
  useEffect(() => {
    const heatmapRef = ref(db, "Heatmap");

    const unsubscribe = onValue(heatmapRef, (snapshot) => {
      if (snapshot.exists()) {
        const now = Date.now();
        const selectionCounts: Record<string, number> = {};

        snapshot.forEach((childSnapshot) => {
          const eventData = childSnapshot.val();
          if (eventData.event === "route_selection" && eventData.timestamp) {
            const routeId = eventData.routeId;
            const eventTime = eventData.timestamp;

            if (now - eventTime <= SELECTION_WINDOW) {
              selectionCounts[routeId] = (selectionCounts[routeId] || 0) + 1;
            }
          }
        });

        setRouteSelections(selectionCounts);
      }
    });

    return () => unsubscribe();
  }, []);

  const showCongestionWarning = () => {
    Modal.warning({
      title: "Route Congestion Warning",
      content: "This route is currently congested. Consider alternatives.",
    });
  };

  const logRouteSelection = (routeId: string) => {
    const heatmapRef = ref(db, "Heatmap");
    push(heatmapRef, {
      event: "route_selection",
      routeId,
      timestamp: Date.now(),
    });

    // Check if the selected route is congested
    if (routeSelections[routeId] >= CONGESTION_THRESHOLD) {
      showCongestionWarning(); // Show the modal dialog
    }
  };

  const onValueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setReversedRoute({ destination: "", origin: "" });
    const { id, value } = event.target;

    if (id === "shop") {
      setSelectedShop(value);
      setSelectedDestination(""); // Reset destination to ensure a fresh selection
      setRoutes([]); // Clear route options temporarily until destination is re-selected
      setInitialPoints([]);
      setSelectedRoute("");
    } else if (id === "destination") {
      setSelectedDestination(value);
      if (selectedDestination && selectedShop) {
        setSelectedShop("");
        setRoutes([]);
        setInitialPoints([]);
        setSelectedDestination("");
        setSelectedRoute("");
      }
    } else if (id === "route") {
      setSelectedRoute(value);
      logRouteSelection(value); // Log the route selection
    }
  };

  const handleReverseRoute = () => {
    if (!selectedShop || !selectedDestination) {
      return console.log("No selected route");
    }

    const origin = reversedRoute.origin || selectedShop;
    const destination = reversedRoute.destination || selectedDestination;

    if (
      origin?.includes("emergency-amenities") ||
      destination?.includes("emergency-amenities")
    ) {
      message.error("Cannot reverse emergency and amenities route");
      return;
    }

    setReversedRoute({
      origin: destination,
      destination: origin,
    });

    setInitialPoints([...initialPoints].reverse());
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 relative z-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Path Finder</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          {/* Dropdown for Shop selection */}
          <div className="mb-4">
            <label
              htmlFor="shop"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Origin:
            </label>
            <select
              id="shop"
              value={reversedRoute.origin || selectedShop}
              onChange={onValueChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Origin</option>
              {shops
                ?.filter((shop) => !shop?.id?.includes("emergency-amenities"))
                ?.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.title}
                  </option>
                ))}
            </select>
          </div>

          <Button
            onClick={handleReverseRoute}
            size="small"
            variant="outlined"
            className="mb-2"
            color="default"
          >
            <ArrowUpwardOutlined className="text-base " />
            <ArrowDownwardOutlined className="text-base " />
          </Button>

          {/* Dropdown for Destination selection */}
          <div className="mb-4">
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Destination:
            </label>
            <select
              id="destination"
              value={reversedRoute.destination || selectedDestination}
              onChange={onValueChange}
              disabled={!selectedShop} // Disable if no shop is selected
              className={`w-full border rounded-lg px-3 py-2 ${
                !selectedShop
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              }`}
            >
              <option value="">
                {reversedRoute.destination
                  ? shops.find((shop) => shop.id === reversedRoute.destination)
                      ?.title
                  : "Select Destination"}
              </option>
              {shops
                .filter((shop) => shop.id !== selectedShop) // Exclude the selected shop from the destination list
                .map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.title}
                  </option>
                ))}
            </select>
          </div>

          {/* Dropdown for Route selection */}
          <div className="mb-6">
            <label
              htmlFor="route"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Route:
            </label>
            <select
              id="route"
              value={selectedRoute}
              onChange={onValueChange}
              disabled={!selectedShop || !selectedDestination} // Disable if origin or destination is not selected
              className={`w-full border rounded-lg px-3 py-2 ${
                !selectedShop || !selectedDestination
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              }`}
            >
              {routes.map((route) => (
                <option key={route} value={route}>
                  {route}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Canvas with map and points */}
        <div className="mb-6">
          <MapCanvas
            imageSrc="/images/map.png"
            // initialPoints={[...initialPoints].reverse()}
            initialPoints={initialPoints}
          />
        </div>
      </div>
    </div>
  );
};

export default PathFinder;
