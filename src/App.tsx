import React from 'react';

import { CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

import Alert from 'components/Alert';
import routes from 'constants/routes';
import Main from 'pages/Main';

import 'vendor';

const useStyles = makeStyles({
  root: { display: 'flex' },
  content: { flexGrow: 1 },
});

const App: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <Router>
        <main className={classes.content}>
          <Switch>
            <Route
              exact
              path='/'
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
    </>
  );
};

export default App;
