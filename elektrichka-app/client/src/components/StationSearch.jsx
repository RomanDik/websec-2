import React, { useState } from 'react';

export default function StationSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('🔍 Поиск:', query);
    
    if (!window.__stationsCache || query.length < 2) {
      console.log('Станции не загружены');
      return;
    }
    
    const filtered = window.__stationsCache.filter(s => 
      s.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
    
    console.log('Найдено:', filtered.length);
    setResults(filtered);
  };

  const handleSelect = (station) => {
    console.log('Выбрана станция:', station);
    setResults([]);
    setQuery(station.title);
    if (onSelect) {
      onSelect(station);
    }
  };

  return (
    <div className="mb-3">
      <form onSubmit={handleSearch} className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Название станции"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Найти
        </button>
      </form>
      
      {results.length > 0 && (
        <ul className="list-group mt-2">
          {results.map(station => (
            <li 
              key={station.code} 
              className="list-group-item list-group-item-action"
              onClick={() => handleSelect(station)}
            >
              <strong>{station.title}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}