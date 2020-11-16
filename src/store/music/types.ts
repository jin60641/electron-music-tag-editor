import { IAudioMetadata } from 'music-metadata-browser';

export interface MusicState {
  list: Music[],
  count: number,
  lastCount: number,
  lastSelected?: number,
}

export enum Actions {
  SET_COUNT = 'MUSIC.SET_COUNT',

  SELECT_MUSIC = 'MUSIC.SELECT_MUSIC',
  SELECT_MUSIC_ADD = 'MUSIC.SELECT_MUSIC_ADD',
  SELECT_MUSIC_MULTI = 'MUSIC.SELECT_MUSIC_MULTI',
  SELECT_MUSIC_ALL = 'MUSIC.SELECT_MUSIC_ALL',
  RESET_MUSIC = 'MUSIC.RESET_MUSIC',

  OPEN_MUSIC_REQUEST = 'MUSIC.OPEN_MUSIC',
  OPEN_MUSIC_SUCCESS = 'MUSIC.OPEN_MUSIC#SUCCESS',
  OPEN_MUSIC_FAILURE = 'MUSIC.OPEN_MUSIC#FAILURE',

  ADD_MUSIC_REQUEST = 'MUSIC.ADD_MUSIC',
  ADD_MUSIC_SUCCESS = 'MUSIC.ADD_MUSIC#SUCCESS',
  ADD_MUSIC_FAILURE = 'MUSIC.ADD_MUSIC#FAILURE',

  SAVE_MUSIC_REQUEST = 'MUSIC.SAVE_MUSIC',
  SAVE_MUSIC_SUCCESS = 'MUSIC.SAVE_MUSIC#SUCCESS',
  SAVE_MUSIC_FAILURE = 'MUSIC.SAVE_MUSIC#FAILURE'
}

export const initialState: MusicState = { list: [], count: 0, lastCount: 0 };

export interface Music {
  // buffer: Uint8Array,
  // blob: Blob,
  path: string,
  url: string,
  metadata: Metadata,
  isSelected: boolean,
}

export interface OpenMusicRequestPayload {
  path: string,
  buffer: Uint8Array,
}

export type AddMusicRequestPayload = OpenMusicRequestPayload;

export interface Metadata extends Pick<IAudioMetadata['common'],
'title' |
'artist' |
'album' |
'albumartist'
> {
  genre: string,
  composer: string,
  track: string,
  comment: string,
  picture?: string[],
}

export interface SaveMusicRequestPayload {
  filePaths: Music['path'][];
  metadata: Partial<Metadata>;
}

export type SaveMusicSuccessPayload = OpenMusicRequestPayload;
