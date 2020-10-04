import * as musicMetadata from 'music-metadata-browser';

import { Music, OpenMusicRequestPayload } from 'store/music/types';

export const bufferToMusic: (payload: OpenMusicRequestPayload) => Promise<Music> = async ({
  buffer,
  path,
}) => {
  const blob = new Blob([buffer], { type: 'audio/mp3' });
  const url = window.URL.createObjectURL(blob);
  const {
    common: {
      comment: [comment] = [],
      track,
      genre: [genre] = [],
      composer: [composer] = [],
      picture = [],
      ...other
    },
  } = await musicMetadata.parseBlob(blob);

  return {
    // buffer,
    // blob,
    path,
    url,
    isSelected: false,
    metadata: {
      ...other,
      comment,
      picture: picture.map(({
        format: type,
        data,
      }) => URL.createObjectURL(new Blob([data], { type }))),
      track: (track.no && track.of) ? `${track.no}/${track.of}` : `${track.no || track.of || ''}`,
      genre,
      composer,
    },
  };
};
