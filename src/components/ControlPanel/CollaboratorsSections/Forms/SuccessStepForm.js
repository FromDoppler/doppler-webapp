import { useIntl } from 'react-intl';
import { FieldGroup } from '../../../form-helpers/form-helpers';

export const SuccessStepForm = ({ onFinish, buttonLabelMessageId = 'common.finish' }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <FieldGroup className="dp-group-buttons">
        <li data-testid="success-form">
          <button
            type="button"
            className="dp-button button-medium primary-green"
            onClick={() => onFinish(false)}
          >
            {_(buttonLabelMessageId)}
          </button>
        </li>
      </FieldGroup>
    </>
  );
};
