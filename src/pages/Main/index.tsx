import React from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';
// import { Link } from 'react-router-dom';
// import routes from 'constants/routes';

import Drawer from '../Drawer';
import Table from '../Table';

const useStyles = makeStyles(() => createStyles({
  main: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

const Main: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <Drawer />
      <Table />
    </div>
  );
};

export default Main;
