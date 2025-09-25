import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Globe } from "lucide-react";
import "./styles/region-select.scss";

const RegionSelect = () => {
  //   console.log("RegionSelect");
  const [loading, setLoading] = useState(false);
  const [showDiv, setShowDiv] = useState(false);

  useEffect(() => {
    // check url for region query param
    const urlParams = new URLSearchParams(window.location.search);
    const region = urlParams.get("region-select");
    if (region) {
      console.log("region", region);
      setShowDiv(true);
    } else {
      setShowDiv(false);
    }
  });

  const regions = [
    {
      id: "uk",
      name: "United Kingdom",
      languages: ["English"],
    },
    {
      id: "fr",
      name: "France",
      languages: ["French / Français"],
    },
    {
      id: "de",
      name: "Germany",
      languages: ["German / Deutsch"],
    },
    {
      id: "it",
      name: "Italy",
      languages: ["Italian / Italiano"],
    },
    {
      id: "es",
      name: "Spain",
      languages: ["Spanish / Español"],
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
        if (regionId === "na") {
          // Redirect to home page after setting cookie
          window.location.href = wpData.homeUrl;
        } else if (regionId === "uk") {
          window.location.href = "https://staging2.bartongarnet.com/?lang=en";
        } else {
          // Redirect to home page after setting cookie
          window.location.href =
            "https://staging2.bartongarnet.com/?lang=" + regionId;
        }
      }
    } catch (error) {
      console.error("Error setting region:", error);
    }
    setLoading(false);
  };

  if (!showDiv) {
    return <div className="hidden"></div>;
  }

  return (
    <>
      <div className="top">
        <div className="flex items-center justify-center ">
          <div className="p-4">
            <div className="p-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Globe className="h-6 w-6 text-gray-500" />
                <h2 className="text-xxl font-semibold text-gray-500 m-0">
                  Select Region/Language
                </h2>
              </div>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-0 justify-center md:justify-end">
              <div className="grid grid-cols-1 gap-4 md:border-r-2 md:border-gray-600">
                <div className="h-auto pe-0 md:pe-5 flex flex-col gap-2 text-center md:text-end">
                  <div className="font-semibold">Americas</div>
                  <div
                    className="h-auto pe-0 p-2 flex flex-col gap-2 lang-select text-center md:text-end cursor-pointer transition-all duration-200 md:hover:bg-gray-100 md:hover:font-semibold md:hover:shadow-md md:hover:rounded-lg md:hover:scale-105"
                    style={{ "--hover-color": "#c20430" }}
                    onMouseEnter={(e) => (e.target.style.color = "#c20430")}
                    onMouseLeave={(e) => (e.target.style.color = "")}
                    onClick={() => handleRegionSelect("na")}
                  >
                    English
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 border-t-2 border-gray-600 md:border-none">
                <div className="h-auto ps-0 md:ps-5 flex flex-col gap-2 text-center md:text-start">
                  <div className="font-semibold">Europe</div>
                  {regions.map((region) => (
                    <div key={region.id} className="">
                      <div
                        className="h-auto md:ps-0 p-2 flex flex-col gap-2 lang-select text-center md:text-start cursor-pointer transition-all duration-200 md:hover:bg-gray-100 md:hover:font-semibold md:hover:shadow-md md:hover:rounded-lg md:hover:scale-105"
                        style={{ "--hover-color": "#c20430" }}
                        onMouseEnter={(e) => (e.target.style.color = "#c20430")}
                        onMouseLeave={(e) => (e.target.style.color = "")}
                        onClick={() => handleRegionSelect(region.id)}
                      >
                        {region.languages.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <p className="text-black p-4 m-4 text-center">
                All other regions, select Americas.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom bg-gray-900 bg-opacity-75">
        <div className="flex items-center justify-center ">
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="grid grid-cols-1 gap-4 text-end text-white">
                <div className="font-semibold">Global Headquarters</div>
                <div className="text-sm text-white">
                  <p>
                    BARTON International
                    <br />6 Warren Street
                    <br />
                    Glens Falls, NY 12801 USA
                    <br />
                    +1-800-741-7756
                    <br />
                    +1-518-798-5462
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 m-auto h-full">
                <div class="inline-block h-full min-h-[1em] w-0.5 self-stretch bg-neutral-100 dark:bg-white/10"></div>
              </div>
              <div className="grid grid-cols-1 gap-4 text-start text-white">
                <div className="font-semibold">European Headquarters</div>
                <div className="text-sm text-white">
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
          </div>
        </div>
      </div>
    </>
  );
};

// Initialize the React app
const container = document.getElementById("region-select-root");
if (container) {
  const root = createRoot(container);
  root.render(<RegionSelect />);
}
