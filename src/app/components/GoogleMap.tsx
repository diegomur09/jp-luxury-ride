
// NOTE: You must load the Google Maps JS API script with Directions service before using this component.
import React, { useEffect, useRef } from "react";

interface GoogleMapProps {
  pickup: string;
  dropoff: string;
  stops: string[];
}

const GoogleMap: React.FC<GoogleMapProps> = ({ pickup, dropoff, stops }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  // Use 'any' to avoid TS errors if @types/google.maps is not installed
  const directionsRendererRef = useRef<any>(null);

  useEffect(() => {
    // @ts-ignore
    const gmaps = (window as any).google?.maps;
    if (!gmaps || !mapRef.current) return;
    const map = new gmaps.Map(mapRef.current, {
      zoom: 10,
      center: { lat: 35.6895, lng: 139.6917 }, // Default to Tokyo
    });
    if (!pickup || !dropoff) return;
    const directionsService = new gmaps.DirectionsService();
    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new gmaps.DirectionsRenderer();
    }
    directionsRendererRef.current.setMap(map);
    const waypoints = stops.filter(Boolean).map(address => ({ location: address, stopover: true }));
    directionsService.route(
      {
        origin: pickup,
        destination: dropoff,
        waypoints,
        travelMode: gmaps.TravelMode.DRIVING,
      },
      (result: any, status: string) => {
        if (status === "OK" && result) {
          directionsRendererRef.current!.setDirections(result);
        }
      }
    );
  }, [pickup, dropoff, stops]);

  return <div ref={mapRef} style={{ width: "100%", height: 400 }} />;
};

export default GoogleMap;
