import React from 'react';
import { QAItem } from './QAItem';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

export const FAQ = ({ topics }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <section className="p-t-54 p-b-54">
      <div className="dp-container">
        <div className="dp-rowflex">
          <div className="dp-align-center">
            <h2 className="dp-title-faq">{_('faq.title')}</h2>
          </div>
        </div>
        <div className="dp-rowflex">
          {topics.map(({ question, answer }, index) => (
            <div key={`qa-item-${index}`} className="col-md-6 col-lg-4">
              <QAItem question={question} answer={answer} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

FAQ.propTypes = {
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.object.isRequired,
      answer: PropTypes.object.isRequired,
    }),
  ).isRequired,
};
