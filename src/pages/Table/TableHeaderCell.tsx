import React, { useCallback, useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import clsx from 'clsx';
import { Draggable } from 'react-beautiful-dnd';
import { DraggableCore } from 'react-draggable';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  TableCellProps as RVTableCellProps,
  TableHeaderProps as RVTableHeaderProps,
  SortDirection,
} from 'react-virtualized';

import tableActions from 'store/table/actions';
import { DataKey } from 'store/table/types';
import { RootState } from 'store/types';

export interface TableHeaderCellProps extends RVTableHeaderProps, Pick<RVTableCellProps, 'columnIndex'> {
  isPlaceholder?: boolean,
  dataKey: DataKey,
  disableResize?: boolean,
  numeric?: boolean,
  onRightClick?: (
    e: React.MouseEvent<HTMLDivElement>,
    columnIndex: number,
  ) => void,
  isDragging?: boolean,
}

const direction: {
  [SortDirection.ASC]: 'asc',
  [SortDirection.DESC]: 'desc',
} = {
  [SortDirection.ASC]: 'asc',
  [SortDirection.DESC]: 'desc',
};

const useStyles = makeStyles({
  isDragging: { overflow: 'initial' },
  resizeHandle: {
    width: 18,
    position: 'absolute',
    right: 0,
    height: '100%',
    cursor: 'col-resize',
    opacity: 0,
    transition: 'opacity .2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover, &:active': { opacity: 1 },
  },
  tableRow: {
    minWidth: '100vw',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    cursor: 'pointer',
  },
  tableCell: {
    borderBottom: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    alignItems: 'center',
  },
  sortLabel: {
    position: 'absolute',
    right: 10,
  },
  resizableHeader: { paddingRight: 28 },
  placeholder: {},
});

const selector = ({
  table: {
    columns,
    headerHeight,
  },
}: RootState) => ({
  columns,
  headerHeight,
});

const TableHeaderCell: React.FC<TableHeaderCellProps> = ({
  label,
  columnIndex,
  numeric,
  disableSort,
  disableResize,
  dataKey,
  sortBy,
  sortDirection,
  isPlaceholder,
  isDragging,
  onRightClick,
}) => {
  const dispatch = useDispatch();

  const classes = useStyles();
  const { headerHeight, columns } = useSelector(selector, shallowEqual);
  const columnWidth = useMemo(() => columns[columnIndex].width, [columns, columnIndex]);
  const resizeColumn = useCallback((deltaX: number) => {
    dispatch(tableActions.setColumnWidth({
      dataKey,
      width: Math.max(columnWidth + deltaX, 52),
    }));
  }, [columnWidth, dataKey, dispatch]);

  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!onRightClick) {
      return;
    }
    onRightClick(e, columnIndex);
  }, [onRightClick, columnIndex]);

  const tableCellProps: Partial<RVTableCellProps> & TableCellProps = {
    component: 'div',
    className: classes.tableCell,
    variant: 'head',
    align: numeric ? 'right' : 'left',
  };

  if (isPlaceholder) {
    return (
      <TableCell
        {...tableCellProps}
        style={{
          height: headerHeight,
          width: columnWidth,
        }}
      >
        {label}
      </TableCell>
    );
  }

  return (
    <>
      <Draggable
        key={dataKey}
        draggableId={dataKey}
        index={columnIndex}
      >
        {(draggableContext) => (
          <TableCell
            onContextMenu={handleContextMenu}
            {...tableCellProps}
            className={clsx(
              tableCellProps.className,
              !disableResize && classes.resizableHeader,
            )}
            innerRef={draggableContext.innerRef}
            {...draggableContext.draggableProps}
            {...draggableContext.dragHandleProps}
            style={{
              ...draggableContext.draggableProps.style,
              width: columnWidth,
            }}
          >
            {label}
          </TableCell>
        )}
      </Draggable>
      {!disableSort && !!sortDirection && !isDragging && (
        <TableSortLabel
          active={dataKey === sortBy}
          direction={direction[sortDirection]}
          className={classes.sortLabel}
        />
      )}
      {!disableResize && (
        <DraggableCore
          onDrag={(_e, { deltaX }) => {
            resizeColumn(
              deltaX,
            );
          }}
        >
          <div
            role='presentation'
            className={classes.resizeHandle}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            :
          </div>
        </DraggableCore>
      )}
    </>
  );
};

export default TableHeaderCell;
