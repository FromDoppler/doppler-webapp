import { useIntl } from 'react-intl';

const getTitle = () => {
  return {
    smallTitle: 'updatePaymentInformationSuccess.title',
    largeTitle: 'updatePaymentInformationSuccess.unlock_account_title',
  };
};

export const UpdatePaymentInformationSummaryTitle = ({}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const title = getTitle();

  return (
    <>
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <nav className="dp-breadcrumb">
              <ul>
                <li>
                  <span className="dp-uppercase">{_(title.smallTitle)}</span>
                </li>
              </ul>
            </nav>
            <h1>{_(title.largeTitle)}</h1>
          </div>
        </div>
      </section>
    </>
  );
};
