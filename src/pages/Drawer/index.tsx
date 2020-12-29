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
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import layoutActions from 'store/layout/actions';
import { drawerWidth } from 'store/layout/types';
import musicActions from 'store/music/actions';
import { RootState } from 'store/types';

import ImageField from './ImageField';
import TextField from './TextField';
import { FieldKeys, Option } from './types';

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

const selector = ({
  music: { list },
  layout: { drawer: isOpen },
}: RootState) => ({
  list: list.filter(({ isSelected }) => isSelected),
  isOpen,
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

const initialOptions: Options = {
  title: [],
  artist: [],
  album: [],
  comment: [],
  albumartist: [],
  genre: [],
  composer: [],
  track: [],
};

const Drawer: React.FC = () => {
  const dispatch = useDispatch();
  const { list, isOpen } = useSelector(selector, shallowEqual);
  const [values, setValues] = useState<Values>(initialValues);
  const [options, setOptions] = useState<Options>(initialOptions);
  const [picture, setPicture] = useState<string | undefined>(undefined);
  const classes = useStyles();
  const theme = useTheme();
  const ids = useMemo(() => list.map(({ path }) => path).join(','), [list]);

  const handleDrawerOpen = useCallback(() => {
    dispatch(layoutActions.setDrawer(true));
  }, [dispatch]);

  const handleDrawerClose = useCallback(() => {
    dispatch(layoutActions.setDrawer(false));
  }, [dispatch]);

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
      const nextOptions: Options = {} as Options;
      const nextValues: Values = {} as Values;
      Object.keys(initialOptions).forEach((key) => {
        const nextOption = list
          .reduce((arr, { metadata: { [key as FieldKeys]: data } }) => ((!arr.find((item) => item.value === `${data}`))
            ? arr.concat({ value: data, label: `${data}` })
            : arr
          ), [] as Option[]);
        nextValues[key as FieldKeys] = nextOption.length === 1 && nextOption[0].value
          ? nextOption[0]
          : defaultOption;
        nextOptions[key as FieldKeys] = nextOption.filter(({ value }) => !!value);
      });
      setOptions(nextOptions);
      setValues(nextValues);
    }
  }, [ids, list]);

  useEffect(() => {
    if (ids.length) {
      handleDrawerOpen();
    } else {
      handleDrawerClose();
    }
  }, [handleDrawerClose, handleDrawerOpen, ids]);

  const handleClickSave = useCallback(() => {
    const filePaths = list.map(({ path }) => path);
    const metadata = Object.entries(values).reduce((obj, [key, option]) => (
      (!!option && option.value !== undefined) ? ({
        ...obj,
        [key]: option.value,
      }) : obj), picture === undefined ? {} : { picture });
    dispatch(musicActions.saveMusic({
      filePaths,
      metadata,
    }));
  }, [list, picture, values, dispatch]);

  return (
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
