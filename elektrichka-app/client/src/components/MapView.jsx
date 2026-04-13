import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { Style, Icon } from 'ol/style';
import { getSourceFromVectorLayerByName, clearMarkers, addStationMarker } from '../utils/mapHelpers';

const MAP_CENTER = [
  parseFloat(process.env.REACT_APP_MAP_CENTER_LON),
  parseFloat(process.env.REACT_APP_MAP_CENTER_LAT)
];

const MAP_ZOOM = parseInt(process.env.REACT_APP_MAP_ZOOM);

export default function MapView({ stations = [] }) {
  const mapRef = useRef(null);
  const vectorSourceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource;

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: '/icons/marker.png', 
          scale: 0.8
        })
      })
    });

    vectorLayer.set('name', 'stations');

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat(MAP_CENTER),
        zoom: MAP_ZOOM,
        minZoom: 6,
        maxZoom: 16
      })
    });

    mapRef.current.map = map;

    return () => {
      map.setTarget(null);
    };
    
  }, []); 

  useEffect(() => {
    if (!vectorSourceRef.current) return;
    
    clearMarkers(vectorSourceRef.current);
    
    stations.forEach(station => {
      addStationMarker(vectorSourceRef.current, station);
    });
  }, [stations]); 

  return (
    <div 
      ref={mapRef} 
      className="map-container mb-3"
      style={{ 
        height: '400px', 
        width: '100%',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }} 
    />
  );
}