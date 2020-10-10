import React, { useCallback, useState } from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import clsx from 'clsx';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { DraggableCore } from 'react-draggable';
import { useDispatch, useSelector } from 'react-redux';
import {
  AutoSizer,
  Column,
  ColumnProps,
  RowMouseEventHandlerParams,
  Table as RVTable,
  SortDirection,
  TableCellProps,
  TableHeaderProps,
  TableProps,
} from 'react-virtualized';

import actions from 'store/music/actions';
import { Metadata } from 'store/music/types';
import { RootState } from 'store/types';

import Check from './Check';
import Picture from './Picture';

const useStyles = makeStyles((theme) => ({
  main: {
    minWidth: '100vw',
    height: '100vh',
  },
  cell: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  handle: {
    width: 18,
    position: 'absolute',
    right: 0,
    height: '100%',
    cursor: 'col-resize',
  },
  table: {
    fontFamily: theme.typography.fontFamily,
    '&:focus': { outline: 'none' },
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  tableRow: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    cursor: 'pointer',
  },
  tableCell: {
    borderBottom: 0,
    flex: 1,
  },
  tableRowHover: { '&:hover': { backgroundColor: theme.palette.grey[200] } },
  noClick: { cursor: 'initial' },
  placeholder: {},
}));

interface ColumnItem extends Omit<ColumnProps, 'dataKey' | 'width'> {
  dataKey: keyof Metadata | 'isSelected'
  width?: number;
  numeric?: boolean;
}

const cellDataGetter: ColumnProps['cellDataGetter'] = ({
  dataKey,
  rowData,
}) => rowData.metadata[dataKey];

const COLUMNS: ColumnItem[] = [
  {
    label: <Check />,
    dataKey: 'isSelected',
    cellDataGetter: ({ rowData, dataKey }) => (
      <Check
        cellData={rowData[dataKey]}
      />
    ),
  },
  {
    label: <Picture />,
    dataKey: 'picture',
    cellDataGetter: ({ rowData }) => (
      <Picture
        rowData={rowData}
      />
    ),
  },
  {
    label: '곡명',
    dataKey: 'title',
    cellDataGetter,
  },
  {
    label: '앨범',
    dataKey: 'album',
    cellDataGetter,
  },
  {
    label: '아티스트',
    dataKey: 'artist',
    cellDataGetter,
  },
  {
    label: '앨범 아티스트',
    dataKey: 'albumartist',
    cellDataGetter,
  },
  {
    label: '장르',
    dataKey: 'genre',
    cellDataGetter,
  },
  {
    label: '작곡가',
    dataKey: 'composer',
    cellDataGetter,
  },
  {
    label: '트랙',
    dataKey: 'track',
    numeric: true,
    cellDataGetter,
  },
  {
    label: '코멘트',
    dataKey: 'comment',
    cellDataGetter,
  },
];

const rowHeight = 56;
const headerHeight = 65;
const sort = undefined;

interface CellProps extends TableCellProps {}

interface HeaderProps extends TableHeaderProps, Pick<TableCellProps, 'columnIndex'> {
  isPlaceholder?: boolean,
  dataKey: ColumnItem['dataKey'],
}

const selector = ({ music: { list } }: RootState) => list;

const initialContextAnchor = {
  mouseX: null,
  mouseY: null,
};

const Table: React.FC = () => {
  const [widths, setWidths] = useState({
    isSelected: 68,
    picture: 68,
    title: 300,
    album: 300,
    artist: 180,
    albumartist: 180,
    genre: 150,
    composer: 180,
    track: 150,
    comment: 300,
  });
  const width = Object.values(widths).reduce((a, b) => a + b);
  const [contextAnchor, setContextAnchor] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
    columnIndex?: number;
  }>(initialContextAnchor);

  const dispatch = useDispatch();
  const list = useSelector(selector);
  const [columnOrder, setColumnOrder] = useState(Array(COLUMNS.length).fill(0).map((_, i) => i));
  const classes = useStyles();
  const columns = columnOrder.map((i) => ({ ...COLUMNS[i], width: widths[COLUMNS[i].dataKey] }));

  const resizeColumn = ({ dataKey, deltaX }: { dataKey: ColumnItem['dataKey'], deltaX: number }) => {
    setWidths((prevWidths) => ({
      ...prevWidths,
      [dataKey]: prevWidths[dataKey] + deltaX,
    }));
  };

  const handleHeaderRightClick = useCallback((
    e: React.MouseEvent<HTMLDivElement>,
    columnIndex: number,
  ) => {
    e.preventDefault();
    setContextAnchor({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
      columnIndex,
    });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextAnchor((state) => ({ ...state, ...initialContextAnchor }));
  }, []);

  const handleClickRow = useCallback(({ index }: RowMouseEventHandlerParams) => {
    dispatch(actions.selectMusic(index));
  }, [dispatch]);

  const getRowClassName: TableProps['rowClassName'] = ({ index }) => clsx(
    classes.tableRow,
    classes.flexContainer,
    { [classes.tableRowHover]: index !== -1 && handleClickRow != null },
  );

  const cellRenderer = ({ cellData, columnIndex }: CellProps) => (
    <TableCell
      component='div'
      className={clsx(
        classes.tableCell,
        classes.flexContainer,
        { [classes.noClick]: handleClickRow == null },
      )}
      variant='body'
      style={{ height: rowHeight }}
      align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
    >
      {cellData}
    </TableCell>
  );

  const headerRenderer = ({
    label,
    columnIndex,
    dataKey,
    sortBy,
    sortDirection,
    isPlaceholder,
  }: HeaderProps) => {
    const direction = {
      [SortDirection.ASC]: 'asc',
      [SortDirection.DESC]: 'desc',
    };

    const inner = !columns[columnIndex].disableSort && sort != null && !!sortDirection ? (
      <TableSortLabel active={dataKey === sortBy} direction={(direction as any)[sortDirection]}>
        {label}
      </TableSortLabel>
    ) : (
      label
    );

    if (isPlaceholder) {
      return (
        <TableCell
          component='div'
          className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
          variant='head'
          style={{ height: headerHeight }}
          align={columns[columnIndex].numeric || false ? 'right' : 'left'}
        >
          {inner}
        </TableCell>
      );
    }

    return (
      <div className={classes.cell}>
        <Draggable
          key={dataKey}
          draggableId={dataKey}
          index={columnIndex}
        >
          {(draggableContext) => (
            <TableCell
              onContextMenu={(e) => handleHeaderRightClick(e, columnIndex)}
              component='div'
              className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
              variant='head'
              align={columns[columnIndex].numeric || false ? 'right' : 'left'}
              innerRef={draggableContext.innerRef}
              {...draggableContext.draggableProps}
              {...draggableContext.dragHandleProps}
            >
              {inner}
            </TableCell>
          )}
        </Draggable>
        <DraggableCore
          onDrag={(_, { deltaX }) => resizeColumn({
            dataKey,
            deltaX,
          })}
        >
          <div className={classes.handle} />
        </DraggableCore>
      </div>
    );
  };

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) {
      return;
    }

    setColumnOrder((current) => {
      const order = [...current];
      const [removed] = order.splice(result.source.index, 1);
      order.splice(result.destination.index, 0, removed);
      return order;
    });
  }, []);

  const tableProps = {
    rowHeight,
    headerHeight,
    sort,
    onRowClick: handleClickRow,
    rowCount: list.length,
  };

  return (
    <div className={classes.main}>
      <AutoSizer>
        {({ height }) => (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId='Table'
              direction='horizontal'
              mode='virtual'
              renderClone={(provided, _snapshot, rubric) => (
                <div
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  className={classes.placeholder}
                >
                  {headerRenderer({
                    ...columns[rubric.source.index],
                    columnIndex: rubric.source.index,
                    isPlaceholder: true,
                  })}
                </div>
              )}
            >
              {(droppableContext) => (
                <div
                  {...droppableContext.droppableProps}
                  ref={droppableContext.innerRef}
                  style={{
                    width,
                    height,
                  }}
                >
                  <RVTable
                    className={classes.table}
                    height={height}
                    width={width}
                    rowGetter={({ index }) => list[index]}
                    {...tableProps}
                    rowClassName={getRowClassName}
                  >
                    {columns.map(({
                      className,
                      dataKey,
                      ...other
                    }, index: number) => (
                      <Column
                        key={`Column-${dataKey}`}
                        headerRenderer={(headerProps) => headerRenderer({
                          ...headerProps,
                          dataKey,
                          columnIndex: index,
                        })}
                        className={clsx(classes.flexContainer, className)}
                        cellRenderer={(cellProps) => cellRenderer({ ...cellProps })}
                        dataKey={dataKey}
                        {...other}
                      />
                    ))}
                  </RVTable>
                  <Menu
                    keepMounted
                    open={contextAnchor.mouseY !== null}
                    onClose={handleCloseContextMenu}
                    anchorReference='anchorPosition'
                    anchorPosition={
                      contextAnchor.mouseY !== null && contextAnchor.mouseX !== null
                        ? { top: contextAnchor.mouseY, left: contextAnchor.mouseX }
                        : undefined
                    }
                  >
                    {contextAnchor.columnIndex && (
                      <MenuItem onClick={handleCloseContextMenu}>
                        {`'${columns[contextAnchor.columnIndex].label}' 제거`}
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleCloseContextMenu}>정렬</MenuItem>
                    <MenuItem onClick={handleCloseContextMenu}>검색</MenuItem>
                    <MenuItem onClick={handleCloseContextMenu}>복사</MenuItem>
                  </Menu>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </AutoSizer>
    </div>
  );
};

export default Table;
