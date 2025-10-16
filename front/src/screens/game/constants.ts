export const energyRecoveryTime = {
  hours: 2,
  minutes: 45,
  seconds: 18,
};

export type LeaderboardEntry = {
  position: number;
  username: string;
  score: number;
};

export const leaderboard: LeaderboardEntry[] = [
  { position: 1, username: 'moodberry', score: 2350 },
  { position: 2, username: 'petal_dust', score: 2100 },
  { position: 3, username: 'cocoa_cloud', score: 2050 },
  { position: 4, username: 'skywalker', score: 1980 },
  { position: 5, username: 'sunny_time', score: 1905 },
  { position: 6, username: 'calm_wave', score: 1870 },
  { position: 7, username: 'soft_breeze', score: 1825 },
  { position: 8, username: 'bold_fox', score: 1780 },
  { position: 9, username: 'lucky_seed', score: 1745 },
  { position: 10, username: 'mellow_meadow', score: 1720 },
];

export const userPosition = {
  position: 346,
  username: 'you',
  score: 0,
};
