import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AutoComplete from '@material-ui/lab/Autocomplete';
import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';
import { TFunction, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { defaultOption, FieldKeys, Option } from 'store/music/types';
import { RootState } from 'store/types';
import { getFilenameFromPath } from 'utils/common';

const filterOptions = (t: TFunction, suggestion?: string) => (
  options: Option[],
  { inputValue }: FilterOptionsState<Option>,
) => options
  .concat(inputValue.length ? [{
    value: inputValue,
    label: inputValue,
    hint: inputValue === suggestion ? t('from_filename_hint') : undefined,
  }] : [])
  .filter((option) => option.label.includes(inputValue))
  .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
  .slice(0, 5)
  .concat([...((suggestion && inputValue !== suggestion) ? [{
    value: suggestion,
    label: suggestion,
    hint: t('from_filename_hint'),
  }] : []), {
    value: '',
    label: t('empty'),
    hint: t('empty_hint'),
  }, {
    ...defaultOption,
    label: t(defaultOption.label),
  }]);

interface Props {
  name: FieldKeys,
  label: string
  value: Option,
  options: Option[],
  onChange: (name: FieldKeys, value: Option) => void,
}

const useStyles = makeStyles(() => ({
  optionRow: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

const selector = ({ music: { list } }: RootState) => list.filter(({ isSelected }) => isSelected);
const getOptionLabel = (option: Option) => `${option.label || ''}`;
const Field: React.FC<Props> = ({
  name,
  label,
  options,
  value,
  onChange,
}) => {
  const classes = useStyles();

  const list = useSelector(selector);
  const { t } = useTranslation();
  const suggestion = React.useMemo<string | undefined>(() => {
    if (list.length !== 1) {
      return undefined;
    }
    const [{ path }] = list;
    const filename = getFilenameFromPath(path, false);
    const chunks = filename.split(' - ');
    const suggestionSet: { [key in typeof name]?: string } = { artist: chunks[0], title: chunks.slice(1).join('-') };
    const ret = suggestionSet[name];
    if (!ret) {
      return undefined;
    }
    if (value.value === ret) {
      return undefined;
    }
    return ret;
  }, [list, value, name]);
  return (
    <AutoComplete
      size='small'
      options={options}
      filterOptions={filterOptions(t, suggestion)}
      fullWidth
      value={{ ...value, label: t(value.label) }}
      selectOnFocus
      handleHomeEndKeys
      clearOnBlur
      freeSolo
      onChange={(_, v) => (v
        ? onChange(name, typeof v === 'string'
          ? { value: v, label: v }
          : v)
        : undefined
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant='outlined'
          label={label}
          name={name}
        />
      )}
      getOptionLabel={getOptionLabel}
      renderOption={(option) => (
        <div className={classes.optionRow}>
          <span>{option.value ? getOptionLabel(option) : <i>{option.label}</i>}</span>
          <span>{!!option.hint && <i>{option.hint}</i>}</span>
        </div>
      )}
    />
  );
};

export default Field;
