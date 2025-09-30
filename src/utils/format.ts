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

export default formatStars;
