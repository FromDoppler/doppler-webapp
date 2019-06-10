import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { InjectAppServices } from '../../../services/pure-di';

/**
 * LanguageSelector
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 */
const LanguageSelector = ({
  intl,
  dependencies: {
    window: { Menubutton },
  },
}) => {
  const lang = intl.locale;
  const languageDropdown = useRef(null);

  useEffect(() => {
    const menubutton = new Menubutton(languageDropdown.current);
    menubutton.init();
  }, [languageDropdown]);

  return (
    <div className="dp-c-dropdown language-selector">
      <button
        className={'lang--' + lang}
        id="menubutton"
        aria-haspopup="true"
        aria-controls="menu2"
        ref={languageDropdown}
      >
        {lang.toLocaleUpperCase()}
      </button>
      <ul id="menu2" role="menu" aria-labelledby="menubutton">
        <li role="none">
          <Link
            to={'?lang=' + (lang === 'en' ? 'es' : 'en')}
            className={'lang--' + (lang === 'en' ? 'es' : 'en')}
            role="menuitem"
          >
            {lang === 'en' ? 'ES' : 'EN'}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default InjectAppServices(injectIntl(LanguageSelector));
