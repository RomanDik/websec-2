import React, { useEffect, useState } from 'react';
import StationSearch from './components/StationSearch';
import MapView from './components/MapView';
import ScheduleList from './components/ScheduleList';
import RouteSearch from './components/RouteSearch';
import { getStationSchedule, getRouteSchedule, loadStationsList } from './api/yandexRasp';

export default function App() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [routeSchedule, setRouteSchedule] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStationsList().then(setStations).catch(console.error);
    window.__stationsCache = stations;
  }, []);

  // Загрузка расписания станции
  const loadStationSchedule = async (station) => {
    setLoading(true);
    try {
      const data = await getStationSchedule(station.code);
      setSchedule(data);
      setSelectedStation(station);
    } catch (err) {
      alert('Ошибка загрузки расписания');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка маршрута между станциями
  const loadRouteSchedule = async (from, to) => {
    setLoading(true);
    try {
      const data = await getRouteSchedule(from.code, to.code);
      setRouteSchedule(data);
    } catch (err) {
      alert('Ошибка загрузки маршрута');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-3">
      <h1 className="h4 mb-3">⚡ Прибывалка: Электрички</h1>
      
      {/* Поиск станции */}
      <StationSearch onSelect={loadStationSchedule} />
      
      {/* Карта */}
      <MapView 
        onStationSelect={(coords) => {
          const nearest = stations.reduce((prev, curr) => {
            const dPrev = distance(coords, prev);
            const dCurr = distance(coords, curr);
            return dCurr < dPrev ? curr : prev;
          });
          if (nearest) loadStationSchedule(nearest);
        }}
        stations={stations}
      />
      
      {/* Поиск маршрута между станциями */}
      <RouteSearch stations={stations} onSearch={loadRouteSchedule} />
      
      {/* Расписание станции */}
      {selectedStation && (
        <ScheduleList 
          segments={schedule} 
          title={`🚉 Расписание: ${selectedStation.title}`} 
        />
      )}
      
      {/* Расписание маршрута */}
      {routeSchedule.length > 0 && (
        <ScheduleList 
          segments={routeSchedule} 
          title="🔁 Маршрут между станциями" 
        />
      )}
      
      {loading && <div className="text-center py-3">⏳ Загрузка...</div>}
    </div>
  );
}

// Простая формула расстояния
function distance(a, b) {
  if (!a?.lat || !b?.latitude) return Infinity;
  const dx = (a.lon || a.longitude) - (b.longitude);
  const dy = (a.lat || a.latitude) - (b.latitude);
  return Math.sqrt(dx*dx + dy*dy);
}