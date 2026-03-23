import React from 'react';

export default function ScheduleList({ segments, title }) {
  if (!segments?.length) {
    return <div className="alert alert-info">Нет рейсов для отображения</div>;
  }

  return (
    <div className="card mb-3">
      <div className="card-header">{title}</div>
      <div className="list-group list-group-flush">
        {segments.map((seg, idx) => (
          <div key={idx} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{seg.thread?.number || '—'}</strong>
                <small className="d-block text-muted">
                  {seg.from?.title} → {seg.to?.title}
                </small>
              </div>
              <div className="text-end">
                <div>
                  <strong>{formatTime(seg.departure)}</strong>
                  <small className="text-muted"> → {formatTime(seg.arrival)}</small>
                </div>
                <small className="text-muted">
                  {formatDuration(seg.duration)}
                </small>
              </div>
            </div>
            {seg.stops && seg.stops !== '' && (
              <small className="d-block text-secondary mt-1">
                Остановки: {seg.stops}
              </small>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTime(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(seconds) {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}ч ${m}м` : `${m}м`;
}