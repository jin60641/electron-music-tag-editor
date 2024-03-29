export interface LayoutState {
  alert: AlertOption,
  drawer: boolean,
  search: boolean,
  palette: Palette;
  preference?: PreferenceState,
}

export enum PreferenceState {
  columns = 'columns',
  themes = 'themes',
  language = 'language',
  search = 'search',
}

export enum Actions {
  MAKE_ALERT = 'LAYOUT.MAKE_ALERT',
  DISMISS_ALERT = 'LAYOUT.DISMISS_ALERT',
  SET_DRAWER = 'LAYOUT.SET_DRAWER',
  SET_SEARCH = 'LAYOUT.SET_SEARCH',
  SET_PALETTE = 'LAYOUT.SET_PALETTE',
  SET_PREFERENCE = 'LAYOUT.SET_PREFERENCE',
}

export const drawerWidth = 400;

export enum Palette {
  DARK = 'dark',
  DEVICE = 'device',
  LIGHT = 'light',
}

export const initialState: LayoutState = {
  alert: {
    message: '',
    type: null,
  },
  drawer: false,
  search: false,
  preference: undefined,
  palette: Palette.DEVICE,
};

export interface AlertOption {
  type: AlertType | null,
  message: string,
}

export enum AlertType {
  info = 'info',
  error = 'error',
}
