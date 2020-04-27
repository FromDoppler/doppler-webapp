import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Helmet } from 'react-helmet';

const ReportsNew = () => {
  return (
    <>
      <FormattedMessage id="reports_title">
        {(reports_title) => (
          <Helmet>
            <title>{reports_title}</title>
          </Helmet>
        )}
      </FormattedMessage>
      <section className="dp-container m-t-24">
        <FormattedMessage id="reports_title" />
      </section>
    </>
  );
};

export default ReportsNew;
