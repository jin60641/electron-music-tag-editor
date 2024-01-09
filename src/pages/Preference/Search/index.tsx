import React, { useCallback } from 'react';

import MuiCheckbox from '@material-ui/core/Checkbox';
import MuiFormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import tableActions from 'store/table/actions';
import { RootState } from 'store/types';

const FormControlLabel = withStyles((theme) => ({
  root: {
    margin: theme.spacing(-1),
    marginBottom: theme.spacing(1),
    display: 'flex',
  },
}))(MuiFormControlLabel);

const Checkbox = withStyles(() => ({
  root: {
    width: 36,
    height: 36,
  },
}))(MuiCheckbox);

const selector = ({ table: { searchSetting } }: RootState) => searchSetting;

const Search: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const settings = useSelector(selector);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const nextSetting = {
      ...settings,
      [e.target.name]: e.target.checked,
    };
    dispatch(tableActions.setSearchSetting(nextSetting));
  }, [dispatch, settings]);

  return (
    <div>
      {Object.entries(settings).map(([key, value]) => (
        <FormControlLabel
          key={`Preference-Search-${key}`}
          control={(
            <Checkbox
              color='primary'
              name={key}
              value={value}
              checked={value}
              onChange={handleChange}
            />
          )}
          label={t(key)}
        />
      ))}
    </div>
  );
};

export default Search;
