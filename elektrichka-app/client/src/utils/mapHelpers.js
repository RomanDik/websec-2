import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Style, Icon } from 'ol/style';

export function getSourceFromVectorLayerByName(mapObject, layerName) {
  if (!mapObject) return null;
  
  const vectorLayer = mapObject.getAllLayers().find(layer => 
    layer.get('name') === layerName
  );
  
  if (!vectorLayer) return null;
  
  return vectorLayer.getSource();
}

export function addStationMarker(source, station) {
  if (!source || !station.latitude || !station.longitude) return;
  
  const feature = new Feature({
    geometry: new Point(fromLonLat([station.longitude, station.latitude])),
    title: station.title,
    code: station.code
  });
  
  feature.setStyle(new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: '/icons/marker.png',
      scale: 0.8
    })
  }));
  
  source.addFeature(feature);
}

export function clearMarkers(source) {
  if (!source) return;
  source.clear();
}