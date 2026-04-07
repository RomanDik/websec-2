export function formatTime(dateString) {
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

export function formatDuration(seconds) {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}ч ${m}м` : `${m}м`;
}