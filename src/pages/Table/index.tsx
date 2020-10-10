import React, { useCallback, useMemo, useState } from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  AutoSizer,
  Column,
  ColumnProps,
  RowMouseEventHandlerParams,
  Table as RVTable,
  SortDirection,
  TableProps,
} from 'react-virtualized';

import musicActions from 'store/music/actions';
import tableActions from 'store/table/actions';
import { DataKey } from 'store/table/types';
import { RootState } from 'store/types';

import Check from './Check';
import Picture from './Picture';
import TableBodyCell from './TableBodyCell';
import TableHeaderCell from './TableHeaderCell';

interface ColumnItem extends Omit<ColumnProps, 'dataKey' | 'width'> {
  dataKey: DataKey,
  disableResize?: boolean;
  width?: number;
  numeric?: boolean;
}

type Columns = {
  [key in DataKey]: ColumnItem;
};

const useStyles = makeStyles((theme) => ({
  main: {
    minWidth: '100vw',
    height: '100vh',
  },
  headerCell: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  isDragging: { overflow: 'initial' },
  table: {
    fontFamily: theme.typography.fontFamily,
    minWidth: '100vw',
    '&:focus': { outline: 'none' },
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  tableRow: {
    minWidth: '100vw',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    cursor: 'pointer',
  },
  tableRowHover: { '&:hover': { backgroundColor: theme.palette.grey[200] } },
}));

const cellDataGetter: ColumnProps['cellDataGetter'] = ({
  dataKey,
  rowData,
}) => rowData.metadata[dataKey];

const COLUMNS: Columns = {
  isSelected: {
    label: <Check />,
    dataKey: 'isSelected',
    disableSort: true,
    disableResize: true,
    cellDataGetter: ({ rowData, dataKey }) => (
      <Check
        cellData={rowData[dataKey]}
      />
    ),
  },
  picture: {
    label: <Picture />,
    disableSort: true,
    disableResize: true,
    dataKey: 'picture',
    cellDataGetter: ({ rowData }) => (
      <Picture
        rowData={rowData}
      />
    ),
  },
  title: {
    label: '곡명',
    dataKey: 'title',
    cellDataGetter,
  },
  album: {
    label: '앨범',
    dataKey: 'album',
    cellDataGetter,
  },
  artist: {
    label: '아티스트',
    dataKey: 'artist',
    cellDataGetter,
  },
  albumartist: {
    label: '앨범 아티스트',
    dataKey: 'albumartist',
    cellDataGetter,
  },
  genre: {
    label: '장르',
    dataKey: 'genre',
    cellDataGetter,
  },
  composer: {
    label: '작곡가',
    dataKey: 'composer',
    cellDataGetter,
  },
  track: {
    label: '트랙',
    dataKey: 'track',
    cellDataGetter,
  },
  comment: {
    label: '코멘트',
    dataKey: 'comment',
    cellDataGetter,
  },
};

const selector = ({
  music: { list },
  table: {
    columns,
    sortBy,
    sortDirection,
    rowHeight,
    headerHeight,
  },
}: RootState) => ({
  list,
  columns: columns.map((column) => ({
    ...column,
    ...COLUMNS[column.dataKey],
  })),
  sortBy,
  sortDirection,
  rowHeight,
  headerHeight,
});

const initialContextAnchor = {
  mouseX: null,
  mouseY: null,
};

const Table: React.FC = () => {
  const dispatch = useDispatch();
  const {
    list,
    sortBy,
    sortDirection,
    columns,
    rowHeight,
    headerHeight,
  } = useSelector(selector, shallowEqual);
  const classes = useStyles();

  const [isDragging, setIsDragging] = useState(false);
  const [contextAnchor, setContextAnchor] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
    columnIndex?: number;
  }>(initialContextAnchor);
  const width = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0,
    columns.reduce((a, b) => a + b.width, 0),
  );

  const rows = useMemo(() => list.sort((a, b) => {
    const lValue = a.metadata[sortBy] || '';
    const rValue = b.metadata[sortBy] || '';
    if (lValue === rValue) {
      return 1;
    }
    return ((lValue < rValue)
      ? 1
      : -1
    ) * (sortDirection === SortDirection.ASC ? -1 : 1);
  }), [sortBy, sortDirection, list]);

  const handleClickRow = useCallback(({ index }: RowMouseEventHandlerParams) => {
    dispatch(musicActions.selectMusic(index));
  }, [dispatch]);

  const getRowClassName: TableProps['rowClassName'] = ({ index }) => clsx(
    classes.tableRow,
    classes.flexContainer,
    { [classes.tableRowHover]: index !== -1 && handleClickRow != null },
  );

  const handleSort = useCallback((payload) => {
    dispatch(tableActions.setSort(payload));
  }, [dispatch]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback((result) => {
    setIsDragging(false);
    if (!result.destination) {
      return;
    }

    dispatch(tableActions.setColumnOrder({
      source: result.source.index,
      destination: result.destination.index,
    }));
  }, [dispatch]);

  const handleCloseContextMenu = useCallback(() => {
    setContextAnchor((state) => ({ ...state, ...initialContextAnchor }));
  }, []);

  const handleHeaderRightClick = useCallback((
    e: React.MouseEvent<HTMLDivElement>,
    columnIndex: number,
  ) => {
    setContextAnchor({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
      columnIndex,
    });
  }, []);

  const handleClickRemoveColumn = useCallback(() => {
    if (contextAnchor.columnIndex) {
      handleCloseContextMenu();
      dispatch(tableActions.removeColumn(contextAnchor.columnIndex));
    }
  }, [dispatch, contextAnchor, handleCloseContextMenu]);

  const tableProps = {
    rowHeight,
    headerHeight,
    sort: handleSort,
    sortBy,
    sortDirection,
    onRowClick: handleClickRow,
    rowCount: rows.length,
  };

  return (
    <div className={classes.main}>
      <AutoSizer>
        {({ height }) => (
          <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Droppable
              droppableId='Table'
              direction='horizontal'
              mode='virtual'
              renderClone={(provided, _snapshot, rubric) => (
                <div
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                >
                  <TableHeaderCell
                    {...columns[rubric.source.index]}
                    columnIndex={rubric.source.index}
                    isDragging={isDragging}
                    isPlaceholder
                  />
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
                    rowGetter={({ index }) => rows[index]}
                    {...tableProps}
                    rowClassName={getRowClassName}
                    headerClassName={clsx(classes.headerCell, isDragging && classes.isDragging)}
                  >
                    {columns.map(({
                      className,
                      dataKey,
                      ...other
                    }, index: number) => (
                      <Column
                        key={`Column-${dataKey}`}
                        headerRenderer={(headerProps) => (
                          <TableHeaderCell
                            {...headerProps}
                            {...columns[index]}
                            columnIndex={index}
                            isDragging={isDragging}
                            onRightClick={handleHeaderRightClick}
                          />
                        )}
                        className={clsx(classes.flexContainer, className)}
                        cellRenderer={(props) => (
                          <TableBodyCell
                            {...props}
                            {...columns[props.columnIndex]}
                          />
                        )}
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
                      <MenuItem onClick={handleClickRemoveColumn}>
                        {`'${columns[contextAnchor.columnIndex].label}' 제거`}
                      </MenuItem>
                    )}
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
