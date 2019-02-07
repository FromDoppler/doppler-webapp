import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import './Footer.css';

const Footer = () => (
  <footer className="main-footer">
    <div className="wrapper">
      <p>
        <span>
          <FormattedHTMLMessage id="footer.iso" />
        </span>
        <span>
          &copy; {new Date().getFullYear()} Doppler LLC.{' '}
          <FormattedHTMLMessage id="footer.allRightReserved" />.{' '}
          <a className="link--default" href="https://fromdoppler.com/privacidad">
            <FormattedHTMLMessage id="footer.privacy" />
          </a>
        </span>
      </p>
    </div>
  </footer>
);

export default Footer;
