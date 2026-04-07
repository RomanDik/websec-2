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
import { Style, Icon, Fill, Stroke, Text } from 'ol/style';

const MAP_CENTER = [
  parseFloat(process.env.REACT_APP_MAP_CENTER_LON),
  parseFloat(process.env.REACT_APP_MAP_CENTER_LAT)
];

const MAP_ZOOM = parseInt(process.env.REACT_APP_MAP_ZOOM);

export default function MapView({ onStationSelect, stations = [] }) {
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
          src: 'https://openlayers.org/en/latest/examples/data/icon.png',
          scale: 0.8
        }),
        text: new Text({
          text: '',
          offsetY: -25,
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
          font: '12px sans-serif'
        })
      })
    });

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

          feature.setStyle(new Style({
            image: new Icon({
              anchor: [0.5, 1],
              src: 'https://openlayers.org/en/latest/examples/data/icon.png',
              scale: 0.8
            })
          }));
          
          vectorSourceRef.current.addFeature(feature);
        }
      });
    }, [stations]);
    
  }, []);

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