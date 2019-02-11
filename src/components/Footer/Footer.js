import React from 'react';
import { FormattedMessage } from 'react-intl';

const Footer = () => (
  <footer>
    <div>
      <p>
        <span>
          <FormattedMessage id="footer.iso" />
        </span>
        <span>
          &copy; {new Date().getFullYear()} Doppler LLC.{' '}
          <FormattedMessage id="footer.allRightReserved" />.{' '}
          <a href="https://fromdoppler.com/privacidad">
            <FormattedMessage id="footer.privacy" />
          </a>
        </span>
      </p>
    </div>
  </footer>
);

export default Footer;
