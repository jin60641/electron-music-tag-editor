import { createTransform, persistReducer } from 'redux-persist';
import { createReducer } from 'typesafe-actions';

import musicActions from './actions';
import { initialState, MusicState } from './types';

const transform = createTransform((state: MusicState['list'], key) => (key === 'list' ? state.map(({
  metadata: {
    picture,
    ...metadata
  },
  ...item
}) => ({
  ...item,
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
    count: 0,
    list: [],
  }))
  .handleAction(musicActions.setCount, (state, action) => ({
    ...state,
    count: state.count + action.payload,
    lastCount: state.list.length,
  }))
  .handleAction(musicActions.selectMusic, (state, action) => ({
    ...state,
    lastSelected: action.payload,
    list: state.list.map((music, i) => ({
      ...music,
      isSelected: i === action.payload,
    })),
  }))
  .handleAction(musicActions.removeMusic, (state, action) => ({
    ...state,
    list: state.list.filter((item) => !action.payload.filePaths.includes(item.path)),
  }))
  .handleAction(musicActions.selectMusicMulti, (state, action) => ({
    ...state,
    lastSelected: action.payload,
    list: state.list.map((music, i) => {
      if (state.lastSelected === undefined || state.lastSelected === i) {
        return {
          ...music,
          isSelected: i === action.payload ? !music.isSelected : music.isSelected,
        };
      }

      if (
        state.lastSelected < action.payload
        && i > state.lastSelected
        && i <= action.payload
      ) {
        return {
          ...music,
          isSelected: !state.list[action.payload].isSelected,
        };
      }

      if (
        state.lastSelected > action.payload
        && i < state.lastSelected
        && i >= action.payload
      ) {
        return {
          ...music,
          isSelected: !state.list[action.payload].isSelected,
        };
      }

      return music;
    }),
  }))
  .handleAction(musicActions.selectMusicAdd, (state, action) => ({
    ...state,
    lastSelected: action.payload,
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
  .handleAction(musicActions.saveMusic, (state, action) => ({
    ...state,
    lastCount: state.list.length - action.payload.filePaths.length,
    count: state.list.length - action.payload.filePaths.length,
    list: state.list.map((item) => (action.payload.filePaths.includes(item.path) ? ({
      ...item,
      metadata: {
        ...item.metadata,
        ...action.payload.metadata,
      },
    }) : item)),
  }))
  .handleAction(musicActions.updateMusic.success, (state, action) => {
    const list = [...state.list];
    const index = state.list.findIndex(({ path }) => path === action.payload.path);
    list[index] = { ...action.payload, isSelected: list[index].isSelected };
    return {
      ...state,
      list,
      count: state.count + 1,
    };
  })
  .handleAction(musicActions.addMusic.success, (state, action) => {
    const list = [...state.list];
    const index = state.list.findIndex(({ path }) => path === action.payload.path);
    if (index >= 0) {
      list[index] = { ...action.payload, isSelected: list[index].isSelected };
      return {
        ...state,
        list,
        count: state.count - 1,
      };
    }
    return {
      ...state,
      list: list.concat(action.payload),
    };
  });

export default persistReducer(persistConfig, musicReducer);
