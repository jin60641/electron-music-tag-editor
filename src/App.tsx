import React, { useMemo } from 'react';

import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import {
  Redirect,
  Route,
  HashRouter as Router,
  Switch,
} from 'react-router-dom';

import Alert from 'components/Alert';
import routes from 'constants/routes';
import { overrides, palettes } from 'constants/theme';
import Main from 'pages/Main';
import Preference from 'pages/Preference';

import 'vendor';

const useStyles = makeStyles({
  root: { display: 'flex' },
  content: { flexGrow: 1 },
});

const App: React.FC = () => {
  const classes = useStyles();

  const paletteType = 'light';
  const theme = useMemo(() => createMuiTheme({
    overrides,
    palette: {
      type: paletteType,
      ...(palettes[paletteType]),
    },
  }), [paletteType]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <main className={classes.content}>
          <Switch>
            <Route
              path='/'
              exact
              component={Main}
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
            <Redirect to='/' />
          </Switch>
        </main>
      </Router>
      <Alert />
      <Preference />
    </ThemeProvider>
  );
};

export default App;
