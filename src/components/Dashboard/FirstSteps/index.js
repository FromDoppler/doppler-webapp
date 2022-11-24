import React from 'react';
import { useIntl } from 'react-intl';
import { Loading } from '../../Loading/Loading';
import { UnexpectedError } from '../../shared/UnexpectedError';
import { ActionBox } from './ActionBox';

export const FirstSteps = ({ loading, hasError, firstSteps }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      {loading && <Loading />}
      <h2 className="dp-title-col-postcard">
        <span className="dp-icon-steps" />
        {_('dashboard.first_steps.section_name')}
      </h2>
      {!hasError ? (
        <ul className="dp-stepper">
          {firstSteps.map((firstStep) => (
            <li key={firstStep.titleId}>
              <ActionBox {...firstStep} />
            </li>
          ))}
        </ul>
      ) : (
        <UnexpectedError msgId="common.something_wrong" />
      )}
    </>
  );
};
