import { useIntl } from 'react-intl';
import { FieldGroup } from '../../../form-helpers/form-helpers';

export const SuccessStepForm = ({ onBack, onFinish }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <FieldGroup className="dp-group-buttons">
        <li>
          <button
            type="button"
            className="dp-button button-medium ctaTertiary"
            onClick={() => onBack()}
          >
            {_('common.back')}
          </button>
        </li>
        <li>
          <button
            type="button"
            className="dp-button button-medium primary-green"
            onClick={() => onFinish(false)}
          >
            {_('common.finish')}
          </button>
        </li>
      </FieldGroup>
    </>
  );
};
