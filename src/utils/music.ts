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
  metadata: {
    image,
    trackNumber: track,
    partOfSet: disk,
    comment: { text: comment } = {},
    performerInfo: albumartist,
    ...other
  },
  path,
}) => ({
  path,
  isSelected: false,
  metadata: {
    ...other,
    albumartist,
    track,
    disk,
    comment,
    picture: image
      ? await readFileSync(new Blob([image.imageBuffer as unknown as BlobPart], { type: `image/${image.mime}` }))
      : undefined,
  },
});
