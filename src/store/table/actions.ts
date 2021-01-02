import { createAction } from 'typesafe-actions';

import {
  Actions,
  AddColumnPayload,
  RemoveColumnPayload,
  SetColumnOrderPayload,
  SetColumnsPayload,
  SetColumnWidthPayload,
  SetSortPayload,
} from './types';

const setColumnWidth = createAction(Actions.SET_COLUMN_WIDTH)<SetColumnWidthPayload>();
const setColumnOrder = createAction(Actions.SET_COLUMN_ORDER)<SetColumnOrderPayload>();
const setSort = createAction(Actions.SET_SORT)<SetSortPayload>();
const addColumn = createAction(Actions.ADD_COLUMN)<AddColumnPayload>();
const removeColumn = createAction(Actions.REMOVE_COLUMN)<RemoveColumnPayload>();
const setColumns = createAction(Actions.SET_COLUMNS)<SetColumnsPayload>();
const setSearch = createAction(Actions.SET_SEARCH)<string>();

export default {
  setColumnWidth,
  setColumnOrder,
  setSort,
  addColumn,
  removeColumn,
  setSearch,
  setColumns,
};
