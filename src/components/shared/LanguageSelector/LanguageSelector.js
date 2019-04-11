import React from 'react';
import { Link } from 'react-router-dom';

const LanguageSelector = ({ lang }) => {
  return (
    <div className="language-selector">
      {lang === 'es' ? (
        <>
          <div className="lang-option option--selector">
            <button className="lang--es">ES</button>
          </div>
          <div className="lang-option">
            <Link to="?lang=en" className="lang--en">
              EN
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="lang-option option--selector">
            <button className="lang--en">EN</button>
          </div>
          <div className="lang-option">
            <Link to="?lang=es" className="lang--es">
              ES
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
