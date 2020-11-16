import * as musicMetadata from 'music-metadata-browser';

import { Music, OpenMusicRequestPayload } from 'store/music/types';

export const readFileSync = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    resolve(reader.result as string);
  };
  reader.onerror = reject;
  reader.readAsDataURL(blob);
});

export const bufferToMusic: (payload: OpenMusicRequestPayload) => Promise<Music> = async ({
  buffer,
  path,
}) => {
  const blob = new Blob([buffer], { type: 'audio/mp3' });
  const url = await readFileSync(blob);
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
      picture: await Promise.all(picture.map(({
        format: type,
        data,
      }) => readFileSync(new Blob([data], { type })))),
      track: (track.no && track.of) ? `${track.no}/${track.of}` : `${track.no || track.of || ''}`,
      genre,
      composer,
    },
  };
};
