export const Tabs = ({ tabsProperties }) => {
  return (
    <nav className="tabs-wrapper">
      <ul className="tabs-nav" data-tab-active="1">
        {tabsProperties.map((tab) => (
          <li className="tab--item" key={tab.key}>
            <a
              href={'#/'}
              className={tab.active ? 'tab--link active' : 'tab--link'}
              onClick={tab.handleClick}
            >
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="tabs-bg"></div>
    </nav>
  );
};
