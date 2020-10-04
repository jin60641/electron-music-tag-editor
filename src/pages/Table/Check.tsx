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
  cellData?: boolean;
}

const selector = ({ music: { list } }: RootState) => list.every(({ isSelected }) => isSelected);

const Picture: React.FC<Props> = ({ cellData }) => {
  const isRoot = (cellData === undefined);
  const dispatch = useDispatch();
  const isChecked = useSelector(isRoot ? selector : () => cellData);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(actions.selectMusicAll(event.target.checked));
  }, [dispatch]);

  return (
    <Checkbox
      checked={isChecked}
      onChange={isRoot ? handleChange : undefined}
    />
  );
};

export default Picture;
