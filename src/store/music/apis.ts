import { getType } from 'typesafe-actions';

import actions from './actions';
import { RemoveMusicsPayload, SaveMusicPayload } from './types';

export const requestSaveMusic: (
  payload: SaveMusicPayload,
) => Promise<undefined> = async (payload) => {
  window.bridge.ipc.send(getType(actions.saveMusic), payload);
  return undefined;
};

export const requestRemoveMusics: (
  payload: RemoveMusicsPayload,
) => Promise<undefined> = async (payload) => {
  window.bridge.ipc.send(getType(actions.removeMusics), payload);
  return undefined;
};
