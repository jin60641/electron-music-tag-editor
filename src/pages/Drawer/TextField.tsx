import React, { useCallback, useEffect, useMemo } from 'react';

import TextField from '@material-ui/core/TextField';
import AutoComplete from '@material-ui/lab/Autocomplete';
import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';

import { Music } from 'store/music/types';

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
  list: Music[],
  value: Option,
  onChange: (name: FieldKeys, value: Option) => void,
}

const getOptionLabel = (option: Option) => `${option.label || ''}`;
const Field: React.FC<Props> = ({
  name,
  label,
  list,
  value,
  onChange,
}) => {
  const uniqueList = useCallback((key: FieldKeys) => list
    .reduce((arr, { metadata: { [key]: data } }) => ((data && !arr.find((item) => item.value === `${data}`))
      ? arr.concat({ value: data, label: `${data}` })
      : arr
    ), [] as Option[]),
  [list]);

  const options = useMemo(() => uniqueList(name), [name, uniqueList]);
  useEffect(() => {
    if (value.value === undefined && options.length === 1) {
      onChange(name, options[0]);
    }
  }, [value, options.length, name, options, onChange]);

  return (
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
};

export default Field;
