import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';

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
import { useDispatch, useSelector } from 'react-redux';

import actions from 'store/music/actions';
import { Music } from 'store/music/types';
import { RootState } from 'store/types';

import ImageField from './ImageField';
import TextField from './TextField';
import { FieldKeys, Option } from './types';

const drawerWidth = 400;

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
}));

const selector = ({ music: { list } }: RootState) => list.filter(({ isSelected }) => isSelected);

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
}];

type Values = {
  [key in FieldKeys]: Option;
};

type Options = {
  [key in FieldKeys]: Option[];
};

const defaultOption = { label: '(유지)', value: undefined };

const initialValues: Values = {
  title: defaultOption,
  artist: defaultOption,
  album: defaultOption,
  comment: defaultOption,
  albumartist: defaultOption,
  genre: defaultOption,
  composer: defaultOption,
  track: defaultOption,
};

const initialOptions = {
  title: [],
  artist: [],
  album: [],
  comment: [],
  albumartist: [],
  genre: [],
  composer: [],
  track: [],
};

const uniqueList = (key: FieldKeys, list: Music[]) => list
  .reduce((arr, { metadata: { [key]: data } }) => ((data && !arr.find((item) => item.value === `${data}`))
    ? arr.concat({ value: data, label: `${data}` })
    : arr
  ), [] as Option[]);

const Drawer: React.FC = () => {
  const dispatch = useDispatch();
  const [values, setValues] = useState<Values>(initialValues);
  const [options, setOptions] = useState<Options>(initialOptions);
  const [picture, setPicture] = useState<string | undefined>(undefined);
  const classes = useStyles();
  const theme = useTheme();
  const list = useSelector(selector);
  const ids = useMemo(() => list.map(({ path }) => path).join(','), [list]);
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleChangeText = useCallback((
    name: FieldKeys,
    value: Option,
  ) => {
    setValues((v) => ({
      ...v,
      [name]: value,
    }));
  }, []);

  useEffect(() => {
    if (ids) {
      const nextOptions = Object.keys(initialOptions).reduce((obj, key) => ({
        ...obj,
        [key as FieldKeys]: uniqueList(key as FieldKeys, list),
      }), {} as Options);
      setOptions(nextOptions);
      const nextValues = Object.entries(nextOptions).reduce((obj, [key, v]) => ({
        ...obj,
        [key as FieldKeys]: v.length === 1 ? v[0] : defaultOption,
      }), {} as typeof values);
      setValues(nextValues);
    }
  }, [ids, list]);

  useEffect(() => {
    if (list.length >= 1) {
      handleDrawerOpen();
    } else {
      handleDrawerClose();
    }
  }, [handleDrawerClose, handleDrawerOpen, list.length]);

  const handleClickSave = useCallback(() => {
    const filePaths = list.map(({ path }) => path);
    const metadata = Object.entries(values).reduce((obj, [key, option]) => (
      (!!option && option.value !== undefined) ? ({
        ...obj,
        [key]: option.value,
      }) : obj), picture === undefined ? {} : { picture: picture.length ? [picture] : [] });
    dispatch(actions.saveMusic.request({
      filePaths,
      metadata,
    }));
  }, [list, picture, values, dispatch]);

  return (
    <MuiDrawer
      className={clsx(classes.drawer, open && classes.drawerShift)}
      variant='persistent'
      anchor='left'
      open={open}
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
            <ImageField
              ids={ids}
              setValue={setPicture}
              list={list}
            />
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
  );
};

export default Drawer;
