import { SaveMusicRequestPayload } from './types';

export const requestSaveMusic: (
  payload: SaveMusicRequestPayload,
) => Promise<undefined> = async (payload) => {
  window.bridge.ipc.send('SAVE_MUSIC', payload);
  return undefined;
};
