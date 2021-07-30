import React from 'react';

export const Loading = ({ page }) => {
  if (page) {
    return (
      <div data-testid="wrapper-loading" className="wrapper-loading">
        <div className="loading-page" />
      </div>
    );
  }
  return <div data-testid="loading-box" className="loading-box" />;
};
