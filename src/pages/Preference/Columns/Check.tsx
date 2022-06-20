import React, { useCallback } from 'react';

import MuiCheckbox from '@material-ui/core/Checkbox';
import MuiFormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { Draggable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import actions from 'store/table/actions';
import { Column } from 'store/table/types';
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

interface Props {
  isChecked: boolean;
  id: Column['dataKey'];
}

const Check: React.FC<Props> = ({ isChecked, id }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { checked, index } = useSelector(({ table: { columns } }: RootState) => ({
    checked: isChecked,
    index: columns.findIndex(({ dataKey }) => dataKey === id),
  }));

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      dispatch(actions.addColumn(id));
    } else {
      dispatch(actions.removeColumn(id));
    }
  }, [dispatch, id]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  }, []);

  return (
    <Draggable
      draggableId={`Preference-Columns-Draggable-${id}`}
      index={index}
    >
      {(draggableContext) => (
        <div
          ref={draggableContext.innerRef}
          {...draggableContext.draggableProps}
          {...draggableContext.dragHandleProps}
        >
          <FormControlLabel
            control={(
              <Checkbox
                color='primary'
                value={checked}
                checked={checked}
                onClick={handleClick}
                onChange={handleChange}
              />
            )}
            label={t(id)}
          />
        </div>
      )}
    </Draggable>
  );
};

export default Check;
