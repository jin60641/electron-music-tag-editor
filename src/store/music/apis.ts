import { getType } from 'typesafe-actions';

import actions from './actions';
import { SaveMusicRequestPayload } from './types';

export const requestSaveMusic: (
  payload: SaveMusicRequestPayload,
) => Promise<undefined> = async (payload) => {
  window.bridge.ipc.send(getType(actions.saveMusic.request), payload);
  return undefined;
};
