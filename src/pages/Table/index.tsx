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
import { getType } from 'typesafe-actions';

import Loading from 'components/Loading';
import Search from 'components/Search';
import { drawerWidth } from 'store/layout/types';
import musicActions from 'store/music/actions';
import { Music } from 'store/music/types';
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
    display: 'flex',
    flexGrow: 1,
    height: '100vh',
    overflowX: 'auto',
  },
  headerCell: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  drag: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    border: '10px solid black',
    display: 'none',
  },
  dragShift: {
    left: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  },
  dragging: { display: 'block' },
  isHeaderDragging: { overflow: 'initial' },
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
  tableRowCursor: { backgroundColor: theme.palette.grey[200] },
  tableRowHover: { '&:hover': { backgroundColor: theme.palette.grey[200] } },
}));

const cellDataGetter: ColumnProps['cellDataGetter'] = ({
  dataKey,
  rowData,
}) => rowData.metadata[dataKey];

const getFilenameFromPath = (path: string) => path.split('/').slice(-1);

const COLUMNS: Columns = {
  isSelected: {
    label: <Check />,
    dataKey: 'isSelected',
    disableSort: true,
    disableResize: true,
    cellDataGetter: ({ rowData, dataKey }) => (
      <Check
        isChecked={rowData[dataKey]}
        id={rowData.path}
      />
    ),
  },
  picture: {
    label: <Picture />,
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
  disk: {
    label: '디스크',
    dataKey: 'disk',
    cellDataGetter,
  },
  comment: {
    label: '코멘트',
    dataKey: 'comment',
    cellDataGetter,
  },
  filename: {
    label: '파일명',
    dataKey: 'filename',
    cellDataGetter: ({ rowData: { path } }) => getFilenameFromPath(path),
  },
};

const selector = ({
  music: {
    list,
    lastSelected,
  },
  table: {
    columns,
    sortBy,
    sortDirection,
    rowHeight,
    headerHeight,
  },
  layout: { drawer: isDrawerOpen },
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
  isDrawerOpen,
  lastSelected,
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
    isDrawerOpen,
    lastSelected,
  } = useSelector(selector, shallowEqual);
  const classes = useStyles();

  const [isFileDragging, setIsFileDragging] = useState(false);
  const [isHeaderDragging, setIsHeaderDragging] = useState(false);
  const [contextAnchor, setContextAnchor] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
    column?: ColumnItem;
    row?: Music;
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

  const selectedRows = useMemo(() => rows.filter(({ isSelected }) => !!isSelected), [rows]);

  const handleClickRow = useCallback(({ index, event: e }: RowMouseEventHandlerParams) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      dispatch(musicActions.selectMusicAdd(index));
    } else if (e.shiftKey) {
      dispatch(musicActions.selectMusicMulti(index));
      const selection = document.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    } else {
      dispatch(musicActions.selectMusic(index));
    }
  }, [dispatch]);

  const handleRightClickRow = useCallback((params: RowMouseEventHandlerParams) => {
    const { event: e, index } = params;
    if (!rows[index].isSelected) {
      handleClickRow(params);
    }
    if (index >= 0) {
      setContextAnchor({
        mouseX: e.clientX - 2,
        mouseY: e.clientY - 4,
        row: rows[index],
      });
    }
  }, [handleClickRow, rows]);

  const getRowClassName: TableProps['rowClassName'] = useCallback(({ index }) => clsx(
    classes.tableRow,
    classes.flexContainer,
    {
      [classes.tableRowHover]: index !== -1 && handleClickRow != null,
      [classes.tableRowCursor]: index === lastSelected,
    },
  ), [handleClickRow, lastSelected]);

  const handleSort = useCallback((payload) => {
    dispatch(tableActions.setSort(payload));
  }, [dispatch]);

  const handleDragStart = useCallback(() => {
    setIsHeaderDragging(true);
  }, []);

  const handleDragEnd = useCallback((result) => {
    setIsHeaderDragging(false);
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
    if (columnIndex > 0) {
      setContextAnchor({
        mouseX: e.clientX - 2,
        mouseY: e.clientY - 4,
        column: columns[columnIndex],
      });
    }
  }, [columns]);

  const dispatchRemoveMusics = useCallback(() => {
    const filePaths = selectedRows.map(({ path }) => path);
    dispatch(musicActions.removeMusic({ filePaths }));
  }, [dispatch, selectedRows]);

  const handleClickRemoveColumn = useCallback(() => {
    if (contextAnchor.column && columns.length) {
      handleCloseContextMenu();
      dispatch(tableActions.removeColumn(contextAnchor.column.dataKey));
    }
  }, [dispatch, columns, contextAnchor, handleCloseContextMenu]);

  const handleClickRemoveRow = useCallback(() => {
    if (contextAnchor.row) {
      handleCloseContextMenu();
      dispatchRemoveMusics();
    }
  }, [dispatch, contextAnchor, handleCloseContextMenu, dispatchRemoveMusics]);

  const tableProps = {
    rowHeight,
    headerHeight,
    sort: handleSort,
    sortBy,
    sortDirection,
    onRowClick: handleClickRow,
    onRowRightClick: handleRightClickRow,
    rowCount: rows.length,
  };

  const handleDragEnter = useCallback(() => {
    setIsFileDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsFileDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsFileDragging(true);
  }, []);

  const handleDrop = useCallback((e) => {
    setIsFileDragging(false);
    if (e.dataTransfer.files?.length) {
      window.bridge.ipc.send(
        getType(musicActions.openMusic.request),
        [...e.dataTransfer.files].map(({ path }) => path),
      );
      e.dataTransfer.clearData();
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    e.preventDefault();
    console.log(e.key);
    if (e.key === 'ArrowDown') {
      dispatch(musicActions.setLastSelected(Math.min(
        lastSelected === undefined ? 0 : lastSelected + 1,
        rows.length - 1,
      )));
    } else if (e.key === 'ArrowUp') {
      dispatch(musicActions.setLastSelected(Math.max(
        lastSelected === undefined ? 0 : lastSelected - 1,
        0,
      )));
    } else if (e.key === 'Backspace') {
      dispatchRemoveMusics();
    } else if (e.key === ' ' && lastSelected !== undefined) {
      dispatch(musicActions.selectMusicAdd(lastSelected));
    }
  }, [dispatch, lastSelected, rows, dispatchRemoveMusics]);

  return (
    <>
      <Loading />
      <div
        onDragEnter={handleDragEnter}
        className={classes.main}
      >
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
                      isDragging={isHeaderDragging}
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
                    role='searchbox'
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                  >
                    <RVTable
                      className={classes.table}
                      height={height}
                      width={width}
                      rowGetter={({ index }) => rows[index]}
                      {...tableProps}
                      rowClassName={getRowClassName}
                      headerClassName={clsx(
                        classes.headerCell,
                        isHeaderDragging && classes.isHeaderDragging,
                      )}
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
                              isDragging={isHeaderDragging}
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
                      {!!contextAnchor.column && (
                        <MenuItem onClick={handleClickRemoveColumn}>
                          {`'${contextAnchor.column.label}' 제거`}
                        </MenuItem>
                      )}
                      {!!contextAnchor.row && (
                        <MenuItem onClick={handleClickRemoveRow}>
                          {`'${contextAnchor.row.metadata.title || getFilenameFromPath(contextAnchor.row.path)}'`}
                          {selectedRows.length >= 2 && ` 외 ${selectedRows.length - 1}곡`}
                          {' 제거'}
                        </MenuItem>
                      )}
                    </Menu>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </AutoSizer>
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={clsx(
            classes.drag,
            isFileDragging && classes.dragging,
            isDrawerOpen && classes.dragShift,
          )}
        />
      </div>
      <Search />
    </>
  );
};

export default Table;
