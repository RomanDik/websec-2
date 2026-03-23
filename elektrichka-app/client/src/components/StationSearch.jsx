import React, { useState } from 'react';
import { searchStations } from '../api/yandexRasp';

export default function StationSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.length < 2) return;
    
    setLoading(true);
    try {
      const filtered = window.__stationsCache?.filter(s => 
        s.title.toLowerCase().includes(query.toLowerCase()) &&
        s.transport_type === 'suburban' // только электрички
      ) || [];
      setResults(filtered.slice(0, 10));
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-3">
      <form onSubmit={handleSearch} className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Название станции (напр. Самара)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '🔍' : 'Найти'}
        </button>
      </form>
      
      {results.length > 0 && (
        <ul className="list-group">
          {results.map(station => (
            <li 
              key={station.code} 
              className="list-group-item list-group-item-action"
              onClick={() => onSelect(station)}
            >
              <strong>{station.title}</strong>
              <small className="d-block text-muted">
                {station.direction || 'Направление не указано'}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}