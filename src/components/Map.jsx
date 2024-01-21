import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "./../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);

  // Get your geolocation
  const {
    isLoading: isLoadingPostion,
    position: geolocationPostion,
    getPosition,
    resetGeolocationPosition,
  } = useGeolocation();

  // current selected city from query params
  const [mapLat, mapLng] = useUrlPosition();

  useEffect(
    function () {
      // To synchronize
      if (mapLat && mapLng) {
        setMapPosition([mapLat, mapLng]);
      }
    },
    [mapLat, mapLng]
  );

  // synchronize mapPosition with geolocationPosition
  useEffect(
    function () {
      if (geolocationPostion) {
        setMapPosition([geolocationPostion.lat, geolocationPostion.lng]);
      }

      return resetGeolocationPosition;
    },
    [geolocationPostion, resetGeolocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geolocationPostion && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPostion ? "Loading..." : "Use Your Position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          return (
            <Marker
              position={[city.position.lat, city.position.lng]}
              key={city.id}
            >
              <Popup>
                <span>{city.emoji}</span>
                <span>{city.cityName}</span>
              </Popup>
            </Marker>
          );
        })}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

// This function sets the map to display the map-view that the position is pointing to
function ChangeCenter({ position }) {
  // Current instance of the map being displayed
  const map = useMap();
  map.setView(position);
  return null;
}

// This function sets the lat & lng as the global query statess
function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
