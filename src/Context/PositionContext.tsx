import { createContext, ReactNode, useState } from "react";

export const PositionContext = createContext({})

interface Props {
  children: ReactNode;
}

const PositionContextProvider = (props:Props) => {
    const [position, setPosition] = useState({ lat: 42.345573, lng: -71.098326 })

    const generateRandomLocation = () => {
        const lat = (Math.random() * 180 - 90);  // Random latitude between -90 and 90
        const lng = Math.random() * 360 - 180;
        const streetViewService = new google.maps.StreetViewService();
        const randomLatLng = {lat, lng};
        streetViewService.getPanorama(
            { location: randomLatLng, radius: 50000 }, // Search within 50km for nearby street view imagery
            (data, status) => {
              if (status === google.maps.StreetViewStatus.OK && data) {
                // If valid Street View location is found
                console.log("Found Street View at: ", randomLatLng);
              } else {
                console.log("Street View not found, retrying...");
                // Retry if Street View is not found
                generateRandomLocation();
              }
            }
          );
          return randomLatLng
          //return { lat: 43.45571852913395, lng: -71.098326 }
    }


    return (
        <PositionContext.Provider value={{ position, setPosition, generateRandomLocation }}>
            {props.children}
        </PositionContext.Provider>
        );
}

export default PositionContextProvider