import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/rasp';

export async function getStationSchedule(stationCode, date = null) {
  const params = {
    format: 'json',
    lang: 'ru_RU',
    station: stationCode,
    transport_types: 'suburban',
    event: 'departure'
  };
  if (date) params.date = date;
  
  try {
    const { data } = await axios.get(`${API_BASE}/schedule`, { params });
    console.log('📡 Ответ API:', data);
    return data.schedule || [];
  } catch (error) {
    console.error('Ошибка загрузки расписания:', error);
    return [];
  }
}

export async function getRouteSchedule(fromCode, toCode, date = null) {
  const params = {
    format: 'json',
    lang: 'ru_RU',
    from: fromCode,
    to: toCode,
    transport_types: 'suburban'
  };
  if (date) params.date = date;
  
  try {
    const { data } = await axios.get(`${API_BASE}/search`, { params });
    console.log('Ответ API маршрута:', data);
    return data.segments || data.schedule || [];
  } catch (error) {
    console.error('Ошибка загрузки маршрута:', error);
    return [];
  }
}

export async function loadStationsList() {
  console.log('Загрузка stations_list...');
  try {
    const { data } = await axios.get(`${API_BASE}/stations_list`, {
      params: { format: 'json', lang: 'ru_RU' },
      timeout: 120000
    });
    
    const stations = extractSamaraStations(data.countries);
    console.log(`Загружено ${stations.length} станций из Самарской области`);
    return stations;
  } catch (error) {
    console.error('Ошибка загрузки станций:', error);
    return [];
  }
}

function extractSamaraStations(countries) {
  const stations = [];
  const russia = countries?.find(c => c.title === 'Россия');
  if (!russia) return [];
  
  const samaraRegion = russia.regions?.find(r => r.title === 'Самарская область');
  if (!samaraRegion) return [];
  
  samaraRegion.settlements?.forEach(settlement => {
    settlement.stations?.forEach(station => {
      stations.push({
        code: station.codes?.yandex_code,
        title: station.title,
        latitude: station.latitude,
        longitude: station.longitude,
        direction: station.direction,
        type: station.station_type
      });
    });
  });
  
  return stations;
}