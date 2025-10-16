export const formatStars = (value: number): string => {
  // if (value >= 1_000_000_000) {
  //   return `${Math.floor(value / 1_000_000_000)}B`;
  // }
  //
  // if (value >= 1_000_000) {
  //   return `${Math.floor(value / 1_000_000)}M`;
  // }
  //
  // if (value >= 10_000) {
  //   return `${Math.floor(value / 1_000)}K`;
  // }

  // Space separated thousands: 12 345
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const formatDuration = (seconds: number): string => {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, '0');
  const remainder = (safeSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
};

export default formatStars;
