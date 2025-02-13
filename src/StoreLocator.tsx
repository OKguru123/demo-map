import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Fixing Leaflet default marker issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ✅ Custom Icons
const storeIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const studyIcon = new L.Icon({
  iconUrl:
    "https://cdn1.iconfinder.com/data/icons/gradak-education-so-smart-solidarity/32/education-19-512.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -25],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -25],
  shadowUrl: markerShadow,
});

// ✅ Store & Study Data for Indore
interface Location {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: "store" | "study";
  image: string;
  description: string;
}

const locations: Location[] = [
  {
    id: 1,
    name: "IT Park",
    address: "IT Park, Indore, MP",
    lat: 22.7177,
    lng: 75.8545,
    type: "store",
    image: "/images/itpark.avif",
    description:
      "One of the biggest IT hubs in Indore with many tech companies.",
  },
  {
    id: 2,
    name: "Vijay Nagar",
    address: "Vijay Nagar, Indore, MP",
    lat: 22.732,
    lng: 75.834,
    type: "store",
    image: "/images/vijaynagr.jpg",
    description: "A popular commercial area with malls, offices, and cafes.",
  },
  {
    id: 5,
    name: "IIT Indore",
    address: "IIT, Indore, MP",
    lat: 22.5206,
    lng: 75.9195,
    type: "study",
    image: "/images/iit.jpg",
    description: "A prestigious engineering institute in Indore.",
  },
  {
    id: 6,
    name: "IIM Indore",
    address: "IIM, Indore, MP",
    lat: 22.6833,
    lng: 75.8726,
    type: "study",
    image: "/images/iim.jpeg",
    description: "Top business school in India, offering MBA programs.",
  },
];

// ✅ Component for Smooth Zoom Effect
const MapZoom: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { duration: 3 }); // 🎥 Smooth zoom-in
    }
  }, []);

  return null;
};

const StoreLocator: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [placeName, setPlaceName] = useState<string>("Fetching...");
  const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);

  // ✅ Fetch User's Current Location
  useEffect(() => {
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude, "latitude logitude");
          setUserLocation([latitude, longitude]);

          // 🌍 Fetch Place Name (Reverse Geocoding)
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const address = data.address;
            let mostAccuratePlace =
              address.village ||
              address.town ||
              address.city ||
              address.county ||
              address.state ||
              "Unknown Location";

            setPlaceName(data.display_name || "Unknown Location");
          } catch (error) {
            console.error("Error fetching location name:", error);
            setPlaceName("Location not found");
          }
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    };

    getLocation();

    const interval = setInterval(getLocation, 5000); // 🔄 Update every 5 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">
        Store & Study Locator - Indore
      </h1>
      <div className="w-full max-w-4xl h-[75vh]">
        <MapContainer
          center={[22.7177, 75.8545]}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full rounded-lg shadow-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ✅ User Location Marker */}
          {/* ✅ User Location Marker with Red Circle */}
          {userLocation && (
            <>
              <MapZoom position={userLocation} />

              {/* 🔴 Red Circle for User Location */}
              <Circle
                center={userLocation}
                radius={100} // Radius in meters
                pathOptions={{
                  color: "red",
                  fillColor: "red",
                  fillOpacity: 0.3,
                }}
              />

              {/* 📍 User Marker */}
              <Marker position={userLocation} icon={userIcon}>
                <Popup>
                  📍 Your Current Location: <b>{placeName}</b>
                </Popup>
              </Marker>
            </>
          )}

          {/* ✅ Markers for Stores & Study Locations */}
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={location.type === "study" ? studyIcon : storeIcon}
              eventHandlers={{
                mouseover: () => setHoveredMarker(location.id),
                mouseout: () => setHoveredMarker(null),
                click: () => setSelectedMarker(location.id),
              }}
            >
              {/* ✅ Popup for Hover Effect */}
              {hoveredMarker === location.id &&
                selectedMarker !== location.id && (
                  <Popup>
                    <div className="p-2 text-center">
                      <h2 className="font-bold text-lg">{location.name}</h2>
                      <p className="text-sm">{location.address}</p>
                    </div>
                  </Popup>
                )}

              {/* ✅ Popup for Click Effect */}
              {selectedMarker === location.id && (
                <Popup>
                  <div className="p-2 text-center">
                    <h2 className="font-bold text-lg">{location.name}</h2>
                    <p className="text-sm">{location.address}</p>
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-32 object-cover rounded-md my-2"
                    />
                    <p className="text-sm text-gray-600">
                      {location.description}
                    </p>
                  </div>
                </Popup>
              )}
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default StoreLocator;
