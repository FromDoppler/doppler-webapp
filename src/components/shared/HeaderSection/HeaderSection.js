import React from 'react';

const HeaderSection = ({ children }) => {
  return (
    <header className="hero-banner">
      <div className="dp-container">
        <div className="dp-rowflex">{children}</div>
      </div>
    </header>
  );
};

export default HeaderSection;
