import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import {
  concatMap,
  filter,
  mergeMap,
} from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import layoutActions from 'store/layout/actions';
import { AlertType } from 'store/layout/types';
import { bufferToMusic, bufferToMusics } from 'utils/music';

import { Epic } from '../types';
import { createAsyncEpic } from '../utils';

import actions from './actions';
import { requestRemoveMusics, requestSaveMusic } from './apis';

const openMusicEpic = createAsyncEpic(actions.openMusic, bufferToMusic, concatMap);
const addMusicsEpic = createAsyncEpic(actions.addMusics, bufferToMusics, concatMap);
const updateMusicsEpic = createAsyncEpic(actions.updateMusics, bufferToMusics, concatMap);

const saveMusicRequestEpic: Epic = (action$) => action$.pipe(
  filter(isActionOf(actions.saveMusic)),
  mergeMap((action) => from(requestSaveMusic(action.payload)).pipe(
    mergeMap(() => []),
  )),
);

const removeMusicsRequestEpic: Epic = (action$) => action$.pipe(
  filter(isActionOf(actions.removeMusics)),
  filter(action => !!action.payload.shouldRemoveFiles),
  mergeMap((action) => from(requestRemoveMusics(action.payload)).pipe(
    mergeMap(() => []),
  )),
);
const selectMusicEpic: Epic = (action$, state) => action$.pipe(
  filter(isActionOf([
    actions.selectMusic,
    actions.selectMusicMulti,
    actions.selectMusicAdd,
    actions.selectMusicAll,
    actions.removeMusics,
    actions.addMusics.success,
    actions.updateMusics.success,
  ])),
  mergeMap(() => {
    const nextDrawerState = !!state.value.music.list.find((item) => !!item.isSelected);
    return [
      actions.updateInput(),
      ...(nextDrawerState !== state.value.layout.drawer
        ? [layoutActions.setDrawer(nextDrawerState)]
        : []
      ),
    ];
  }),
);

const searchMusicFailureEpic: Epic = (action$) => action$.pipe(
  filter(isActionOf(actions.searchMusic.failure)),
  mergeMap(() => [layoutActions.makeAlert({
    type: AlertType.error,
    message: 'no_search_result',
  })]),
);
export default combineEpics(
  openMusicEpic,
  addMusicsEpic,
  updateMusicsEpic,
  removeMusicsRequestEpic,
  saveMusicRequestEpic,
  selectMusicEpic,
  searchMusicFailureEpic,
);
