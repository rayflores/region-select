import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Globe } from "lucide-react";
import "./styles/region-select.scss";

const RegionSelect = () => {
  //   console.log("RegionSelect");
  const [loading, setLoading] = useState(false);
  const [loadingRegion, setLoadingRegion] = useState(null);
  const [showDiv, setShowDiv] = useState(false);

  // Function to check if the region cookie exists
  const checkRegionCookie = () => {
    const cookies = document.cookie.split(";");
    const regionCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("selectedRegion=")
    );

    if (regionCookie) {
      const regionValue = regionCookie.split("=")[1];
      return regionValue;
    }

    return null;
  };

  useEffect(() => {
    // Dynamically detect and set header height
    const detectHeaderHeight = () => {
      const header = document.querySelector(
        "header, .fusion-header-wrapper, .site-header, #masthead, .header"
      );
      if (header) {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty(
          "--header-height",
          `${headerHeight}px`
        );
      }
    };

    detectHeaderHeight();
    // Re-detect on window resize
    window.addEventListener("resize", detectHeaderHeight);

    // Check for existing region cookie when component mounts
    const existingRegion = checkRegionCookie();

    // If we have a valid cookie, redirect immediately instead of showing the selector
    if (existingRegion) {
      if (existingRegion === "na") {
        // For North America, redirect to clean home page
        window.location.href = wpData.homeUrl;
        return;
      } else if (existingRegion === "uk") {
        window.location.href = "https://bartongarnet.com/?lang=en";
        return;
      } else {
        // For other regions, redirect to home page with lang param
        window.location.href =
          "https://bartongarnet.com/?lang=" + existingRegion;
        return;
      }
    }

    // Only show the selector if no cookie exists and geoselection param is present
    const urlParams = new URLSearchParams(window.location.search);
    const geoselectionParam = urlParams.get("geoselection");

    console.log("Current URL:", window.location.href);
    console.log("Geoselection param:", geoselectionParam);
    console.log("Existing region cookie:", existingRegion);
    console.log("wpData:", wpData);

    if (geoselectionParam && !existingRegion) {
      console.log("Showing region selector");
      setShowDiv(true);
    } else {
      console.log("NOT showing region selector");
      setShowDiv(false);
    }

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", detectHeaderHeight);
    };
  }, []); // Added dependency array to run only on mount

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
    console.log("handleRegionSelect called with:", regionId);
    setLoading(true);
    setLoadingRegion(regionId);
    try {
      console.log(
        "Making REST API call to:",
        `${wpData.restUrl}region-select/v1/set-region`
      );
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

      console.log("Response status:", response.status);
      if (response.ok) {
        console.log("REST API response successful");
        // Set cookie on frontend to ensure it's immediately available
        const domain = window.location.hostname;
        const cookieString = `selectedRegion=${regionId}; path=/; domain=${domain}; max-age=${
          30 * 24 * 60 * 60
        }`;
        console.log("Setting cookie:", cookieString);
        document.cookie = cookieString;

        setTimeout(() => {
          if (regionId === "na") {
            // Redirect to home page after setting cookie (remove geoselection param)
            console.log("Redirecting to:", wpData.homeUrl);
            window.location.href = wpData.homeUrl;
          } else if (regionId === "uk") {
            window.location.href = "https://bartongarnet.com/?lang=en";
          } else {
            // Redirect to home page after setting cookie
            window.location.href = "https://bartongarnet.com/?lang=" + regionId;
          }
        }, 200);
      }
    } catch (error) {
      console.error("Error setting region:", error);
      setLoading(false);
      setLoadingRegion(null);
    }
    // Note: We don't set loading to false here because we're redirecting
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
                    className="h-auto pe-0 p-2 flex flex-col gap-2 lang-select text-center md:text-end cursor-pointer transition-all duration-200 md:hover:bg-gray-100 md:hover:font-semibold md:hover:shadow-md md:hover:rounded-lg md:hover:scale-105 relative"
                    style={{ "--hover-color": "#c20430" }}
                    onMouseEnter={(e) => (e.target.style.color = "#c20430")}
                    onMouseLeave={(e) => (e.target.style.color = "")}
                    onClick={() => handleRegionSelect("na")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {loadingRegion === "na" ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-red-600 rounded-full"></div>
                          <span>Redirecting...</span>
                        </>
                      ) : (
                        "English"
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 border-t-2 border-gray-600 md:border-none">
                <div className="h-auto ps-0 md:ps-5 flex flex-col gap-2 text-center md:text-start">
                  <div className="font-semibold">Europe</div>
                  {regions.map((region) => (
                    <div key={region.id} className="">
                      <div
                        className="h-auto md:ps-0 p-2 flex flex-col gap-2 lang-select text-center md:text-start cursor-pointer transition-all duration-200 md:hover:bg-gray-100 md:hover:font-semibold md:hover:shadow-md md:hover:rounded-lg md:hover:scale-105 relative"
                        style={{ "--hover-color": "#c20430" }}
                        onMouseEnter={(e) => (e.target.style.color = "#c20430")}
                        onMouseLeave={(e) => (e.target.style.color = "")}
                        onClick={() => handleRegionSelect(region.id)}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {loadingRegion === region.id ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-red-600 rounded-full"></div>
                              <span>Redirecting...</span>
                            </>
                          ) : (
                            region.languages.join(", ")
                          )}
                        </div>
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
