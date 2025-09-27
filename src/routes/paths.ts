export const routes = {
  start: '/',
  game: '/game',
  faq: '/faq',
  base: '/base',
} as const;

export type RouteKey = keyof typeof routes;
export type RoutePath = (typeof routes)[RouteKey];
