import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';

/**
 * LanguageSelector
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 */
const LanguageSelector = ({ intl }) => {
  const lang = intl.locale;
  const languageDropdown = useRef(null);

  useEffect(() => {
    const menubutton = new window.Menubutton(languageDropdown.current);
    menubutton.init();
  }, [languageDropdown]);

  return (
    <div className="dp-c-dropdown language-selector">
      {lang === 'es' ? (
        <>
          <button
            className="lang--es"
            id="menubutton"
            aria-haspopup="true"
            aria-controls="menu2"
            ref={languageDropdown}
          >
            ES
          </button>
          <ul id="menu2" role="menu" aria-labelledby="menubutton">
            <li role="none">
              <Link to="?lang=en" className="lang--en" role="menuitem">
                EN
              </Link>
            </li>
          </ul>
        </>
      ) : (
        <>
          <button
            className="lang--en"
            id="menubutton"
            aria-haspopup="true"
            aria-controls="menu2"
            ref={languageDropdown}
          >
            EN
          </button>
          <ul id="menu2" role="menu" aria-labelledby="menubutton">
            <li role="none">
              <Link to="?lang=es" className="lang--es" role="menuitem">
                ES
              </Link>
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default injectIntl(LanguageSelector);
