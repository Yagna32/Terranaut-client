import React, { useEffect, useRef, useState } from "react";
import './css/StreetView.css'
// import { PositionContext } from "./Context/PositionContext";

const StreetView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const panoRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null); // Store map instance
  const [mapZoom, setMapZoom] = useState(false);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  // const {position, generateRandomLocation} = useContext(PositionContext)
  const mapZoomHandler = () => {
    setMapZoom(!mapZoom);
  };

  // Initialize the map only once when the component mounts
  useEffect(() => {
    // Ensure the Google Maps API is loaded
    if (!window.google) return;
    // const fenway = generateRandomLocation();
    const fenway = { lat: 42.345573, lng: -71.098326 }
    console.log(fenway)
    // Initialize the map
    mapInstance.current = new google.maps.Map(mapRef.current as HTMLElement, {
      center: fenway,
      zoom: 1,
      disableDefaultUI: true, // Disable all default UI controls
      zoomControl: false, // Optional: If you want zoom controls
      restriction: {
        latLngBounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(-85, -180), // Southwest coordinates
          new google.maps.LatLng(85, 180) // Northeast coordinates
        ),
      },
    });

    // Initialize the Street View
    const panorama = new google.maps.StreetViewPanorama(
      panoRef.current as HTMLElement,
      {
        position: fenway,
        fullscreenControl: false, // Disable fullscreen control for street view
        addressControl: false, // Disable address control
        linksControl: false, // Disable links control
        panControl: false, // Disable pan control
        showRoadLabels: false,
        zoomControl: false,
      }
    );

    // Set the panorama in the map's Street View
    mapInstance.current.setStreetView(panorama);
  }, []); // Empty dependency array ensures this effect runs only once

  // Manage event listener for `dblclick` when mapZoom is true
  useEffect(() => {
    if (!mapInstance.current || !mapZoom) return;

    // Add the `dblclick` event listener
    const dblClickListener = google.maps.event.addListener(mapInstance.current, 'click', (event:google.maps.MapMouseEvent) => {
      console.log(typeof event);

      // Get the latitude and longitude of the clicked location
      const lat = event.latLng?.lat();
      const lng = event.latLng?.lng();

      // Remove the existing marker if any
      if (marker) {
        marker.setMap(null); // This removes the previous marker from the map
      }

      // Create a new marker at the clicked location
      const newMarker = new google.maps.Marker({
        position: event.latLng,
        map: mapInstance.current!,
      });

      // Update the marker state
      setMarker(newMarker);

      // Log the latitude and longitude to the console
      console.log(`Clicked location: ${lat}, ${lng}`);
    });

    // Clean up the event listener when mapZoom becomes false or on unmount
    return () => {
      google.maps.event.removeListener(dblClickListener);
    };
  }, [mapZoom, marker]); // Run when mapZoom or marker changes

  return (
    <div className="game" style={{ position: 'relative', height: '100vh' }}>
      <div
        id="pano"
        ref={panoRef}
        style={{ width: '94rem', height: '100vh', position: 'absolute', marginLeft: '10px' }}
      />
      <div
        id="map"
        ref={mapRef}
        style={{
          width: mapZoom ? '650px' : '304px',
          height: mapZoom ? '400px' : '200px',
          position: 'relative',
          marginLeft: mapZoom ? '122.7vh' : '172vh',
          bottom: mapZoom ? '-42.5%' : '-71%',
          zIndex: 1000, // Ensure it's on top of the Street View
          border: '2px solid white', // Optional: Add border for better visibility
        }}
        onClick={mapZoom ? undefined : mapZoomHandler}
      />
      {mapZoom && (
        <button
          style={{
            position: 'absolute',
            top: '43%',
            right: '1px',
            zIndex: 1001,
            cursor: 'pointer',
            backgroundColor: 'red',
            opacity: 0.8,
            borderRadius: '0px',
          }}
          onClick={mapZoomHandler}
        >
          X
        </button>
      )}
    </div>
  );
};

export default StreetView;
