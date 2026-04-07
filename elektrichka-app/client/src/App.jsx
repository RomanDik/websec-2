import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
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
    });
  }, []);

  const loadStationSchedule = async (station) => {
    console.log('Загрузка расписания для:', station);
    setLoading(true);
    try {
      const data = await getStationSchedule(station.code);
      console.log('Получено рейсов:', data.length);
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

  return (
    <Container fluid className="py-3">
      <h1 className="h4 mb-3">Прибывалка: Электрички</h1>
      
      <StationSearch 
        stations={stations}
        onSelect={loadStationSchedule} 
      />
      
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
      
      {loading && <Alert variant="info">Загрузка...</Alert>}
      
      {selectedStation && (
        <ScheduleList 
          segments={schedule} 
          station={selectedStation}
        />
      )}
      
      {routeSchedule.length > 0 && (
        <ScheduleList 
          segments={routeSchedule} 
          fromStation={routeSchedule[0]?.from}
          toStation={routeSchedule[0]?.to}
        />
      )}
      
      {selectedStation && schedule.length === 0 && !loading && (
        <Alert variant="warning">
          Нет рейсов для станции {selectedStation.title} (код: {selectedStation.code})
        </Alert>
      )}
    </Container>
  );
}

export default App;