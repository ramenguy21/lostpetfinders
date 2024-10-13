import {
  AdvancedMarker,
  APILoadingStatus,
  Map,
  useApiLoadingStatus,
} from "@vis.gl/react-google-maps";
import { useEffect } from "react";

import pawIcon from "../assets/icons/paw.svg";

interface SpotMapProps {
  spots: google.maps.LatLngLiteral[];
}

export default function SpotMap({ spots }: SpotMapProps) {
  const status = useApiLoadingStatus();

  useEffect(() => {
    if (status === APILoadingStatus.FAILED) {
      console.log("Failed to load google maps API.");
    }
    return;
  }, [status]);

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const defaultCenter = {
    lat: 37.772,
    lng: -122.214,
  };

  function renderMarkers() {
    switch (spots.length) {
      case 0:
        return null;
      case 1:
        return (
          <AdvancedMarker key={0} position={spots[0]}>
            <span>
              <img className="rounded bg-primary p-1" src={pawIcon} alt="" />
            </span>
          </AdvancedMarker>
        );
      default:
        return spots.map((spot, idx) => {
          return (
            <AdvancedMarker key={idx} position={spot}>
              <span>
                <img className="rounded bg-primary p-1" src={pawIcon} alt="" />
              </span>
            </AdvancedMarker>
          );
        });
    }
  }

  return (
    <div>
      <Map
        defaultCenter={defaultCenter}
        mapId="main"
        defaultZoom={3}
        gestureHandling={"greedy"}
        controlled={false}
        style={containerStyle}
      >
        {renderMarkers()}
      </Map>
    </div>
  );
}
