import React, { useEffect, useMemo, useState } from 'react';

import { CssBaseline } from '@material-ui/core';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { I18nextProvider } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from 'react-router-dom';

import Alert from 'components/Alert';
import routes from 'constants/routes';
import { overrides, palettes } from 'constants/theme';
import Main from 'pages/Main';
import Preference from 'pages/Preference';
import Search from 'pages/Search';
import { Palette } from 'store/layout/types';
import { RootState } from 'store/types';

import 'vendor';

import { initializeI18next } from './utils/i18next';

const useStyles = makeStyles({
  root: { display: 'flex' },
  content: { flexGrow: 1 },
});

const paletteSelector = ({ layout: { palette } }: RootState) => palette;
const localeSelector = ({ locale: { code } }: RootState) => code;

const App: React.FC = () => {
  const [i18n, setI18n] = useState<any>();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const code = useSelector(localeSelector);
  const palette = useSelector(paletteSelector);
  const classes = useStyles();

  const paletteType = useMemo(() => {
    if (palette === Palette.DEVICE) {
      return prefersDarkMode ? 'dark' : 'light';
    }
    return palette;
  }, [prefersDarkMode, palette]);

  const theme = useMemo(() => createTheme({
    overrides,
    palette: {
      type: paletteType,
      ...(palettes[paletteType]),
    },
  }), [paletteType]);

  useEffect(() => {
    (async () => {
      setI18n(await initializeI18next(code));
    })();
  }, [code]);

  if (!i18n) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <main className={classes.content}>
            <Routes>
              <Route
                path='/'
                element={<Main />}
              />
              {routes.map(({
                key,
                ...props
              }) => (
                <Route
                  key={`app-route-${key}`}
                  path={`/${key}`}
                  {...props}
                />
              ))}
              <Route path='*' element={<Navigate to='/' />} />
            </Routes>
          </main>
        </Router>
        <Alert />
        <Preference />
        <Search />
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default App;
