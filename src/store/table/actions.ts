import { createAction } from 'typesafe-actions';

import {
  Actions,
  RemoveColumnPayload,
  SetColumnOrderPayload,
  SetColumnsPayload,
  SetColumnWidthPayload,
  SetSortPayload,
} from './types';

const setColumnWidth = createAction(Actions.SET_COLUMN_WIDTH)<SetColumnWidthPayload>();
const setColumnOrder = createAction(Actions.SET_COLUMN_ORDER)<SetColumnOrderPayload>();
const setSort = createAction(Actions.SET_SORT)<SetSortPayload>();
const setColumns = createAction(Actions.SET_COLUMNS)<SetColumnsPayload>();
const removeColumn = createAction(Actions.REMOVE_COLUMN)<RemoveColumnPayload>();

export default {
  setColumnWidth,
  setColumnOrder,
  setSort,
  setColumns,
  removeColumn,
};
