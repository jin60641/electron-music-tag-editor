import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import { persistStore } from 'redux-persist';

import rootEpic from './epic';
import { Actions as MusicActions } from './music/types';
import rootReducer from './reducer';
import { RootAction, RootState } from './types';

const composeEnhancers = compose;

const loggerMiddleware = createLogger();
const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState>();

const middlewares: any[] = [epicMiddleware];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(loggerMiddleware);
}

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares)),
);

epicMiddleware.run(rootEpic);

const persistor = persistStore(store);

Object.values(MusicActions).forEach((channel) => {
  window.bridge.ipc.receive(channel, (data) => {
    store.dispatch({ type: channel as any, payload: data });
  });
});

export {
  store,
  persistor,
};
