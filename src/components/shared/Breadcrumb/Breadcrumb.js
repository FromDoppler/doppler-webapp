import React from 'react';

const Breadcrumb = ({ children }) => {
  return (
    <nav className="dp-breadcrumb">
      <ul>{children}</ul>
    </nav>
  );
};

const BreadcrumbItem = ({ href, text }) => {
  return (
    <>
      {!!href ? (
        <li>
          <a href={href}>{text}</a>
        </li>
      ) : (
        <li>{text}</li>
      )}
    </>
  );
};

export { Breadcrumb, BreadcrumbItem };
