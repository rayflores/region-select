import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Globe } from "lucide-react";
import "./styles/region-select.scss";

const RegionSelect = () => {
  //   console.log("RegionSelect");
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
    <div className="flex items-center justify-center">
      <div className="w-full max-w-1xl p-4 shadow-lg rounded-lg">
        <div className="p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Globe className="h-6 w-6 text-gray-500" />
            <h2 className="text-xxl font-semibold text-gray-500 m-0">
              Select Your Region
            </h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:border-r-2 md:border-gray-600">
            {regions.map((region) => (
              <div
                key={region.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2 lang-select"
                onClick={() => handleRegionSelect(region.id)}
              >
                <div className="font-semibold">{region.name}</div>
                <div className="text-sm text-gray-500">
                  {region.languages.join(", ")}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 border-t-2 border-gray-600 md:border-none">
            <div className="h-auto p-4 flex flex-col items-start gap-2t items-start">
              <div className="font-semibold">Global Headquarters</div>
              <div className="text-sm text-gray-500">
                <p>
                  BARTON International
                  <br />6 Warren Street
                  <br />
                  Glens Falls, NY 12801 USA
                  <br />
                  800-741-7756
                  <br />
                  518-798-5462
                </p>
              </div>
            </div>
            <div className="h-auto p-4 flex flex-col items-start gap-2t items-start">
              <div className="font-semibold">European Headquarters</div>
              <div className="text-sm text-gray-500">
                <p>
                  BARTON International
                  <br />
                  Lindenstrasse 39
                  <br />
                  61250 Usingen
                  <br />
                  Wernborn, Germany
                  <br />
                  +49 6081 4468343
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 p-4">
            All other regions, select Americas.
          </p>
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

