import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';

const Footer = () => (
  <footer className="footer-main">
    <div className="footer-wrapper">
      <span>
        <FormattedMessage id="footer.iso" />
      </span>
      <FormattedMessageMarkdown
        id="common.copyright_MD"
        values={{ year: new Date().getFullYear() }}
        options={{ linkTarget: '_blank' }}
      />
    </div>
  </footer>
);

export default Footer;
