import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createReducer } from 'typesafe-actions';

import musicActions from './actions';
import { initialState, MusicState } from './types';

const persistConfig = {
  key: 'music',
  storage,
};

const musicReducer = createReducer<MusicState>(initialState)
  .handleAction(musicActions.resetMusic, (state) => ({
    ...state,
    list: [],
  }))
  .handleAction(musicActions.selectMusic, (state, action) => {
    const list = [...state.list];
    list[action.payload].isSelected = !list[action.payload].isSelected;
    return {
      ...state,
      list,
    };
  })
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
