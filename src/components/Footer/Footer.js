import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';

const Footer = () => (
  <footer className="dp-footer">
    <div className="dp-container-fluid">
      <div className="dp-rowflex">
        <div className="col-sm-12 col-md-6 col-lg-6">
          <p>
            <FormattedMessage id="footer.iso" />
          </p>
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6 dp-text-align">
          <FormattedMessageMarkdown id="common.copyright_MD" options={{ linkTarget: '_blank' }} />
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
