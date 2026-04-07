const API_BASE = process.env.REACT_APP_API_BASE;

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}


export async function getStationSchedule(stationCode, date = null) {
  const params = new URLSearchParams({
    format: 'json',
    lang: 'ru_RU',
    station: stationCode,
    transport_types: 'suburban',
    event: 'departure'
  });
  
  if (date) params.append('date', date);
  
  try {
    const response = await fetch(`${API_BASE}/schedule?${params}`);
    const data = await handleResponse(response);
    console.log('Ответ API:', data);
    return data.schedule || [];
  } catch (error) {
    console.error('Ошибка загрузки расписания:', error);
    return [];
  }
}

export async function getRouteSchedule(fromCode, toCode, date = null) {
  const params = new URLSearchParams({
    format: 'json',
    lang: 'ru_RU',
    from: fromCode,
    to: toCode,
    transport_types: 'suburban'
  });
  
  if (date) params.append('date', date);
  
  try {
    const response = await fetch(`${API_BASE}/search?${params}`);
    const data = await handleResponse(response);
    console.log('Ответ API маршрута:', data);
    return data.segments || data.schedule || [];
  } catch (error) {
    console.error('Ошибка загрузки маршрута:', error);
    return [];
  }
}

export async function loadStationsList() {
  console.log('Загружаем stations_list...');
  try {
    const params = new URLSearchParams({
      format: 'json',
      lang: 'ru_RU'
    });
    
    const response = await fetch(`${API_BASE}/stations_list?${params}`, {
      signal: AbortSignal.timeout(120000)
    });
    
    const data = await handleResponse(response);
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
  
  countries?.forEach(country => {
    country.regions?.forEach(region => {
      if (region.esr_code === '63' || region.esr_code === 63) {
        region.settlements?.forEach(settlement => {
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
      }
    });
  });
  
  console.log(`Найдено станций в Самарской области: ${stations.length}`);
  return stations;
}