import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import {
  concatMap,
  filter,
  mergeMap,
} from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { bufferToMusic } from 'utils/music';

import { Epic } from '../types';
import { createAsyncEpic } from '../utils';

import actions from './actions';
import { requestSaveMusic } from './apis';

const openMusicEpic = createAsyncEpic(actions.openMusic, bufferToMusic, concatMap);
const addMusicEpic = createAsyncEpic(actions.addMusic, bufferToMusic, concatMap);

const saveMusicRequestEpic: Epic = (action$) => action$.pipe(
  filter(isActionOf(actions.saveMusic.request)),
  mergeMap((action) => from(requestSaveMusic(action.payload)).pipe(
    mergeMap(() => []),
  )),
);

const saveMusicSuccessEpic: Epic = (action$) => action$.pipe(
  filter(isActionOf(actions.saveMusic.success)),
  mergeMap((action) => [actions.addMusic.request(action.payload)]),
);

export default combineEpics(
  openMusicEpic,
  addMusicEpic,
  saveMusicRequestEpic,
  saveMusicSuccessEpic,
);
