import React from 'react';
import PropTypes from 'prop-types';

export const QAItem = ({ question, answer }) => {
  return (
    <ul className="dp-accordion">
      <li>
        <span className="dp-accordion-thumb">
          <b>{question}</b>
        </span>
        <div className="dp-accordion-panel">
          <div className="dp-accordion-content">{answer}</div>
        </div>
      </li>
    </ul>
  );
};

QAItem.propTypes = {
  question: PropTypes.object.isRequired,
  answer: PropTypes.object.isRequired,
};
