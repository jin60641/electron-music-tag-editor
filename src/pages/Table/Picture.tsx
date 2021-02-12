import React, { useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

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
  const picture = useMemo(() => rowData?.metadata?.picture, [rowData]);
  const classes = useStyles();

  return (
    <div
      className={classes.root}
      style={{ backgroundImage: `url('${picture || fallbackImg}')` }}
    />
  );
};

export default Picture;
