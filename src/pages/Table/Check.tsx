import React, { useCallback } from 'react';

import MuiCheckbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import actions from 'store/music/actions';
import { RootState } from 'store/types';

const Checkbox = withStyles((theme) => ({
  root: {
    width: 36,
    height: 36,
    margin: theme.spacing(-1),
    padding: 0,
  },
}))(MuiCheckbox);

interface Props {
  isChecked?: boolean;
  id?: string;
}

const Check: React.FC<Props> = ({ isChecked, id }) => {
  const isRoot = (isChecked === undefined);
  const dispatch = useDispatch();
  const { checked, index } = useSelector(({ music: { list } }: RootState) => (
    isRoot ? ({ checked: list.every(({ isSelected }) => isSelected) })
      : ({
        checked: isChecked,
        index: list.findIndex(({ path }) => path === id),
      })
  ));

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isRoot) {
      dispatch(actions.selectMusicAll(e.target.checked));
    } else if (index) {
      dispatch(actions.selectMusicAdd(index));
    }
  }, [dispatch, index, isRoot]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  }, []);

  return (
    <Checkbox
      checked={checked}
      onClick={handleClick}
      onChange={handleChange}
    />
  );
};

export default Check;
