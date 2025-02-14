import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Globe } from "lucide-react";
import "./styles/region-select.scss";

const RegionSelect = () => {
  console.log("RegionSelect");
  const [loading, setLoading] = useState(false);

  const regions = [
    {
      id: "na",
      name: "Americas",
      languages: ["English"],
    },
    {
      id: "it",
      name: "Italy",
      languages: ["Italian"],
    },
    {
      id: "fr",
      name: "France",
      languages: ["French"],
    },
    {
      id: "de",
      name: "Germany",
      languages: ["German"],
    },
    {
      id: "es",
      name: "Spain",
      languages: ["Spanish"],
    },
    {
      id: "uk",
      name: "United Kingdom",
      languages: ["English"],
    },
  ];

  const handleRegionSelect = async (regionId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${wpData.restUrl}region-select/v1/set-region`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": wpData.nonce,
          },
          body: JSON.stringify({ region: regionId }),
        }
      );

      if (response.ok) {
        // Redirect to home page after setting cookie
        window.location.href = wpData.homeUrl + "/?region=" + regionId;
      }
    } catch (error) {
      console.error("Error setting region:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Globe className="h-6 w-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-700">
              Select Your Region
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map((region) => (
            <div
              key={region.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => handleRegionSelect(region.id)}
            >
              <div className="font-semibold">{region.name}</div>
              <div className="text-sm text-gray-500">
                {region.languages.join(", ")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Initialize the React app
const container = document.getElementById("region-select-root");
if (container) {
  const root = createRoot(container);
  root.render(<RegionSelect />);
}

