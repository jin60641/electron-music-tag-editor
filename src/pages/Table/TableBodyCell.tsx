import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import { TableCellProps } from 'react-virtualized';

import CellText from './CellText';

const useStyles = makeStyles({
  tableCell: {
    borderBottom: 0,
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

interface Props extends TableCellProps {
  numeric?: boolean,
}

const TableBodyCell: React.FC<Props> = ({ cellData, numeric }) => {
  const classes = useStyles();

  return (
    <TableCell
      component='div'
      className={classes.tableCell}
      variant='body'
      align={(numeric || false) ? 'right' : 'left'}
    >
      <CellText cellData={cellData} />
    </TableCell>
  );
};

export default TableBodyCell;
