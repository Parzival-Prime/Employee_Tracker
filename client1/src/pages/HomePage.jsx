import { useState, useEffect } from 'react';

function HomePage() {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [location, setLocation] = useState({ lng: null, lat: null });

  useEffect(() => {
    // Load HERE Maps script dynamically and initialize map
    const loadHereMapScript = () => {
      const script = document.createElement('script');
      script.src = 'https://js.api.here.com/v3/3.1/mapsjs-core.js';
      script.async = true;
      script.onload = () => {
        const additionalScript1 = document.createElement('script');
        additionalScript1.src = 'https://js.api.here.com/v3/3.1/mapsjs-service.js';
        additionalScript1.async = true;
        additionalScript1.onload = () => {
          const additionalScript2 = document.createElement('script');
          additionalScript2.src = 'https://js.api.here.com/v3/3.1/mapsjs-ui.js';
          additionalScript2.async = true;
          additionalScript2.onload = () => {
            const additionalScript3 = document.createElement('script');
            additionalScript3.src = 'https://js.api.here.com/v3/3.1/mapsjs-mapevents.js';
            additionalScript3.async = true;
            additionalScript3.onload = () => {
              // Initialize the map after all scripts are loaded
              const platform = new window.H.service.Platform({
                apikey: 'VL9ecENRR3wuUoSiUh92on-jTZUW0XU2Bpg0ghfjhjU', // Replace with your HERE API key
              });

              const defaultLayers = platform.createDefaultLayers();

              const mapContainer = document.getElementById('mapContainer');
              const hMap = new window.H.Map(
                mapContainer,
                defaultLayers.vector.normal.map,
                {
                  zoom: 15,
                  center: { lng: location.lng || 0, lat: location.lat || 0 },
                }
              );

              const behavior = new window.H.mapevents.Behavior(
                new window.H.mapevents.MapEvents(hMap)
              );

              const ui = window.H.ui.UI.createDefault(hMap, defaultLayers);

              setMap(hMap);
            };
            document.body.appendChild(additionalScript3);
          };
          document.body.appendChild(additionalScript2);
        };
        document.body.appendChild(additionalScript1);
      };
      document.body.appendChild(script);
    };

    loadHereMapScript();

    // Cleanup function to remove the map and scripts
    return () => {
      if (map) {
        map.dispose();
      }
      // Optionally remove script elements from the DOM
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  useEffect(() => {
    if (!map) return;

    // Geolocation logic to get user's position
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLocation({ lng, lat });
            updateMap(lng, lat);
          },
          (error) => {
            console.error('Error getting location', error);
          },
          { enableHighAccuracy: true, timeout: 50000, maximumAge: 0 }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    };

    const trackUserLocation = () => {
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLocation({ lng, lat });
            updateMap(lng, lat);
          },
          (error) => {
            console.error('Error tracking location', error);
          },
          { enableHighAccuracy: true, timeout: 50000, maximumAge: 0 }
        );

        // Cleanup function to stop watching position
        return () => {
          navigator.geolocation.clearWatch(watchId);
        };
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    };

    getUserLocation();
    const stopTracking = trackUserLocation();

    // Cleanup function
    return () => {
      if (stopTracking) {
        stopTracking();
      }
    };
  }, [map]);

  const updateMap = (lng, lat) => {
    if (map) {
      if (!marker) {
        const hMarker = new window.H.map.Marker({ lng, lat });
        map.addObject(hMarker);
        setMarker(hMarker);
      } else {
        marker.setGeometry({ lng, lat });
        map.setCenter({ lng, lat });
      }
    }
  };

  return (
    <div>
      <div className="mapContainer" style={{ height: '100vh', width: '100%', overflow: 'hidden', position: 'relative' }}>
        <div id="mapContainer" style={{ height: '100%', width: '100%' }}></div>
      </div>
    </div>
  );
}

export default HomePage;
