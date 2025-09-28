export const routes = {
  start: '/',
  game: '/game',
  faq: '/faq',
  base: '/base',
  linkNumber: '/game/link-number',
} as const;

export type RouteKey = keyof typeof routes;
export type RoutePath = (typeof routes)[RouteKey];
