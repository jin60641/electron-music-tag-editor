import { createAction, createAsyncAction } from 'typesafe-actions';

import {
  Actions,
  AddMusicRequestPayload,
  Music,
  OpenMusicRequestPayload,
  RemoveMusicPayload,
  SaveMusicPayload,
  UpdateMusicRequestPayload,
} from './types';

const setCount = createAction(Actions.SET_COUNT)<number>();

const selectMusic = createAction(
  Actions.SELECT_MUSIC,
)<
number
>();

const setLastSelected = createAction(
  Actions.SET_LAST_SELECTED,
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

const removeMusic = createAction(
  Actions.REMOVE_MUSIC,
)<RemoveMusicPayload>();

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

const saveMusic = createAction(
  Actions.SAVE_MUSIC_REQUEST,
)<SaveMusicPayload>();

const updateMusic = createAsyncAction(
  Actions.UPDATE_MUSIC_REQUEST,
  Actions.UPDATE_MUSIC_SUCCESS,
  Actions.UPDATE_MUSIC_FAILURE,
)<
UpdateMusicRequestPayload,
Music,
undefined
>();

export default {
  openMusic,
  addMusic,
  resetMusic,
  selectMusic,
  selectMusicAll,
  saveMusic,
  updateMusic,
  selectMusicAdd,
  selectMusicMulti,
  setCount,
  removeMusic,
  setLastSelected,
};
