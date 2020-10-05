import React, { useState, useEffect } from 'react';
import { Loading } from '../Loading/Loading';
import { InjectAppServices } from '../../services/pure-di';
import { Helmet } from 'react-helmet';
import HeaderSection from '../shared/HeaderSection/HeaderSection';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';

const InvoicesList = ({ dependencies: { dopplerBillingApiClient } }) => {
  const [stateInvoices, setStateInvoices] = useState({ loading: true });
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  useEffect(() => {
    const fetchData = async () => {
      setStateInvoices({ loading: true });
      const invoicesResponse = await dopplerBillingApiClient.getInvoices(0, 0);
      if (!invoicesResponse.success) {
        setStateInvoices({ loading: false, items: [], success: false });
      } else {
        setStateInvoices({
          loading: false,
          success: true,
          items: invoicesResponse.value.items,
          totalItems: invoicesResponse.value.totalItems,
        });
      }
    };

    fetchData();
  }, [dopplerBillingApiClient]);

  return (
    <>
      <Helmet>
        <title>{_('invoices_list.title')}</title>
        <meta name="invoices" />
      </Helmet>
      <HeaderSection>
        <div className="col-sm-12 col-md-12 col-lg-12">
          <h2>
            <FormattedMessage id="invoices_list.title" />
          </h2>
          <p>
            <FormattedMessage id="invoices_list.sub_title" />
          </p>
        </div>
      </HeaderSection>
      <section className="dp-container">
        <div className="dp-table-responsive">
          {stateInvoices.loading ? (
            <Loading page />
          ) : !stateInvoices.success ? (
            <div class="dp-msj-error bounceIn">
              <p>
                <FormattedMessage id="invoices_list.error_msg" />
              </p>
            </div>
          ) : (
            <table className="dp-c-table">
              <thead>
                <tr>
                  <th scope="col">
                    <FormattedMessage id="invoices_list.account_id_column" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="invoices_list.product_column" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="invoices_list.date_column" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="invoices_list.currency_column" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="invoices_list.amount_column" />
                  </th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {stateInvoices.totalItems > 0 ? (
                  <>
                    {stateInvoices.items.map((invoice, index) => {
                      return (
                        <tr key={index}>
                          <td>{invoice.accountId}</td>
                          <td>{invoice.product}</td>
                          <td>
                            <FormattedDate value={invoice.date} />
                          </td>
                          <td>{invoice.currency}</td>
                          <td>{invoice.amount}</td>
                          <td>
                            {!!invoice.downloadInvoiceUrl ? (
                              <a href={invoice.downloadInvoiceUrl}>
                                <i className="ms-icon icon-download"> </i>
                                <span className="m-l-6 align-middle">
                                  <FormattedMessage id="invoices_list.download_msg" />
                                </span>
                              </a>
                            ) : (
                              <span>
                                <FormattedMessage id="invoices_list.no_download_msg" />
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <span className="bounceIn">
                        <FormattedMessage id="invoices_list.no_data_msg" />
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
};

export default InjectAppServices(InvoicesList);
