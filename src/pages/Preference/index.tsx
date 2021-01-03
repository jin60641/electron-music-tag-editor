import React, { useCallback } from 'react';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch, useSelector } from 'react-redux';

import layoutActions from 'store/layout/actions';
import { PreferenceState } from 'store/layout/types';
import { RootState } from 'store/types';

import Columns from './Columns';
import Language from './Language';
import Theme from './Theme';

const useStyles = makeStyles((theme) => ({
  back: {
    backgroundColor: 'rgba(0, 0, 0, .5)',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  modal: {
    maxHeight: 700,
    height: '100%',
    maxWidth: 800,
    width: '100%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  header: {
    padding: 10,
    paddingLeft: 30,
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  close: { fontSize: 20 },
  body: {
    flexDirection: 'row',
    display: 'flex',
    flexGrow: 1,
    paddingTop: 16,
  },
  menu: {
    flexDirection: 'column',
    display: 'flex',
    width: 230,
    paddingLeft: 20,
    paddingRight: 20,
  },
  content: {
    flexDirection: 'column',
    display: 'flex',
    flexGrow: 1,
  },
  menuItem: {
    textAlign: 'left',
    justifyContent: 'flex-start',
    padding: '4px 10px 4px 10px',
    transition: 'none',
    marginBottom: 4,
    boxShadow: 'none !important',
  },
  selectedMenuItem: { '&:hover': { backgroundColor: theme.palette.primary.main } },
}));

const selector = ({ layout: { preference } }: RootState) => preference;

const Map: {
  [key in PreferenceState]: React.FC<any>
} = {
  [PreferenceState.columns]: Columns,
  [PreferenceState.theme]: Theme,
  [PreferenceState.language]: Language,
};

const Preference: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const page = useSelector(selector);

  const handleClickMenu = useCallback((key: PreferenceState) => {
    dispatch(layoutActions.setPreference(key));
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(layoutActions.setPreference(undefined));
  }, [dispatch]);

  if (!page) {
    return null;
  }

  const Component = Map[page];

  return (
    <Modal
      className={classes.back}
      open
      onClose={handleClose}
    >
      <div className={classes.modal}>
        <div className={classes.header}>
          <div className={classes.title}>
            Preferences
          </div>
          <IconButton className={classes.close} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className={classes.body}>
          <div className={classes.menu}>
            {Object.values(PreferenceState).map((key) => (
              <Button
                key={`preference-menu-${key}`}
                onClick={() => handleClickMenu(key)}
                classes={{
                  root: classes.menuItem,
                  containedPrimary: classes.selectedMenuItem,
                }}
                variant={page === key ? 'contained' : 'text'}
                color={page === key ? 'primary' : undefined}
                disableRipple
              >
                {key}
              </Button>
            ))}
          </div>
          <div className={classes.content}>
            <Component />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Preference;
