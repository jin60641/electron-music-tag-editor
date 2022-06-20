import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import { useSelector } from 'react-redux';
import { TableCellProps } from 'react-virtualized';
import { v4 as uuid } from 'uuid';

import { RootState } from 'store/types';


const selector = ({ table: { search } }: RootState) => search;

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

const highlight = (cellData: string, search: string) => {
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(escapedSearch, 'gi');
  const matched = [...cellData.matchAll(re)];
  return cellData.split(re).map((item, i) => i === 0 ? item : (
    <React.Fragment key={`${search}-${item}-${uuid()}`}>
      <mark>{matched![i - 1][0]}</mark>
      {item}
    </React.Fragment>
  ));
};


const TableBodyCell: React.FC<Props> = ({ cellData, numeric }) => {
  const search = useSelector(selector);
  const classes = useStyles();

  const data = (typeof cellData === 'string' && !!search.length) ? highlight(cellData, search) : cellData;
  return (
    <TableCell
      component='div'
      className={classes.tableCell}
      variant='body'
      align={(numeric || false) ? 'right' : 'left'}
    >
      {data}
    </TableCell>
  );
};

export default TableBodyCell;
