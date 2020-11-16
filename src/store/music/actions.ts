import { createAction, createAsyncAction } from 'typesafe-actions';

import {
  Actions,
  AddMusicRequestPayload,
  Music,
  OpenMusicRequestPayload,
  SaveMusicRequestPayload,
  SaveMusicSuccessPayload,
} from './types';


const setCount = createAction(Actions.SET_COUNT)<number>();

const selectMusic = createAction(
  Actions.SELECT_MUSIC,
)<
number
>();

const selectMusicMulti = createAction(
  Actions.SELECT_MUSIC_MULTI,
)<
number
>();

const selectMusicAdd = createAction(
  Actions.SELECT_MUSIC_ADD,
)<
number
>();

const selectMusicAll = createAction(
  Actions.SELECT_MUSIC_ALL,
)<
boolean
>();

const resetMusic = createAction(
  Actions.RESET_MUSIC,
)();

const openMusic = createAsyncAction(
  Actions.OPEN_MUSIC_REQUEST,
  Actions.OPEN_MUSIC_SUCCESS,
  Actions.OPEN_MUSIC_FAILURE,
)<
OpenMusicRequestPayload,
Music,
undefined
>();

const addMusic = createAsyncAction(
  Actions.ADD_MUSIC_REQUEST,
  Actions.ADD_MUSIC_SUCCESS,
  Actions.ADD_MUSIC_FAILURE,
)<
AddMusicRequestPayload,
Music,
undefined
>();

const saveMusic = createAsyncAction(
  Actions.SAVE_MUSIC_REQUEST,
  Actions.SAVE_MUSIC_SUCCESS,
  Actions.SAVE_MUSIC_FAILURE,
)<SaveMusicRequestPayload, SaveMusicSuccessPayload, undefined>();

export default {
  openMusic,
  addMusic,
  resetMusic,
  selectMusic,
  selectMusicAll,
  saveMusic,
  selectMusicAdd,
  selectMusicMulti,
  setCount,
};
