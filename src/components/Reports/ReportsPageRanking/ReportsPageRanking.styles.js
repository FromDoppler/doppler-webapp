import React from 'react';

export const PageRankingItem = ({children, index}) => <div key={index} className="page-ranking--item">{children}</div>;

export const PageRankingItemText = ({children}) => <p>{children}</p>;