import { Link } from 'react-router-dom';

const BreadcrumbNew = ({ children }) => {
  return (
    <nav className="dp-bread-crumb">
      <ul>{children}</ul>
    </nav>
  );
};

const BreadcrumbNewItem = ({ href, text, active = false }) => {
  if (!!href) {
    return (
      <li>
        {/^(?:[a-z]+:)?\/\//.test(href) ? (
          <a href={href} className={active ? 'dp-bc--active' : ''}>
            {text}
          </a>
        ) : (
          <Link to={href} className={active ? 'dp-bc--active' : ''} data-testid="relative-path">
            {text}
          </Link>
        )}
      </li>
    );
  }

  return <li>{text}</li>;
};

export { BreadcrumbNew, BreadcrumbNewItem };
