import { IAudioMetadata } from 'music-metadata-browser';

export interface MusicState {
  list: Music[],
}

export enum Actions {
  SELECT_MUSIC = 'SELECT_MUSIC',
  SELECT_MUSIC_ALL = 'SELECT_MUSIC_ALL',
  RESET_MUSIC = 'RESET_MUSIC',

  OPEN_MUSIC_REQUEST = 'OPEN_MUSIC',
  OPEN_MUSIC_SUCCESS = 'OPEN_MUSIC#SUCCESS',
  OPEN_MUSIC_FAILURE = 'OPEN_MUSIC#FAILURE',

  ADD_MUSIC_REQUEST = 'ADD_MUSIC',
  ADD_MUSIC_SUCCESS = 'ADD_MUSIC#SUCCESS',
  ADD_MUSIC_FAILURE = 'ADD_MUSIC#FAILURE',

  SAVE_MUSIC_REQUEST = 'SAVE_MUSIC',
  SAVE_MUSIC_SUCCESS = 'SAVE_MUSIC#SUCCESS',
  SAVE_MUSIC_FAILURE = 'SAVE_MUSIC#FAILURE'
}

export const initialState: MusicState = { list: [] };

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
'albumartist' |
'year'
> {
  genre: string,
  composer: string,
  track: string,
  comment: string,
  picture: string[],
}

export interface SaveMusicRequestPayload {
  filePaths: Music['path'][];
  metadata: Partial<Metadata>;
}

export type SaveMusicSuccessPayload = OpenMusicRequestPayload;
