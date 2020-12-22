import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { getType } from 'typesafe-actions';

import actions from 'store/music/actions';

const fallbackImg = require('assets/album-cover.png').default;

const useStyles = makeStyles((theme) => ({
  root: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.grey['400'],
    margin: theme.spacing(-1),
    borderRadius: 0,
    padding: 0,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
  },
  hide: { display: 'none' },
}));

interface Props {
  rowData?: any;
}

const Picture: React.FC<Props> = ({ rowData }) => {
  const [init, setInit] = useState(false);
  const path = useMemo(() => rowData?.path, [rowData]);
  const picture = useMemo(() => rowData?.metadata?.picture, [rowData]);
  const src = useMemo(() => picture?.[0], [picture]);
  const [validUrl, setValidUrl] = useState<string | null>(null);
  const classes = useStyles();

  const onError = useCallback(() => {
    if ((src || picture === undefined) && path && !init) {
      setInit(true);
      window.bridge.ipc.send(getType(actions.addMusic.request), path);
    }
  }, [init, path, picture, src]);

  const url = useMemo(() => validUrl || fallbackImg, [validUrl]);

  useEffect(() => {
    if (src && !(src instanceof Uint8Array)) {
      if (src !== url) {
        setValidUrl(null);
      }
      const image = new Image();
      image.onload = () => {
        setValidUrl(src);
      };
      image.onerror = onError;
      image.src = src;
    } else if (!src) {
      setValidUrl(null);
    }
  }, [src, url, onError]);

  useEffect(() => {
    if (picture === undefined) {
      onError();
    }
  }, [picture, onError]);

  return (
    <div
      className={classes.root}
      style={{ backgroundImage: `url('${url}')` }}
    />
  );
};

export default Picture;
