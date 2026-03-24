import React, { useEffect, useState } from 'react';
import StationSearch from './components/StationSearch';
import MapView from './components/MapView';
import ScheduleList from './components/ScheduleList';
import RouteSearch from './components/RouteSearch';
import { getStationSchedule, getRouteSchedule, loadStationsList } from './api/yandexRasp';

function App() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [routeSchedule, setRouteSchedule] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStationsList().then(stationsList => {
      console.log('Загружено станций:', stationsList.length);
      setStations(stationsList);
      window.__stationsCache = stationsList;
    });
  }, []);

  const loadStationSchedule = async (station) => {
    console.log('Загрузка расписания для:', station);
    setLoading(true);
    try {
      const data = await getStationSchedule(station.code);
      console.log('Получено рейсов:', data.length);
      console.log('Данные:', data);
      setSchedule(data);
      setSelectedStation(station);
      setRouteSchedule([]);
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка загрузки расписания');
    } finally {
      setLoading(false);
    }
  };

  const loadRouteSchedule = async (from, to) => {
    console.log('Загрузка маршрута:', from.title, '→', to.title);
    setLoading(true);
    try {
      const data = await getRouteSchedule(from.code, to.code);
      console.log('Получено маршрутов:', data.length);
      setRouteSchedule(data);
      setSelectedStation(null);
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка загрузки маршрута');
    } finally {
      setLoading(false);
    }
  };

  console.log('App render, selectedStation:', selectedStation?.title, 'schedule.length:', schedule.length);

  return (
    <div className="container-fluid py-3">
      <h1 className="h4 mb-3">Прибывалка: Электрички</h1>
      
      <StationSearch onSelect={loadStationSchedule} />
      
      <RouteSearch 
        stations={stations}
        onSearch={loadRouteSchedule}
      />
      
      <MapView 
        stations={stations}
        onStationSelect={(coords) => {
          console.log('Клик по карте:', coords);
        }}
      />
      
      {loading && <div className="alert alert-info">Загрузка...</div>}
      
      {selectedStation && (
        <ScheduleList 
          segments={schedule} 
          title={'Расписание: ${selectedStation.title}'} 
        />
      )}
      
      {routeSchedule.length > 0 && (
        <ScheduleList 
          segments={routeSchedule} 
          title={`Маршрут: ${routeSchedule[0]?.from?.title} → ${routeSchedule[0]?.to?.title}`} 
        />
      )}
      
      {selectedStation && schedule.length === 0 && !loading && (
        <div className="alert alert-warning">
          Нет рейсов для станции {selectedStation.title} (код: {selectedStation.code})
        </div>
      )}
    </div>
  );
}

export default App;