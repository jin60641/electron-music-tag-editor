import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
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

interface ColumnItem extends Omit<ColumnProps, 'dataKey' | 'width' | 'cellDataGetter'> {
  dataKey: DataKey,
  disableResize?: boolean;
  width?: number;
  numeric?: boolean;
  cellDataGetter: ColumnProps['cellDataGetter'],
}

type Columns = {
  [key in DataKey]: ColumnItem;
};

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    flexGrow: 1,
    height: '100vh',
    overflow: 'hidden',
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
    background: `linear-gradient(90deg, ${theme.palette.grey[400]} 50%, transparent 50%), linear-gradient(90deg, ${theme.palette.grey[400]} 50%, transparent 50%), linear-gradient(0deg, ${theme.palette.grey[400]} 50%, transparent 50%), linear-gradient(0deg, ${theme.palette.grey[400]} 50%, transparent 50%)`,
    backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
    backgroundSize: '15px 4px, 15px 4px, 4px 15px, 4px 15px',
    animation: '$border-dance 20s infinite linear',
    display: 'none',
  },
  '@keyframes border-dance': {
    '0%': { backgroundPosition: '0 0, 100% 100%, 0 100%, 100% 0' },
    '100%': { backgroundPosition: '100% 0, 0 100%, 0 0, 100% 100%' },
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
  tableShift: { minWidth: `calc(100vw - ${drawerWidth}px)` },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  tableRow: {
    minWidth: '100vw',
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
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
    dataKey: 'title',
    cellDataGetter,
  },
  album: {
    dataKey: 'album',
    cellDataGetter,
  },
  artist: {
    dataKey: 'artist',
    cellDataGetter,
  },
  albumartist: {
    dataKey: 'albumartist',
    cellDataGetter,
  },
  genre: {
    dataKey: 'genre',
    cellDataGetter,
  },
  composer: {
    dataKey: 'composer',
    cellDataGetter,
  },
  track: {
    dataKey: 'track',
    cellDataGetter,
  },
  disk: {
    dataKey: 'disk',
    cellDataGetter,
  },
  comment: {
    dataKey: 'comment',
    cellDataGetter,
  },
  filename: {
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
  })).filter(({ isSelected }) => !!isSelected),
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
  const { t } = useTranslation();

  const [isFileDragging, setIsFileDragging] = useState(false);
  const [isHeaderDragging, setIsHeaderDragging] = useState(false);
  const [contextAnchor, setContextAnchor] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
    column?: ColumnItem;
    row?: Music;
  }>(initialContextAnchor);

  const rows = useMemo(() => (!sortBy) ? list : list.sort((a, b) => {
    const column = COLUMNS[sortBy].cellDataGetter;
    if (!column) {
      return 1;
    }
    const lValue = column({ rowData: a, dataKey: sortBy }) || '';
    const rValue = column({ rowData: b, dataKey: sortBy }) || '';
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
    const { ctrlKey, metaKey, shiftKey } = e;
    if (ctrlKey || metaKey) {
      dispatch(musicActions.selectMusicAdd(index));
    } else if (shiftKey) {
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
    const { event: { clientX, clientY }, index } = params;
    if (!rows[index].isSelected) {
      handleClickRow(params);
    }
    if (index >= 0) {
      setContextAnchor({
        mouseX: clientX - 2,
        mouseY: clientY - 4,
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
  ), [classes, handleClickRow, lastSelected]);

  const handleDragStart = useCallback(() => {
    setIsHeaderDragging(true);
  }, []);

  const handleDragEnd = useCallback((result) => {
    setIsHeaderDragging(false);
    if (!result.destination) {
      return;
    }

    dispatch(tableActions.setColumnOrder({
      source: columns[result.source.index].dataKey,
      destination: columns[result.destination.index].dataKey,
      isReplace: true,
    }));
  }, [dispatch, columns]);

  const handleCloseContextMenu = useCallback(() => {
    setContextAnchor((state) => ({ ...state, ...initialContextAnchor }));
  }, []);

  const handleHeaderRightClick = useCallback((
    e: React.MouseEvent<HTMLDivElement>,
    columnIndex: number,
  ) => {
    if (columnIndex > 0) {
      const { clientX, clientY } = e;
      setContextAnchor({
        mouseX: clientX - 2,
        mouseY: clientY - 4,
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
  }, [contextAnchor, handleCloseContextMenu, dispatchRemoveMusics]);

  const tableProps = {
    rowHeight,
    headerHeight,
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
    const { dataTransfer } = e;
    if (dataTransfer.files?.length) {
      window.bridge.ipc.send(
        getType(musicActions.openMusic.request),
        [...e.dataTransfer.files].map(({ path }) => path),
      );
      dataTransfer.clearData();
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    const { key, ctrlKey, metaKey } = e;
    if (key === 'ArrowDown') {
      dispatch(musicActions.setLastSelected(Math.min(
        lastSelected === undefined ? 0 : lastSelected + 1,
        rows.length - 1,
      )));
    } else if (key === 'ArrowUp') {
      dispatch(musicActions.setLastSelected(Math.max(
        lastSelected === undefined ? 0 : lastSelected - 1,
        0,
      )));
    } else if (key === 'Backspace') {
      dispatchRemoveMusics();
    } else if (key === ' ' && lastSelected !== undefined) {
      dispatch(musicActions.selectMusicAdd(lastSelected));
    } else if (key === 'a' && (ctrlKey || metaKey)) {
      e.preventDefault();
      dispatch(musicActions.selectMusicAll(true));
    }
  }, [dispatch, lastSelected, rows, dispatchRemoveMusics]);

  const handleClickOpenFinder = useCallback((e) => {
    e.persist();
    if (contextAnchor.row?.path) {
      window.bridge.ipc.send(getType(musicActions.openFinder), contextAnchor.row.path);
      handleCloseContextMenu();
    }
  }, [handleCloseContextMenu, contextAnchor]);

  const columnWidths = useMemo(() => columns.reduce((a, b) => a + b.width, 0), [columns]);

  return (
    <>
      <Loading />
      <div
        onDragEnter={handleDragEnter}
        className={classes.main}
      >
        <AutoSizer>
          {({ height, width }) => {
            const w = Math.max(
              columnWidths,
              document.documentElement.clientWidth || 0,
              window.innerWidth || 0,
            );

            return (
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
                        label={
                          columns[rubric.source.index].label
                          || t(columns[rubric.source.index].dataKey)
                        }
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
                        height,
                        width,
                        overflow: 'overlay hidden',
                      }}
                      role='searchbox'
                      onKeyDown={handleKeyDown}
                      tabIndex={0}
                    >
                      <RVTable
                        className={clsx(classes.table, isDrawerOpen && classes.tableShift)}
                        height={height}
                        overscanRowCount={50}
                        overscanIndicesGetter={({
                          cellCount,
                          overscanCellsCount,
                          startIndex,
                          stopIndex,
                        }) => ({
                          overscanStartIndex: Math.max(
                            0,
                            startIndex - overscanCellsCount,
                          ),
                          overscanStopIndex: Math.min(
                            cellCount - 1,
                            stopIndex + overscanCellsCount,
                          ),
                        })}
                        rowGetter={({ index }) => rows[index]}
                        width={w}
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
                          label,
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
                            label={label ?? t(dataKey)}
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
                            {console.log(t(contextAnchor.column.dataKey))}
                            {t('remove_column', { column: t(contextAnchor.column.dataKey) })}
                          </MenuItem>
                        )}
                        {!!contextAnchor.row && (
                          <MenuItem onClick={handleClickRemoveRow}>
                            {t('removeRow', {
                              row: contextAnchor.row.metadata.title
                                || getFilenameFromPath(contextAnchor.row.path),
                              count: selectedRows.length - 1,
                            })}
                          </MenuItem>
                        )}
                        {!!contextAnchor.row && (
                          <MenuItem onClick={handleClickOpenFinder}>
                            {t('show_in_finder')}
                          </MenuItem>
                        )}
                      </Menu>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            );
          }}
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
