export const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('en-PH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };