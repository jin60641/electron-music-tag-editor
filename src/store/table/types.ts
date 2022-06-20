import { SortDirection } from 'react-virtualized';

import { Metadata } from 'store/music/types';

export type DataKey = keyof Metadata | 'isSelected' | 'filename';

export interface Column {
  dataKey: DataKey,
  width: number,
  isSelected: boolean,
}

export interface TableState {
  columns: Column[],
  headerHeight: number,
  rowHeight: number,
  sortBy: DataKey,
  sortDirection: typeof SortDirection.ASC | typeof SortDirection.DESC,
  search: string,
}

export enum Actions {
  SET_COLUMN_WIDTH = 'TABLE.SET_COLUMN_WIDTH',
  SET_COLUMN_ORDER = 'TABLE.SET_COLUMN_ORDER',
  SET_SORT = 'TABLE.SET_SORT',
  ADD_COLUMN = 'TABLE.ADD_COLUMN',
  REMOVE_COLUMN = 'TABLE.REMOVE_COLUMN',
  SET_COLUMNS = 'TABLE.SET_COLUMNS',
  SET_SEARCH = 'TABLE.SET_SEARCH',
}

export type SetSortPayload = Pick<TableState, 'sortBy' | 'sortDirection'>;

export type ColumnWidth = {
  [key in DataKey]: number;
};

export const initialColumns: Column[] = [{
  dataKey: 'isSelected',
  width: 68,
  isSelected: true,
}, {
  dataKey: 'picture',
  width: 68,
  isSelected: true,
}, {
  dataKey: 'title',
  width: 300,
  isSelected: true,
}, {
  dataKey: 'album',
  width: 300,
  isSelected: true,
}, {
  dataKey: 'artist',
  width: 180,
  isSelected: true,
}, {
  dataKey: 'albumartist',
  width: 180,
  isSelected: true,
}, {
  dataKey: 'genre',
  width: 150,
  isSelected: true,
}, {
  dataKey: 'composer',
  width: 180,
  isSelected: true,
}, {
  dataKey: 'track',
  width: 150,
  isSelected: true,
}, {
  dataKey: 'comment',
  width: 300,
  isSelected: true,
}, {
  dataKey: 'filename',
  width: 300,
  isSelected: true,
}];

export const initialState: TableState = {
  headerHeight: 65,
  rowHeight: 56,
  columns: [...initialColumns],
  sortBy: 'title',
  sortDirection: SortDirection.ASC,
  search: '',
};

export interface SetColumnWidthPayload {
  dataKey: DataKey,
  width: number,
}

export interface SetColumnOrderPayload {
  source: DataKey,
  destination: DataKey,
  isReplace?: boolean,
}

export type AddColumnPayload = Column['dataKey'];
export type RemoveColumnPayload = Column['dataKey'];
export type SetColumnsPayload = TableState['columns'];
