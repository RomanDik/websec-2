import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';

// Координаты Самарской области
const SAMARA_CENTER = [50.1002, 53.1959]; // [lon, lat]

export default function MapView({ onStationSelect, stations = [] }) {
  const mapRef = useRef(null);
  const vectorSourceRef = useRef(null);

  useEffect(() => {
    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: vectorSource, style: stationStyle })
      ],
      view: new View({
        center: fromLonLat(SAMARA_CENTER),
        zoom: 8,
        minZoom: 6,
        maxZoom: 15
      })
    });

    // Обработчик клика по карте
    map.on('singleclick', (evt) => {
      const coord = evt.coordinate; 
      const lonLat = map.getView().getProjection().getUnits() === 'degrees' 
        ? coord 
        : fromLonLat(coord, 'EPSG:3857', 'EPSG:4326'); 
      onStationSelect?.({ lat: lonLat[1], lon: lonLat[0], fromMap: true });
    });

    return () => map.setTarget(null);
  }, [onStationSelect]);

  // Обновление маркеров станций
  useEffect(() => {
    if (!vectorSourceRef.current) return;
    vectorSourceRef.current.clear();
    
    stations.forEach(station => {
      if (station.latitude && station.longitude) {
        const feature = new Feature({
          geometry: new Point(fromLonLat([station.longitude, station.latitude])),
          title: station.title,
          code: station.code
        });
        feature.setStyle(stationStyle);
        vectorSourceRef.current.addFeature(feature);
      }
    });
  }, [stations]);

  return <div ref={mapRef} className="map-container" style={{ height: '400px', width: '100%' }} />;
}

// Стиль маркера станции
const stationStyle = new Style({
  image: new Icon({
    anchor: [0.5, 1],
    src: 'https://openlayers.org/en/latest/examples/data/icon.png',
    scale: 0.8
  })
});