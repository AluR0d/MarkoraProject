/* eslint-disable import/no-duplicates */
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { LatLng, LatLngExpression } from 'leaflet';
import { useEffect } from 'react';
import { Place } from '../../types/Place';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

type Props = {
  place: Place;
  onUpdate: (updated: Place) => void;
};

function ClickHandler({ onClick }: { onClick: (coords: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

function AutoRecenter({ coords }: { coords: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords);
  }, [coords, map]);
  return null;
}

export default function PlaceMap({ place, onUpdate }: Props) {
  const coords = place.coords?.coordinates;
  if (!coords || coords.length < 2) return null;

  const position: LatLngExpression = [coords[1], coords[0]];

  const handleMapClick = (latlng: LatLng) => {
    const updatedPlace = {
      ...place,
      coords: {
        type: 'Point' as const,
        coordinates: [latlng.lng, latlng.lat] as [number, number],
      },
    };
    onUpdate(updatedPlace);
  };

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={false}
      className="mt-6 rounded-md shadow border border-gray-200"
      style={{ height: '300px', width: '100%' }}
    >
      <AutoRecenter coords={position} />
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onClick={handleMapClick} />
      <Marker position={position}>
        <Popup>
          {place.name || 'Lugar'}
          <br />
          {place.address || ''}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
