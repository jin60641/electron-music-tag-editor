import { createAction } from 'typesafe-actions';

import {
  Actions,
  SetColumnOrderPayload,
  SetColumnWidthPayload,
  SetSortPayload,
} from './types';

const setColumnWidth = createAction(Actions.SET_COLUMN_WIDTH)<SetColumnWidthPayload>();
const setColumnOrder = createAction(Actions.SET_COLUMN_ORDER)<SetColumnOrderPayload>();
const setSort = createAction(Actions.SET_SORT)<SetSortPayload>();

export default {
  setColumnWidth,
  setColumnOrder,
  setSort,
};
