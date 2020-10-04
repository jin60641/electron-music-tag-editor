import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';

import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { getType } from 'typesafe-actions';

import actions from 'store/music/actions';

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
  const src = useMemo(() => rowData?.metadata?.picture[0], [rowData]);
  const [validUrl, setValidUrl] = useState<string | null>(null);
  const classes = useStyles();

  const onError = useCallback(() => {
    if (src) {
      window.bridge.ipc.send(getType(actions.addMusic.request), rowData?.path);
    }
  }, [rowData, src]);

  useEffect(() => {
    if (src) {
      const image = new Image();
      image.onload = () => {
        setValidUrl(src);
      };
      image.onerror = onError;
      image.src = src;
    } else {
      setValidUrl(null);
    }
  }, [src, onError]);

  return (
    <>
      {!validUrl ? (
        <Avatar
          className={classes.root}
        />
      ) : (
        <div
          className={classes.root}
          style={{ backgroundImage: `url('${validUrl}')` }}
        />
      )}
    </>
  );
};

export default Picture;
