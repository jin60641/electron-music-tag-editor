import React from 'react';

import {
  // useDispatch,
  useSelector,
} from 'react-redux';

import { RootState } from 'store/types';

const selector = ({ table: { search }, layout: { search: isVisible } }: RootState) => ({
  search,
  isVisible,
});

const Search = () => {
  const { search, isVisible } = useSelector(selector);
  // const dispatch = useDispatch();
  if (!isVisible) {
    return null;
  }
  return (
    <div>
      {`${isVisible}`}
      {search}
    </div>
  );
};

export default Search;
