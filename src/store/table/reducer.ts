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
  .handleAction(tableActions.setColumnWidth, (state, action) => {
    const columns = [...state.columns];
    const idx = columns.findIndex(({ dataKey }) => dataKey === action.payload.dataKey);
    columns[idx].width = action.payload.width;
    return {
      ...state,
      columns,
    };
  })
  .handleAction(tableActions.setColumnOrder, (state, action) => {
    const columns = [...state.columns];
    const [removed] = columns.splice(action.payload.source, 1);
    columns.splice(action.payload.destination, 0, removed);
    return {
      ...state,
      columns,
    };
  })
  .handleAction(tableActions.setSort, (state, action) => ({
    ...state,
    ...action.payload,
  }))
  .handleAction(tableActions.removeColumn, (state, action) => {
    const columns = [...state.columns];
    columns.splice(action.payload, 1);
    return {
      ...state,
      columns,
    };
  })
  .handleAction(tableActions.setColumns, (state, action) => ({
    ...state,
    columns: action.payload,
  }))

export default persistReducer(persistConfig, tableReducer);
