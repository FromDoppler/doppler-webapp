import React from 'react';

const ContentSection = ({ cssClass, children }) => {
  return <section className={cssClass}>{children}</section>;
};

export default ContentSection;
