import React, { useCallback } from 'react';

import Button from '@material-ui/core/Button';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import tableActions from 'store/table/actions';
import { initialColumns } from 'store/table/types';
import { RootState } from 'store/types';

import Check from './Check';

const selector = ({ table: { columns } }: RootState) => columns;

const Columns: React.FC = () => {
  const dispatch = useDispatch();
  const columns = useSelector(selector);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) {
      return;
    }
    dispatch(tableActions.setColumnOrder({
      source: columns[result.source.index].dataKey,
      destination: columns[result.destination.index].dataKey,
    }));
  }, [dispatch, columns]);

  const handleClickReset = useCallback(() => {
    dispatch(tableActions.setColumns([...initialColumns]));
  }, [dispatch]);

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId='Preference-Column'
          direction='vertical'
        >
          {(droppableContext) => (
            <>
              <div
                {...droppableContext.droppableProps}
                ref={droppableContext.innerRef}
              >
                {columns.map(({ dataKey, isSelected }) => (
                  <Check
                    key={`preference-column-${dataKey}`}
                    id={dataKey}
                    isChecked={isSelected}
                  />
                ))}
              </div>
              {droppableContext.placeholder}
            </>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        variant='contained'
        color='secondary'
        onClick={handleClickReset}
      >
        Reset
      </Button>
    </div>
  );
};

export default Columns;
