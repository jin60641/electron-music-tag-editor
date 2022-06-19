import React, { useCallback } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useDispatch, useSelector } from 'react-redux';

import actions from 'store/locale/actions';
import { Locale } from 'store/locale/types';
import { RootState } from 'store/types';

const localeSelector = ({ locale: { code } }: RootState) => code;

const Language: React.FC = () => {
  const locale = useSelector(localeSelector);
  const dispatch = useDispatch();

  const handleChange = useCallback(async (e) => {
    dispatch(actions.setLocale(e.target.value));
  }, [dispatch]);

  return (
    <Select
      value={locale}
      onChange={handleChange}
    >
      {Object.entries(Locale).map(([key, value]) => (
        <MenuItem key={`Preference-Language-code-${key}`} value={value}>{key}</MenuItem>
      ))}
    </Select>
  );
};

export default Language;
