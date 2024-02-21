export const getFilenameFromPath = (path: string, withExtension: boolean = true) => {
  const ret = path.split('/').slice(-1)[0];
  if (withExtension) {
    return ret;
  } else {
    return ret.split('.')[0];
  }
};
