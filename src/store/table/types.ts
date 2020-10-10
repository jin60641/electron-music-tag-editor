import { SortDirection } from 'react-virtualized';

import { Metadata } from 'store/music/types';

export type DataKey = keyof Metadata | 'isSelected';

export interface TableState {
  columnWidth: ColumnWidth,
  columnOrder: number[],
  headerHeight: number,
  rowHeight: number,
  sortBy: keyof Metadata,
  sortDirection: typeof SortDirection.ASC | typeof SortDirection.DESC,
}

export enum Actions {
  SET_COLUMN_WIDTH = 'SET_COLUMN_WIDTH',
  SET_COLUMN_ORDER = 'SET_COLUMN_ORDER',
  SET_SORT = 'SET_SORT'
}

export type SetSortPayload = Pick<TableState, 'sortBy' | 'sortDirection'>;

export type ColumnWidth = {
  [key in DataKey]: number;
};

export const initialState: TableState = {
  columnWidth: {
    isSelected: 68,
    picture: 68,
    title: 300,
    album: 300,
    artist: 180,
    albumartist: 180,
    genre: 150,
    composer: 180,
    track: 150,
    comment: 300,
  },
  headerHeight: 65,
  rowHeight: 56,
  columnOrder: Array(10).fill(0).map((_, i) => i), // TODO: generate by columns constant list length
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
