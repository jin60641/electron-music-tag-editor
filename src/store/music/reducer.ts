import { createTransform, persistReducer } from 'redux-persist';
import { createReducer } from 'typesafe-actions';

import musicActions from './actions';
import { initialState, MusicState } from './types';

const transform = createTransform((state: MusicState['list'], key) => (key === 'list' ? state.map(({
  metadata: {
    picture,
    ...metadata
  },
  url,
  ...item
}) => ({
  ...item,
  url: '',
  metadata,
})) : state));

const persistConfig = {
  key: 'music',
  storage: window.bridge.storage,
  transforms: [transform],
};

const musicReducer = createReducer<MusicState>(initialState)
  .handleAction(musicActions.resetMusic, (state) => ({
    ...state,
    list: [],
  }))
  .handleAction(musicActions.selectMusic, (state, action) => ({
    ...state,
    list: state.list.map((music, i) => ({
      ...music,
      isSelected: i === action.payload,
    })),
  }))
  .handleAction(musicActions.selectMusicAdd, (state, action) => ({
    ...state,
    list: state.list.map((music, i) => ({
      ...music,
      isSelected: i === action.payload ? !music.isSelected : music.isSelected,
    })),
  }))
  .handleAction(musicActions.selectMusicAll, (state, action) => ({
    ...state,
    list: state.list.map((music) => ({ ...music, isSelected: action.payload })),
  }))
  .handleAction(musicActions.openMusic.success, (state, action) => ({
    ...state,
    list: [action.payload],
  }))
  .handleAction(musicActions.addMusic.success, (state, action) => {
    const list = [...state.list];
    const index = state.list.findIndex(({ path }) => path === action.payload.path);
    if (index >= 0) {
      list[index] = { ...action.payload, isSelected: list[index].isSelected };
      return {
        ...state,
        list,
      };
    }
    return {
      ...state,
      list: list.concat(action.payload),
    };
  });

export default persistReducer(persistConfig, musicReducer);
