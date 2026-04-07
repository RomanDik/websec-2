import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';

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
    
    if (query.length < 2 || !stations) {
      setFromResults([]);
      return;
    }
    
    const filtered = stations.filter(s => 
      s.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    setFromResults(filtered);
  };

  const handleToSearch = (e) => {
    const query = e.target.value;
    setToStation(query);
    
    if (query.length < 2 || !stations) {
      setToResults([]);
      return;
    }
    
    const filtered = stations.filter(s => 
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
    <Card className="mb-3">
      <Card.Header>
        <strong>Поиск маршрута между станциями</strong>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={5}>
              <Form.Label>Откуда:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Начальная станция"
                value={fromStation}
                onChange={handleFromSearch}
              />
              {fromResults.length > 0 && (
                <ListGroup className="mt-1">
                  {fromResults.map(station => (
                    <ListGroup.Item
                      key={station.code}
                      action
                      onClick={() => {
                        setSelectedFrom(station);
                        setFromResults([]);
                        setFromStation(station.title);
                      }}
                    >
                      {station.title}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Col>
            
            <Col md={5}>
              <Form.Label>Куда:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Конечная станция"
                value={toStation}
                onChange={handleToSearch}
              />
              {toResults.length > 0 && (
                <ListGroup className="mt-1">
                  {toResults.map(station => (
                    <ListGroup.Item
                      key={station.code}
                      action
                      onClick={() => {
                        setSelectedTo(station);
                        setToResults([]);
                        setToStation(station.title);
                      }}
                    >
                      {station.title}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Col>
            
            <Col md={2} className="d-flex align-items-end">
              <Button 
                type="submit" 
                variant="primary" 
                className="w-100"
                disabled={!selectedFrom || !selectedTo}
              >
                Найти
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
}