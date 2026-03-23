import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/rasp'; 

// Расписание по станции (только электрички)
export async function getStationSchedule(stationCode, date = null) {
  const params = {
    format: 'json',
    lang: 'ru_RU',
    station: stationCode, 
    transport_types: 'suburban', 
    event: 'departure'
  };
  if (date) params.date = date;
  
  const { data } = await axios.get(`${API_BASE}/schedule`, { params });
  return data.segments || [];
}

// Расписание между двумя станциями
export async function getRouteSchedule(fromCode, toCode, date = null) {
  const params = {
    format: 'json',
    lang: 'ru_RU',
    from: fromCode,
    to: toCode,
    transport_types: 'suburban' 
  };
  if (date) params.date = date;
  
  const { data } = await axios.get(`${API_BASE}/search`, { params });
  return data.segments || [];
}

// Загрузка списка станций
export async function loadStationsList() {
  const { data } = await axios.get(`${API_BASE}/stations_list`, {
    params: { format: 'json', lang: 'ru_RU' }
  });
  
  return extractSamaraStations(data.countries);
}

function extractSamaraStations(countries) {
  const stations = [];
  const russia = countries?.find(c => c.title === 'Россия');
  if (!russia) return [];
  
  const samaraRegion = russia.regions?.find(r => r.title === 'Самарская область');
  if (!samaraRegion) return [];
  
  samaraRegion.settlements?.forEach(settlement => {
    settlement.stations?.forEach(station => {
      if (station.transport_type === 'suburban' || station.transport_type === 'Поезд') {
        stations.push({
          code: station.codes?.yandex_code,
          title: station.title,
          latitude: station.latitude,
          longitude: station.longitude,
          direction: station.direction,
          type: station.station_type
        });
      }
    });
  });
  
  return stations;
}