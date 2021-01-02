import { Theme } from '@material-ui/core/styles';

export const overrides: Theme['overrides'] = { MuiButton: { root: { textTransform: 'none' } } };

export const palettes = {
  dark: {
    primary: {
      light: '#ffac33',
      main: '#ff9800',
      dark: '#b26a00',
    },
    text: { disabled: '#424242' },
  },
  light: {},
};
