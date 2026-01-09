
export interface ExpoRouterDevToolsProps {
  /** Position of the dev tools bar */
  position?: 'top' | 'bottom';
  /** Theme */
  theme?: 'light' | 'dark';
  /** Hide in production builds */
  hideInProduction?: boolean;
  /** Custom storage key prefix (alphanumeric, dots, dashes, and underscores only) */
  storageKeyPrefix?: string;
  /** Callback when route changes */
  onRouteChange?: (route: string) => void;
  /** Enable route history */
  enableHistory?: boolean;
  /** Maximum number of history items */
  maxHistory?: number;
  /** Maximum number of lines the route will show */
  maxNumOfLines?: number;
}

export interface SavedRoute {
  route: string;
  label: string;
  timestamp: number;
}
