import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Fixing Leaflet default marker issue
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ✅ Custom Icons for Different Types of Locations
const storeIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const studyIcon = new L.Icon({
  iconUrl:
    "https://cdn1.iconfinder.com/data/icons/gradak-education-so-smart-solidarity/32/education-19-512.png", // 🎓 Study Icon URL
  iconSize: [30, 30], // Bigger size for better visibility
  iconAnchor: [15, 30],
  popupAnchor: [0, -25],
});

// ✅ Store & Study Data for Indore
interface Location {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: "store" | "study"; // Type for differentiation
  image: string; // ✅ Added image field
  description: string; // ✅ Added description field
}

const locations: Location[] = [
  {
    id: 1,
    name: "IT Park",
    address: "IT Park, Indore, MP",
    lat: 22.7177,
    lng: 75.8545,
    type: "store",
    image: "/jpgimages/it-park.",
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
    image: "/images/studyicon.webp",
    description: "A popular commercial area with malls, offices, and cafes.",
  },
  {
    id: 3,
    name: "City Center Store",
    address: "City Center, Indore, MP",
    lat: 22.7196,
    lng: 75.85,
    type: "store",
    image:
      "https://media.istockphoto.com/id/539001564/photo/rajwada-palace-indore.jpg?s=1024x1024&w=is&k=20&c=eZdKXL6gU0AhAvpSIkKM4morwpSwUweamSIYDllSwn4=",
    description: "A well-known shopping destination in the heart of Indore.",
  },
  {
    id: 4,
    name: "Rajwada Indore",
    address: "Rajwada, Indore, MP",
    lat: 22.7179,
    lng: 75.8333,
    type: "store",
    image: "/images/rajwada.jpg",
    description: "Historical palace in Indore, famous for its architecture.",
  },
  {
    id: 5,
    name: "IIT Indore",
    address: "IIT, Indore, MP",
    lat: 22.5206,
    lng: 75.9195,
    type: "study",
    image: "/images/iit-indore.jpg",
    description: "A prestigious engineering institute in Indore.",
  },
  {
    id: 6,
    name: "IIM Indore",
    address: "IIM, Indore, MP",
    lat: 22.6833,
    lng: 75.8726,
    type: "study",
    image: "/images/rajwada.jpg",
    description: "Top business school in India, offering MBA programs.",
  },
];

const StoreLocator: React.FC = () => {
  const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null); // ✅ Clicked marker state

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

          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={location.type === "study" ? studyIcon : storeIcon} // 🎓 Custom Icon Logic
              eventHandlers={{
                mouseover: () => setHoveredMarker(location.id), // ✅ Hover pe name/address dikhana
                mouseout: () => setHoveredMarker(null), // ✅ Mouse out hote hi band karna
                click: () => setSelectedMarker(location.id), // ✅ Click pe full info dikhana
              }}
            >
              <Popup>
                {selectedMarker === location.id ? (
                  // ✅ Full details on click (image & description)
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
                ) : hoveredMarker === location.id ? (
                  // ✅ Name & address only on hover
                  <div className="p-2 text-center">
                    <h2 className="font-bold text-lg">{location.name}</h2>
                    <p className="text-sm">{location.address}</p>
                  </div>
                ) : null}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default StoreLocator;
