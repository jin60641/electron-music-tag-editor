import React, { useCallback } from 'react';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import MuiDrawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import layoutActions from 'store/layout/actions';
import { drawerWidth } from 'store/layout/types';
import musicActions from 'store/music/actions';
import { FieldKeys, Option } from 'store/music/types';
import { RootState } from 'store/types';

import ImageField from './ImageField';
import TextField from './TextField';

const handleWidth = 0;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 0,
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerContent: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    overflowY: 'scroll',
  },
  list: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
  drawerPaper: { width: drawerWidth },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 64,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  drawerShift: { width: drawerWidth },
  handlePaper: {
    width: handleWidth,
    backgroundColor: 'transparent',
    borderRight: '1px solid transparent',
  },
  handlePaperActive: {
    overflow: 'visible',
    transition: 'border-right .2s',
    cursor: 'pointer',
    '&:hover': { borderRight: `2px solid ${theme.palette.primary.main}` },
  },
  handleShift: { width: handleWidth },
}));

const selector = ({
  music: {
    list,
    input: {
      values,
      options,
      picture,
      isPictureChanged,
    },
  },
  layout: { drawer: isOpen },
}: RootState) => ({
  list: list.filter(({ isSelected }) => isSelected),
  isOpen,
  isPictureChanged,
  values,
  options,
  picture,
});

const FIELDS: { key: FieldKeys, label: string }[] = [{
  key: 'title',
  label: '곡명',
}, {
  key: 'artist',
  label: '아티스트',
}, {
  key: 'album',
  label: '앨범',
}, {
  key: 'albumartist',
  label: '앨범 아티스트',
}, {
  key: 'genre',
  label: '장르',
}, {
  key: 'comment',
  label: '코멘트',
}, {
  key: 'composer',
  label: '작곡가',
}, {
  key: 'track',
  label: '트랙',
}, {
  key: 'disk',
  label: '디스크',
}];

const Drawer: React.FC = () => {
  const dispatch = useDispatch();
  const {
    list,
    isOpen,
    values,
    options,
    picture,
    isPictureChanged,
  } = useSelector(selector, shallowEqual);
  const classes = useStyles();
  const theme = useTheme();

  const handleDrawerClose = useCallback(() => {
    dispatch(layoutActions.setDrawer(false));
  }, [dispatch]);

  const handleChangeText = useCallback((
    name: FieldKeys,
    value: Option,
  ) => {
    dispatch(musicActions.setInputValues({
      ...values,
      [name]: value,
    }));
  }, [dispatch, values]);

  const handleClickSave = useCallback(() => {
    const filePaths = list.map(({ path }) => path);
    const metadata = Object.entries(values).reduce((obj, [key, option]) => (
      (!!option && option.value !== undefined) ? ({
        ...obj,
        [key]: option.value,
      }) : obj), (picture === undefined || !isPictureChanged) ? {} : { picture });
    dispatch(musicActions.saveMusic({
      filePaths,
      metadata,
    }));
  }, [list, picture, values, dispatch, isPictureChanged]);

  const handleClickOpen = () => {
    dispatch(layoutActions.setDrawer(true));
  };

  return (
    <>
      <MuiDrawer
        className={clsx(classes.drawer, !isOpen && classes.handleShift)}
        variant='permanent'
        anchor='left'
        open={!isOpen}
        classes={{ paper: clsx(classes.handlePaper, list.length && classes.handlePaperActive) }}
        onClick={list.length ? handleClickOpen : undefined}
      />
      <MuiDrawer
        className={clsx(classes.drawer, isOpen && classes.drawerShift)}
        variant='persistent'
        anchor='left'
        open={isOpen}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.drawerHeader}>
          <Typography variant='h5'>
            {!!list.length && `${list.length} selected`}
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <div className={classes.drawerContent}>
          <List className={classes.list}>
            {FIELDS.map((field) => (
              <ListItem key={`Drawer-ListItem-${field.key}`}>
                <TextField
                  name={field.key}
                  label={field.label}
                  options={options[field.key]}
                  value={values[field.key]}
                  onChange={handleChangeText}
                />
              </ListItem>
            ))}
            <ListItem>
              <ImageField />
            </ListItem>
          </List>
          <List>
            <ListItem>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                onClick={handleClickSave}
              >
                Save
              </Button>
            </ListItem>
          </List>
        </div>
      </MuiDrawer>
    </>
  );
};

export default Drawer;
