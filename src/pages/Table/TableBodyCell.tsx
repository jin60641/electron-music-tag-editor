import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import { useSelector } from 'react-redux';
import { TableCellProps } from 'react-virtualized';

import { RootState } from 'store/types';

const useStyles = makeStyles({
  tableCell: {
    borderBottom: 0,
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

const selector = ({ table: { rowHeight } }: RootState) => rowHeight;

interface Props extends TableCellProps {
  numeric?: boolean,
}

const TableBodyCell: React.FC<Props> = ({ cellData, numeric }) => {
  const rowHeight = useSelector(selector);
  const classes = useStyles();

  return (
    <TableCell
      component='div'
      className={classes.tableCell}
      variant='body'
      style={{ height: rowHeight }}
      align={(numeric || false) ? 'right' : 'left'}
    >
      {cellData}
    </TableCell>
  );
};

export default TableBodyCell;
