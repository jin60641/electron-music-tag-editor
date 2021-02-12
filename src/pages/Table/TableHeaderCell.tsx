import React, { useCallback } from 'react';

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
  width: number,
  isPlaceholder?: boolean,
  dataKey: DataKey,
  disableResize?: boolean,
  numeric?: boolean,
  onRightClick?: (e: React.MouseEvent<HTMLDivElement>, columnIndex: number) => void,
  isDragging?: boolean,
}

const direction: {
  [SortDirection.ASC]: 'asc',
  [SortDirection.DESC]: 'desc',
} = {
  [SortDirection.ASC]: 'asc',
  [SortDirection.DESC]: 'desc',
};

const useStyles = makeStyles((theme) => ({
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
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
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
}));

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
  numeric,
  disableSort,
  disableResize,
  dataKey,
  sortBy,
  width,
  columnIndex,
  sortDirection,
  isPlaceholder,
  isDragging,
  onRightClick,
}) => {
  const dispatch = useDispatch();

  const classes = useStyles();
  const { headerHeight } = useSelector(selector, shallowEqual);
  const resizeColumn = useCallback((deltaX: number) => {
    dispatch(tableActions.setColumnWidth({
      dataKey,
      width: Math.max(width + deltaX, 52),
    }));
  }, [width, dataKey, dispatch]);

  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!onRightClick) {
      return;
    }
    onRightClick(e, columnIndex);
  }, [onRightClick, columnIndex]);

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    dispatch(tableActions.setColumnWidth({
      dataKey,
      width: [...document.querySelectorAll(`[aria-colindex="${columnIndex + 1}"]`)].reduce((max, element) => Math.max(
        max,
        (element.firstElementChild?.scrollWidth || 0) + 10,
      ), 56),
    }));
  }, [dataKey, columnIndex, dispatch]);

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
          width,
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
              width,
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
            onDoubleClick={handleDoubleClick}
          >
            :
          </div>
        </DraggableCore>
      )}
    </>
  );
};

export default TableHeaderCell;
