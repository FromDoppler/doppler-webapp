import React from 'react';
import { FormattedMessage } from 'react-intl';

const Footer = () => (
  <footer className="footer-main">
    <div className="footer-wrapper">
      <span>
        <FormattedMessage id="footer.iso" />
      </span>
      <span>
        &copy; {new Date().getFullYear()} Doppler LLC.{' '}
        <FormattedMessage id="footer.allRightReserved" />.{' '}
        <a className="link--default" href="https://fromdoppler.com/privacidad">
          <FormattedMessage id="footer.privacy" />
        </a>
      </span>
    </div>
  </footer>
);

export default Footer;
