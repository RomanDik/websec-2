import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { formatTime, formatDuration } from '../utils/dateFormat';

export default function ScheduleList({ segments, station, fromStation, toStation }) {
  if (!segments?.length) {
    return (
      <div className="alert alert-info">Нет рейсов для отображения</div>
    );
  }

  let title;
  if (station) {
    title = `Расписание: ${station.title}`;
  } else if (fromStation && toStation) {
    title = `Маршрут: ${fromStation.title} → ${toStation.title}`;
  }

  return (
    <Card className="mb-3">
      <Card.Header>
        <strong>{title}</strong>
      </Card.Header>
      <ListGroup variant="flush">
        {segments.map((seg, idx) => {
          const dep = seg.departure || seg.departure_time || seg.dep_time || seg.time;
          const arr = seg.arrival || seg.arrival_time || seg.arr_time;
          
          const departureTime = formatTime(dep);
          const arrivalTime = formatTime(arr);
          const duration = formatDuration(seg.duration);
          
          return (
            <ListGroup.Item key={idx}>
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{seg.thread?.number || seg.number || '—'}</strong>
                  <div className="text-muted small">
                    {seg.from?.title} → {seg.to?.title}
                  </div>
                  {seg.stops && (
                    <div className="text-secondary small mt-1">
                      Остановки: {seg.stops}
                    </div>
                  )}
                </div>
                <div className="text-end">
                  <div>
                    <strong>{departureTime || '—'}</strong>
                    <span className="text-muted mx-1">→</span>
                    <strong>{arrivalTime || '—'}</strong>
                  </div>
                  <small className="text-muted">{duration || ''}</small>
                </div>
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
}
