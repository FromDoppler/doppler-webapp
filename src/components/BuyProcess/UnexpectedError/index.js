import { useIntl } from 'react-intl';
import { UnexpectedErrorStyled } from './index.styles';

export const UnexpectedError = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <UnexpectedErrorStyled data-testid="unexpected-error" className="p-t-54 p-b-54">
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12" style={{ textAlign: 'center' }}>
            <span>{_('common.unexpected_error')}</span>
          </div>
        </div>
      </section>
    </UnexpectedErrorStyled>
  );
};
