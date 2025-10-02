export const routes = {
  start: '/',
  game: '/game',
  faq: '/faq',
  linkNumber: '/game/link-number',
  linkNumberDemo: '/game/link-number/demo',
  rewards: '/rewards',
} as const;

export type RouteKey = keyof typeof routes;
export type RoutePath = (typeof routes)[RouteKey];
