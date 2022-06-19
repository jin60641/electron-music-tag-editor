import React from 'react';

import TextField from '@material-ui/core/TextField';
import AutoComplete from '@material-ui/lab/Autocomplete';
import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';
import { TFunction, useTranslation } from 'react-i18next';

import { FieldKeys, Option } from 'store/music/types';

const filterOptions = (t: TFunction) => (
  options: Option[],
  { inputValue }: FilterOptionsState<Option>,
) => options
  .concat(inputValue.length ? [{
    value: inputValue,
    label: inputValue,
  }] : [])
  .filter((option) => option.label.includes(inputValue))
  .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
  .slice(0, 5)
  .concat([{
    value: '',
    label: t('empty'),
  }, {
    value: undefined,
    label: t('keep'),
  }]);

interface Props {
  name: FieldKeys,
  label: string
  value: Option,
  options: Option[],
  onChange: (name: FieldKeys, value: Option) => void,
}

const getOptionLabel = (option: Option) => `${option.label || ''}`;
const Field: React.FC<Props> = ({
  name,
  label,
  options,
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  return (
    <AutoComplete
      size='small'
      options={options}
      filterOptions={filterOptions(t)}
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
        <>{option.value ? getOptionLabel(option) : <i>{option.label}</i>}</>
      )}
    />
  );
};

export default Field;
