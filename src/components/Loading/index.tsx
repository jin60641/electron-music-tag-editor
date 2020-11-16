import React from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import { shallowEqual, useSelector } from 'react-redux';

import { RootState } from 'store/types';

const selector = ({ music: { lastCount, list, count } }: RootState) => ({
  count: count - lastCount,
  list: list.length - lastCount,
});

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    alignItems: 'center',
    display: 'flex',
    top: 0,
  },
});

const Loading: React.FC = () => {
  const classes = useStyles();
  const { count, list } = useSelector(selector, shallowEqual);

  if (list === count) {
    return null;
  }

  return (
    <LinearProgress
      className={classes.root}
      variant='determinate'
      value={(list / count) * 100}
    />
  );
};

export default Loading;
