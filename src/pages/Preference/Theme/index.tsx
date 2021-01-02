import React from 'react';

import {
  // useDispatch,
  useSelector,
} from 'react-redux';

import { initialColumns } from 'store/table/types';
import { RootState } from 'store/types';

const selector = ({ table: { columns } }: RootState) => columns.map(({ dataKey }) => dataKey);

const Columns: React.FC = () => {
  const columns = useSelector(selector);
  return (
    <div>
      {initialColumns.map((column) => (
        <div key={`preference-column-${column.dataKey}`}>
          {columns.includes(column.dataKey) ? 'true' : 'false'}
        </div>
      ))}
    </div>
  );
};

export default Columns;
