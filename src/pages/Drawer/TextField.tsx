import React from 'react';

import TextField from '@material-ui/core/TextField';
import AutoComplete from '@material-ui/lab/Autocomplete';
import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';

import { FieldKeys, Option } from './types';

const filterOptions: (
  options: Option[],
  state: FilterOptionsState<Option>
) => Option[] = (options, { inputValue }) => options
  .filter((option) => option.label.includes(inputValue))
  .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
  .slice(0, 5)
  .concat(inputValue.length ? [{
    value: inputValue,
    label: inputValue,
  }] : [])
  .concat([{
    value: '',
    label: '(공란)',
  }, {
    value: undefined,
    label: '(유지)',
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
}) => (
  <AutoComplete
    size='small'
    options={options}
    filterOptions={filterOptions}
    fullWidth
    value={value}
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

export default Field;
