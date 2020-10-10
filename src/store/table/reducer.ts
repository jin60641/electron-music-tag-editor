import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createReducer } from 'typesafe-actions';

import tableActions from './actions';
import { initialState } from './types';

const persistConfig = {
  key: 'table',
  storage,
};

const tableReducer = createReducer(initialState)
  .handleAction(tableActions.setColumnWidth, (state, action) => ({
    ...state,
    columnWidth: {
      ...state.columnWidth,
      [action.payload.dataKey]: action.payload.width,
    },
  }))
  .handleAction(tableActions.setColumnOrder, (state, action) => {
    const columnOrder = [...state.columnOrder];
    const [removed] = columnOrder.splice(action.payload.source, 1);
    columnOrder.splice(action.payload.destination, 0, removed);
    return {
      ...state,
      columnOrder,
    };
  })
  .handleAction(tableActions.setSort, (state, action) => ({
    ...state,
    ...action.payload,
  }));

export default persistReducer(persistConfig, tableReducer);
