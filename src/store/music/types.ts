export interface MusicState {
  list: Music[],
  count: number,
  lastCount: number,
  lastSelected?: number,
}

export enum Actions {
  SET_COUNT = 'MUSIC.SET_COUNT',
  SET_LAST_SELECTED = 'MUSIC.SET_LAST_SELECTED',

  SELECT_MUSIC = 'MUSIC.SELECT_MUSIC',
  SELECT_MUSIC_ADD = 'MUSIC.SELECT_MUSIC_ADD',
  SELECT_MUSIC_MULTI = 'MUSIC.SELECT_MUSIC_MULTI',
  SELECT_MUSIC_ALL = 'MUSIC.SELECT_MUSIC_ALL',
  RESET_MUSIC = 'MUSIC.RESET_MUSIC',
  REMOVE_MUSIC = 'MUSIC.REMOVE_MUSIC',

  OPEN_MUSIC_REQUEST = 'MUSIC.OPEN_MUSIC',
  OPEN_MUSIC_SUCCESS = 'MUSIC.OPEN_MUSIC#SUCCESS',
  OPEN_MUSIC_FAILURE = 'MUSIC.OPEN_MUSIC#FAILURE',

  ADD_MUSIC_REQUEST = 'MUSIC.ADD_MUSIC',
  ADD_MUSIC_SUCCESS = 'MUSIC.ADD_MUSIC#SUCCESS',
  ADD_MUSIC_FAILURE = 'MUSIC.ADD_MUSIC#FAILURE',

  UPDATE_MUSIC_REQUEST = 'MUSIC.UPDATE_MUSIC',
  UPDATE_MUSIC_SUCCESS = 'MUSIC.UPDATE_MUSIC#SUCCESS',
  UPDATE_MUSIC_FAILURE = 'MUSIC.UPDATE_MUSIC#FAILURE',

  SAVE_MUSIC_REQUEST = 'MUSIC.SAVE_MUSIC',
  SAVE_MUSIC_SUCCESS = 'MUSIC.SAVE_MUSIC#SUCCESS',
  SAVE_MUSIC_FAILURE = 'MUSIC.SAVE_MUSIC#FAILURE',
}

export const initialState: MusicState = { list: [], count: 0, lastCount: 0 };

export interface Music {
  path: string,
  metadata: Metadata,
  isSelected: boolean,
}

export interface OpenMusicRequestPayload {
  path: Music['path'],
  metadata: RawMetadata,
}

export type AddMusicRequestPayload = OpenMusicRequestPayload;
export type UpdateMusicRequestPayload = OpenMusicRequestPayload;

export interface Metadata extends Omit<RawMetadata, 'image' | 'comment' | 'performerInfo' | 'partOfSet' | 'trackNumber'>{
  albumartist?: string,
  track?: string,
  disk?: string,
  comment?: string,
  picture?: string | Uint8Array,
}

export interface RawMetadata {
  title?: string,
  artist?: string,
  album?: string,
  genre?: string,
  trackNumber?: string,
  partOfSet?: string,
  performerInfo?: string,
  composer?: string,
  comment?: {
    text: string,
  },
  image?: {
    mime: string,
    imageBuffer: Uint8Array[],
  },
}

export interface SaveMusicPayload {
  filePaths: Music['path'][];
  metadata: Partial<Metadata>;
}

export interface RemoveMusicPayload {
  filePaths: Music['path'][];
}
