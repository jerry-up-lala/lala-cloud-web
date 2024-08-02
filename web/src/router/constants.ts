export const LOGIN_ROUTE_NAME = 'Login';

export const REDIRECT_ROUTE_NAME = 'Redirect';

export const DEFAULT_ROUTE_NAME = 'Workplace';

export const NOT_FOUND_ROUTE_NAME = 'NotFound';

export const WHITE_LIST = [
  { name: NOT_FOUND_ROUTE_NAME, children: [] },
  { name: LOGIN_ROUTE_NAME, children: [] },
  { name: REDIRECT_ROUTE_NAME, children: [] },
];

export const DEFAULT_ROUTE = {
  title: 'menu.workplace',
  name: DEFAULT_ROUTE_NAME,
  fullPath: '/dashboard/workplace',
};
