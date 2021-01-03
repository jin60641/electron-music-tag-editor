export interface LayoutState {
  alert: AlertOption,
  drawer: boolean,
  search: boolean,
  preference?: PreferenceState,
}

export enum PreferenceState {
  columns = 'columns',
  theme = 'theme',
  language = 'language',
}

export enum Actions {
  MAKE_ALERT = 'LAYOUT.MAKE_ALERT',
  DISMISS_ALERT = 'LAYOUT.DISMISS_ALERT',
  SET_DRAWER = 'LAYOUT.SET_DRAWER',
  SET_SEARCH = 'LAYOUT.SET_SEARCH',
  SET_PREFERENCE = 'LAYOUT.SET_PREFERENCE',
}

export const drawerWidth = 400;

export const initialState: LayoutState = {
  alert: {
    message: '',
    type: null,
  },
  drawer: false,
  search: false,
  preference: undefined,
};

export interface AlertOption {
  type: AlertType | null,
  message: string,
}

export enum AlertType {
  info = 'info',
  error = 'error',
}
