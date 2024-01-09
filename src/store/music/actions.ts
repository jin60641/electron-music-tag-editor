import { createAction, createAsyncAction } from 'typesafe-actions';

import {
  Actions,
  AddMusicsRequestPayload,
  InputOptions,
  InputPicture,
  InputValues,
  Music,
  OpenMusicRequestPayload,
  RemoveMusicsPayload,
  SaveMusicPayload,
  SearchMusicRequestPayload,
  SearchMusicSuccessPayload,
  UpdateMusicsRequestPayload,
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

const removeMusics = createAction(
  Actions.REMOVE_MUSICS,
)<RemoveMusicsPayload>();

const openMusic = createAsyncAction(
  Actions.OPEN_MUSIC_REQUEST,
  Actions.OPEN_MUSIC_SUCCESS,
  Actions.OPEN_MUSIC_FAILURE,
)<
OpenMusicRequestPayload,
Music,
undefined
>();

const addMusics = createAsyncAction(
  Actions.ADD_MUSICS_REQUEST,
  Actions.ADD_MUSICS_SUCCESS,
  Actions.ADD_MUSICS_FAILURE,
)<
AddMusicsRequestPayload,
Music[],
undefined
>();

const saveMusic = createAction(
  Actions.SAVE_MUSIC_REQUEST,
)<SaveMusicPayload>();

const updateMusics = createAsyncAction(
  Actions.UPDATE_MUSICS_REQUEST,
  Actions.UPDATE_MUSICS_SUCCESS,
  Actions.UPDATE_MUSICS_FAILURE,
)<
UpdateMusicsRequestPayload,
Music[],
undefined
>();

const openFinder = createAction(
  Actions.OPEN_FINDER,
)<string>();

const searchMusic = createAsyncAction(
  Actions.SEARCH_MUSIC_REQUEST,
  Actions.SEARCH_MUSIC_SUCCESS,
  Actions.SEARCH_MUSIC_FAILURE,
)<
SearchMusicRequestPayload,
SearchMusicSuccessPayload,
void
>();

const updateInput = createAction(Actions.UPDATE_INPUT)();
const setInputOptions = createAction(Actions.SET_INPUT_OPTIONS)<InputOptions>();
const setInputValues = createAction(Actions.SET_INPUT_VALUES)<InputValues>();
const setInputPicture = createAction(Actions.SET_INPUT_PICTURE)<InputPicture>();
const resetSearch = createAction(Actions.RESET_SEARCH)();
const copyImage = createAction(Actions.COPY_IMAGE)();

export default {
  openMusic,
  addMusics,
  resetMusic,
  selectMusic,
  selectMusicAll,
  saveMusic,
  updateMusics,
  selectMusicAdd,
  selectMusicMulti,
  searchMusic,
  setCount,
  removeMusics,
  setLastSelected,
  openFinder,
  setInputOptions,
  setInputValues,
  setInputPicture,
  updateInput,
  resetSearch,
  copyImage,
};
