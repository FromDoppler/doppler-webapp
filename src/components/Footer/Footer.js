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
        <FormattedMessage id="footer.privacy_url">
          {(url) => (
            <a href={url}>
              <FormattedMessage id="footer.privacy" />
            </a>
          )}
        </FormattedMessage>
      </span>
    </div>
  </footer>
);

export default Footer;
