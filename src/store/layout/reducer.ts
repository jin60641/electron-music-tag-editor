import { createReducer } from 'typesafe-actions';

import layoutActions from './actions';
import { initialState } from './types';

const layoutReducer = createReducer(initialState)
  .handleAction(layoutActions.makeAlert, (state, action) => ({
    ...state,
    alert: action.payload,
  }))
  .handleAction(layoutActions.dismissAlert, (state) => ({
    ...state,
    alert: { ...initialState.alert },
  }));

export default layoutReducer;
