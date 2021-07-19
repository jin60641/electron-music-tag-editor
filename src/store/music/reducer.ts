import { createTransform, persistReducer } from 'redux-persist';
import { createReducer } from 'typesafe-actions';

import musicActions from './actions';
import {
  defaultOption,
  FieldKeys,
  initialInputOptions,
  initialState,
  InputOptions,
  InputValues,
  MusicState,
  Option,
} from './types';

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
  blacklist: ['input'],
  transforms: [transform],
};

const musicReducer = createReducer<MusicState>(initialState)
  .handleAction(musicActions.resetMusic, (state) => ({
    ...state,
    count: 0,
    list: [],
  }))
  .handleAction(musicActions.updateInput, (state) => {
    const nextOptions: InputOptions = {} as InputOptions;
    const nextValues: InputValues = {} as InputValues;
    const list = state.list.filter(({ isSelected }) => !!isSelected);
    Object.keys(initialInputOptions).forEach((key) => {
      const nextOption = list
        .reduce((arr, { metadata: { [key as FieldKeys]: data } }) => ((!arr.find((item) => item.value === `${data}`))
          ? arr.concat({ value: data, label: `${data}` })
          : arr
        ), [] as Option[]);
      nextValues[key as FieldKeys] = nextOption.length === 1 && nextOption[0].value
        ? nextOption[0]
        : defaultOption;
      nextOptions[key as FieldKeys] = nextOption.filter(({ value }) => !!value);
    });
    const nextPicture = (list.length !== 1) ? undefined : list[0].metadata.picture;
    return {
      ...state,
      input: {
        values: nextValues,
        options: nextOptions,
        picture: nextPicture as string,
        isPictureChanged: false,
      },
    };
  })
  .handleAction(musicActions.setLastSelected, (state, action) => ({
    ...state,
    lastSelected: action.payload,
  }))
  .handleAction(musicActions.setCount, (state, action) => ({
    ...state,
    count: state.count + action.payload,
    lastCount: state.list.length,
  }))
  .handleAction(musicActions.resetSearch, (state) => ({
    ...state,
    search: [],
  }))
  .handleAction(musicActions.searchMusic.success, (state, action) => ({
    ...state,
    search: action.payload,
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
    count: state.count - action.payload.filePaths.length,
    lastCount: state.lastCount - action.payload.filePaths.length,
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
  .handleAction(musicActions.updateMusics.success, (state, action) => {
    const list = [...state.list];
    action.payload.forEach((music) => {
      const index = state.list.findIndex(({ path }) => path === music.path);
      list[index] = { ...music, isSelected: list[index].isSelected };
    });
    return {
      ...state,
      list,
      count: state.count + 1,
    };
  })
  .handleAction(musicActions.setInputValues, (state, action) => ({
    ...state,
    input: {
      ...state.input,
      values: action.payload,
    },
  }))
  .handleAction(musicActions.setInputOptions, (state, action) => ({
    ...state,
    input: {
      ...state.input,
      options: action.payload,
    },
  }))
  .handleAction(musicActions.setInputPicture, (state, action) => ({
    ...state,
    input: {
      ...state.input,
      picture: action.payload,
      isPictureChanged: true,
    },
  }))
  .handleAction(musicActions.addMusics.success, (state, action) => {
    const list = [...state.list];
    let { count } = state;
    action.payload.forEach((music) => {
      const index = state.list.findIndex(({ path }) => path === music.path);
      if (index >= 0) {
        list[index] = { ...music, isSelected: list[index].isSelected };
        count -= 1;
      } else {
        list.push(music);
      }
    });
    return {
      ...state,
      list,
      count,
    };
  });

export default persistReducer(persistConfig, musicReducer);
