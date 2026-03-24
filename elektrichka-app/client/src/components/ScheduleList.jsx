import React from 'react';

export default function ScheduleList({ segments, title }) {
  if (!segments?.length) {
    return <div className="alert alert-info">Нет рейсов для отображения</div>;
  }

  console.log('Первый сегмент:', segments[0]);
  console.log('departure:', segments[0].departure);
  console.log('arrival:', segments[0].arrival);

  return (
    <div className="card mb-3">
      <div className="card-header">
        <strong>{title}</strong>
      </div>
      <div className="list-group list-group-flush">
        {segments.map((seg, idx) => {
          const dep = seg.departure || seg.departure_time || seg.dep_time || seg.time;
          const arr = seg.arrival || seg.arrival_time || seg.arr_time;
          
          const departureTime = formatTime(dep);
          const arrivalTime = formatTime(arr);
          const duration = formatDuration(seg.duration);
          
          return (
            <div key={idx} className="list-group-item">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{seg.thread?.number || seg.number || '—'}</strong>
                  <small className="d-block text-muted">
                    {seg.from?.title} → {seg.to?.title}
                  </small>
                  {seg.stops && (
                    <small className="d-block text-secondary mt-1">
                      Остановки: {seg.stops}
                    </small>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatTime(dateString) {
  if (!dateString) return null;
  
  if (typeof dateString === 'string' && /^\d{2}:\d{2}/.test(dateString)) {
    return dateString.substring(0, 5);
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    }
    
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (e) {
    return null;
  }
}

function formatDuration(seconds) {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}ч ${m}м` : `${m}м`;
}