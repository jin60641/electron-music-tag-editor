import { SortDirection } from 'react-virtualized';

import { Metadata } from 'store/music/types';

export type DataKey = keyof Metadata | 'isSelected';

interface Column {
  dataKey: DataKey,
  width: number,
}

export interface TableState {
  columns: Column[],
  headerHeight: number,
  rowHeight: number,
  sortBy: keyof Metadata,
  sortDirection: typeof SortDirection.ASC | typeof SortDirection.DESC,
}

export enum Actions {
  SET_COLUMN_WIDTH = 'SET_COLUMN_WIDTH',
  SET_COLUMN_ORDER = 'SET_COLUMN_ORDER',
  SET_SORT = 'SET_SORT',
  REMOVE_COLUMN = 'REMOVE_COLUMN',
  SET_COLUMNS = 'SET_COLUMNS' // TODO: 사용자 정의 컬럼 모달용
}

export type SetSortPayload = Pick<TableState, 'sortBy' | 'sortDirection'>;

export type ColumnWidth = {
  [key in DataKey]: number;
};

const initialColumns: Column[] = [{
  dataKey: 'isSelected',
  width: 68,
}, {
  dataKey: 'picture',
  width: 68,
}, {
  dataKey: 'title',
  width: 300,
}, {
  dataKey: 'album',
  width: 300,
}, {
  dataKey: 'artist',
  width: 180,
}, {
  dataKey: 'albumartist',
  width: 180,
}, {
  dataKey: 'genre',
  width: 150,
}, {
  dataKey: 'composer',
  width: 180,
}, {
  dataKey: 'track',
  width: 150,
}, {
  dataKey: 'comment',
  width: 300,
}];

export const initialState: TableState = {
  headerHeight: 65,
  rowHeight: 56,
  columns: [...initialColumns],
  sortBy: 'title',
  sortDirection: SortDirection.ASC,
};

export interface SetColumnWidthPayload {
  dataKey: DataKey,
  width: number,
}

export interface SetColumnOrderPayload {
  source: number,
  destination: number,
}

export type RemoveColumnPayload = number;

export type SetColumnsPayload = TableState['columns'];
