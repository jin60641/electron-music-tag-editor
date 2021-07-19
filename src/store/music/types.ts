export interface MusicState {
  list: Music[],
  search: SearchState[],
  input: InputState,
  count: number,
  lastCount: number,
  lastSelected?: number,
}

export type SearchState = { picture?: InputPicture } & InputValues;

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

  ADD_MUSICS_REQUEST = 'MUSIC.ADD_MUSICS',
  ADD_MUSICS_SUCCESS = 'MUSIC.ADD_MUSICS#SUCCESS',
  ADD_MUSICS_FAILURE = 'MUSIC.ADD_MUSICS#FAILURE',

  UPDATE_MUSICS_REQUEST = 'MUSIC.UPDATE_MUSICS',
  UPDATE_MUSICS_SUCCESS = 'MUSIC.UPDATE_MUSICS#SUCCESS',
  UPDATE_MUSICS_FAILURE = 'MUSIC.UPDATE_MUSICS#FAILURE',

  SAVE_MUSIC_REQUEST = 'MUSIC.SAVE_MUSIC',
  SAVE_MUSIC_SUCCESS = 'MUSIC.SAVE_MUSIC#SUCCESS',
  SAVE_MUSIC_FAILURE = 'MUSIC.SAVE_MUSIC#FAILURE',

  UPDATE_INPUT = 'MUSIC.UPDATE_INPUT',
  SET_INPUT_OPTIONS = 'MUSIC.SET_INPUT_OPTIONS',
  SET_INPUT_VALUES = 'MUSIC.SET_INPUT_VALUES',
  SET_INPUT_PICTURE = 'MUSIC.SET_INPUT_PICTURE',

  SEARCH_MUSIC_REQUEST = 'MUSIC.SEARCH_MUSIC',
  SEARCH_MUSIC_SUCCESS = 'MUSIC.SEARCH_MUSIC#SUCCESS',
  SEARCH_MUSIC_FAILURE = 'MUSIC.SEARCH_MUSIC#FAILURE',
  RESET_SEARCH = 'MUSIC.RESET_SEARCH',

  OPEN_FINDER = 'MUSIC.OPEN_FINDER',
}

export const defaultOption = { label: '(유지)', value: undefined };

export const initialInputValues: InputValues = {
  title: defaultOption,
  artist: defaultOption,
  album: defaultOption,
  comment: defaultOption,
  albumartist: defaultOption,
  genre: defaultOption,
  composer: defaultOption,
  track: defaultOption,
  disk: defaultOption,
};

export const initialInputPicture: InputPicture = undefined;

export const initialInputOptions: InputOptions = {
  title: [],
  artist: [],
  album: [],
  comment: [],
  albumartist: [],
  genre: [],
  composer: [],
  track: [],
  disk: [],
};

export const initialState: MusicState = {
  list: [],
  count: 0,
  lastCount: 0,
  search: [],
  input: {
    values: initialInputValues,
    options: initialInputOptions,
    picture: initialInputPicture,
    isPictureChanged: false,
  },
};

export interface Music {
  path: string,
  metadata: Metadata,
  isSelected: boolean,
}

export interface OpenMusicRequestPayload {
  path: Music['path'],
  metadata: RawMetadata,
}

export type AddMusicsRequestPayload = OpenMusicRequestPayload[];
export type UpdateMusicsRequestPayload = OpenMusicRequestPayload[];

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

export type SearchMusicRequestPayload = string;

export type SearchMusicSuccessPayload = MusicState['search'];

export interface Option {
  value?: string | number,
  label: string,
}

export type FieldKeys = keyof Omit<Metadata, 'year' | 'picture'>;

export interface InputState {
  values: InputValues,
  options: InputOptions,
  picture: InputPicture,
  isPictureChanged: boolean,
}

export type InputPicture = string | undefined;

export type InputValues = {
  [key in FieldKeys]: Option;
};

export type InputOptions = {
  [key in FieldKeys]: Option[];
};
