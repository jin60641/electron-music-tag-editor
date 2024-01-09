import React from 'react';

import { shallowEqual, useSelector } from 'react-redux';
import { TableCellProps } from 'react-virtualized';
import { v4 as uuid } from 'uuid';

import { RootState } from 'store/types';

type Props = Pick<TableCellProps, 'cellData'>;

const selector = ({ table: { searchQuery, searchSetting: { shouldHighlight } } }: RootState) => ({
  searchQuery,
  shouldHighlight,
});

export const highlight = (cellData: Props['cellData'], search: string) => {
  if (typeof cellData !== 'string' || !search.length) {
    return { cellData: '', matched: [], re: '' };
  }
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(escapedSearch, 'gi');
  const matched = [...cellData.matchAll(re)];
  return { cellData, re, matched };
};

const CellText: React.FC<Props> = ({ cellData = '' }) => {
  const { searchQuery: search, shouldHighlight } = useSelector(selector, shallowEqual);
  const { cellData: typedCellData, re, matched } = highlight(cellData, search);

  if (matched.length === 0 || !shouldHighlight) {
    return cellData;
  }
  return typedCellData.split(re).map((item, i) => i === 0 ? item : (
    <React.Fragment key={`${search}-${item}-${uuid()}`}>
      <mark>{matched[i - 1][0]}</mark>
      {item}
    </React.Fragment>
  ));

};

export default CellText;
