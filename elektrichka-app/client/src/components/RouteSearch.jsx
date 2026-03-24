import React, { useState } from 'react';

export default function RouteSearch({ stations, onSearch }) {
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [fromResults, setFromResults] = useState([]);
  const [toResults, setToResults] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);

  const handleFromSearch = (e) => {
    const query = e.target.value;
    setFromStation(query);
    
    if (query.length < 2 || !window.__stationsCache) {
      setFromResults([]);
      return;
    }
    
    const filtered = window.__stationsCache.filter(s => 
      s.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    setFromResults(filtered);
  };

  const handleToSearch = (e) => {
    const query = e.target.value;
    setToStation(query);
    
    if (query.length < 2 || !window.__stationsCache) {
      setToResults([]);
      return;
    }
    
    const filtered = window.__stationsCache.filter(s => 
      s.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    setToResults(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFrom && selectedTo) {
      onSearch(selectedFrom, selectedTo);
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <strong>Поиск маршрута между станциями</strong>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-5">
              <label className="form-label">Откуда:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Начальная станция"
                value={fromStation}
                onChange={handleFromSearch}
              />
              {fromResults.length > 0 && (
                <ul className="list-group mt-1">
                  {fromResults.map(station => (
                    <li
                      key={station.code}
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        setSelectedFrom(station);
                        setFromResults([]);
                        setFromStation(station.title);
                      }}
                    >
                      {station.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="col-md-5">
              <label className="form-label">Куда:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Конечная станция"
                value={toStation}
                onChange={handleToSearch}
              />
              {toResults.length > 0 && (
                <ul className="list-group mt-1">
                  {toResults.map(station => (
                    <li
                      key={station.code}
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        setSelectedTo(station);
                        setToResults([]);
                        setToStation(station.title);
                      }}
                    >
                      {station.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="col-md-2 d-flex align-items-end">
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={!selectedFrom || !selectedTo}
              >
                Найти
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}