export interface LayoutState {
  alert: AlertOption,
  drawer: boolean,
  search: boolean,
}

export enum Actions {
  MAKE_ALERT = 'LAYOUT.MAKE_ALERT',
  DISMISS_ALERT = 'LAYOUT.DISMISS_ALERT',
  SET_DRAWER = 'LAYOUT.SET_DRAWER',
  SET_SEARCH = 'LAYOUT.SET_SEARCH',
}

export const drawerWidth = 400;

export const initialState: LayoutState = {
  alert: {
    message: '',
    type: null,
  },
  drawer: false,
  search: false,
};

export interface AlertOption {
  type: AlertType | null,
  message: string,
}

export enum AlertType {
  info = 'info',
  error = 'error'
}
