import { Epic as RxEpic } from 'redux-observable';
import { ActionType } from 'typesafe-actions';

import { IsFetchingState } from './isFetching/types';
import layoutActions from './layout/actions';
import { LayoutState } from './layout/types';
import localeActions from './locale/actions';
import { LocaleState } from './locale/types';
import musicActions from './music/actions';
import { MusicState } from './music/types';
import tableActions from './table/actions';
import { TableState } from './table/types';

export interface RootState {
  layout: LayoutState,
  isFetching: IsFetchingState,
  locale: LocaleState,
  music: MusicState,
  table: TableState,
}

export type RootAction =
  ActionType<typeof layoutActions> |
  ActionType<typeof musicActions> |
  ActionType<typeof localeActions> |
  ActionType<typeof tableActions>;

export const channels = [
  musicActions.resetMusic,
  musicActions.setCount,
  musicActions.addMusic.request,
  musicActions.addMusic.success,
  musicActions.addMusic.failure,
  musicActions.saveMusic.success,
];

export type Epic = RxEpic<
RootAction,
RootAction,
RootState
>;
