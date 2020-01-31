import React from 'react';
import { Link } from 'react-router-dom';

export const Pagination = ({ currentPage, pagesCount, urlToGo }) => {
  const pageNumbers = [...Array(pagesCount)].map((_, index) => index + 1);

  return (
    <nav className="dp-pagination">
      <ul>
        {pageNumbers.map((number) => (
          <li key={number}>
            <Link to={`${urlToGo}page=${number}`}>{number}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
