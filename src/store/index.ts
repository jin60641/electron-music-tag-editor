import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import { persistStore } from 'redux-persist';
import { getType } from 'typesafe-actions';

import rootEpic from './epic';
import rootReducer from './reducer';
import { channels, RootAction, RootState } from './types';

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

channels.forEach((channel) => {
  window.bridge.ipc.receive(getType(channel), (data) => {
    store.dispatch(channel(data));
  });
});

export {
  store,
  persistor,
};
