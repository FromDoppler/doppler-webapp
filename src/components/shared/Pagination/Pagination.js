import React from 'react';

export const Pagination = ({ currentPage, pagesCount, paginate }) => {
  const pageNumbers = [...Array(pagesCount)].map((_, index) => index + 1);

  return (
    <div>
      <ul>
        {pageNumbers.map((number) => (
          <li key={number} style={{ display: 'inline-block', marginLeft: '5px' }}>
            <button onClick={() => paginate(number)}>{number}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
