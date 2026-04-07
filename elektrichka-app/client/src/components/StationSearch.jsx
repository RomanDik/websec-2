import React, { useState } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';

export default function StationSearch({ stations, onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Поиск:', query);
    
    if (!stations || query.length < 2) {
      console.log('Станции не загружены');
      return;
    }
    
    const filtered = stations.filter(s => 
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
      <Form onSubmit={handleSearch} className="d-flex gap-2">
        <Form.Control
          type="text"
          placeholder="Название станции (напр. Самара)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" variant="primary">
          Найти
        </Button>
      </Form>
      
      {results.length > 0 && (
        <ListGroup className="mt-2">
          {results.map(station => (
            <ListGroup.Item 
              key={station.code} 
              action
              onClick={() => handleSelect(station)}
            >
              <strong>{station.title}</strong>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}