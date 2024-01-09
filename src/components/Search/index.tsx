import React, { useEffect, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import MuiSlide, { SlideProps } from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Close } from '@material-ui/icons';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import layoutActions from 'store/layout/actions';
import tableActions from 'store/table/actions';
import { RootState } from 'store/types';


const selector = ({ music: { list }, table: { searchQuery: search }, layout: { search: isVisible } }: RootState) => ({
  search,
  isVisible,
  list,
});

const useStyles = makeStyles(() => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    display: 'flex',
  },
  indiciator: { marginLeft: 6, width: 80 },
  input: { padding: '8px 10px', fontSize: 15 },
  icon: { fontSize: 20, padding: 2, borderRadius: 4, marginLeft: 6 },
  cursored: { backgroundColor: '#ff9800' },
}));

const Slide = (props: SlideProps) => {
  return <MuiSlide {...props} direction='down' />;
};

const Search = () => {
  const classes = useStyles();                                                                                                                                          
  const [searched, setSearched] = useState<HTMLElement[]>([]);
  const { list, search, isVisible } = useSelector(selector);
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(layoutActions.setSearch(false));
    dispatch(tableActions.setSearchQuery(''));
  };
  useEffect(() => {
    const handleKeyDownDocument = (e: KeyboardEvent) => {
      const { ctrlKey, metaKey, key } = e;
      if (key === 'f' && (ctrlKey || metaKey)) {
        dispatch(layoutActions.setSearch(true));
      }
    };
    document.body.addEventListener('keydown', handleKeyDownDocument);
    return () => {
      document.body.removeEventListener('keydown', handleKeyDownDocument);
    };
  }, [dispatch]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setIndex(0);
    dispatch(tableActions.setSearchQuery(e.target.value));
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      const nextIndex = (index + 1) % searched.length;
      setIndex(nextIndex);
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearched([...document.getElementsByTagName('mark')]);
    }, 10);
    return () => {
      clearTimeout(timer);
    };
  }, [search, list]);

  useEffect(() => {
    const el = searched[index];
    if (el) {
      el.scrollIntoView();
      el.classList.add(classes.cursored);
    }
    return () => {
      const prevEl = searched[index];
      if (prevEl) prevEl.classList.remove(classes.cursored);
    };
  }, [searched, index, classes]);

  return (
    <Snackbar
      open={isVisible}
      TransitionComponent={Slide}
      key={Slide.name}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Paper className={classes.root}>
        <TextField
          autoFocus
          value={search}
          variant='outlined'
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          inputProps={{ className: classes.input }}
          name='search'
          size='small'
        />
        <div className={classes.indiciator}>
          {searched.length ? `${index + 1} of ${searched.length}` : 'No Results'}
        </div>
        <IconButton key='close' color='inherit' onClick={handleClose} className={classes.icon}>
          <Close />
        </IconButton>
      </Paper>
    </Snackbar>
  );
};

export default Search;
