export interface LayoutState {
  alert: AlertOption,
}

export enum Actions {
  MAKE_ALERT = 'MAKE_ALERT',
  DISMISS_ALERT = 'DISMISS_ALERT'
}

export const initialState: LayoutState = {
  alert: {
    message: '',
    type: null,
  },
};

export interface AlertOption {
  type: AlertType | null,
  message: string,
}

export enum AlertType {
  info = 'info',
  error = 'error'
}
