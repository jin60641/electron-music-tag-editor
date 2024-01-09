import { persistReducer } from 'redux-persist';
import { createReducer } from 'typesafe-actions';

import { RootAction } from '../types';

import tableActions from './actions';
import { initialState, TableState } from './types';

const persistConfig = {
  key: 'table',
  storage: window.bridge.storage,
  blacklist: ['searchQuery'],
};

const tableReducer = createReducer<TableState, RootAction>(initialState)
  .handleAction(tableActions.setSearchQuery, (state, action) => ({
    ...state,
    searchQuery: action.payload,
  }))
  .handleAction(tableActions.setSearchSetting, (state, action) => ({
    ...state,
    searchSetting: action.payload,
  }))
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
    const source = columns.findIndex(({ dataKey }) => dataKey === action.payload.source);
    const destination = columns.findIndex(({ dataKey }) => dataKey === action.payload.destination);
    if (action.payload.isReplace) {
      [columns[source], columns[destination]] = [columns[destination], columns[source]];
    } else {
      const [removed] = columns.splice(source, 1);
      columns.splice(destination, 0, removed);
    }
    return {
      ...state,
      columns,
    };
  })
  .handleAction(tableActions.setSort, (state, action) => ({
    ...state,
    ...action.payload,
  }))
  .handleAction(tableActions.removeColumn, (state, action) => ({
    ...state,
    columns: state.columns.map((column) => (column.dataKey === action.payload ? ({
      ...column,
      isSelected: false,
    }) : column)),
  }))
  .handleAction(tableActions.addColumn, (state, action) => ({
    ...state,
    columns: state.columns.map((column) => (column.dataKey === action.payload ? ({
      ...column,
      isSelected: true,
    }) : column)),
  }))
  .handleAction(tableActions.setColumns, (state, action) => ({
    ...state,
    columns: action.payload,
  }));

export default persistReducer(persistConfig, tableReducer);
