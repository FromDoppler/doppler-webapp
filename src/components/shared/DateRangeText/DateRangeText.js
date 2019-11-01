import React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { addDays } from '../../../utils';

export const FormattedDateRangeText = ({ dateFrom, dateTo }) => {
  return (
    <>
      <FormattedDate value={dateFrom} /> <FormattedMessage id="reports_box.to" />{' '}
      <FormattedDate value={addDays(dateTo, -1)} />{' '}
    </>
  );
};
