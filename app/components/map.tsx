import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function SpotMap() {
  const containerStyle = {
    margin: "auto",
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 37.772,
    lng: -122.214,
  };

  const MARKER_POSITION: google.maps.LatLngLiteral = {
    lat: 37.772,
    lng: -122.214,
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    //find a way around this at some point ...
    googleMapsApiKey: "",
  });

  return (
    <div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          //onLoad={onLoad}
          //onUnmount={onUnmount}
        >
          {/* Child components, such as markers, info windows, etc. */}
          <Marker position={MARKER_POSITION} />
          <Marker
            position={{
              lat: 37.771,
              lng: -122.214,
            }}
          />
          <Marker
            position={{
              lat: 37.77,
              lng: -122.214,
            }}
          />
        </GoogleMap>
      ) : (
        <p>Map loading</p>
      )}
    </div>
  );
}
