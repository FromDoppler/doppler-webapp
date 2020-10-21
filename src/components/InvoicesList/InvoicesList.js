import React, { useState, useEffect } from 'react';
import { Loading } from '../Loading/Loading';
import { InjectAppServices } from '../../services/pure-di';
import { Helmet } from 'react-helmet';
import HeaderSection from '../shared/HeaderSection/HeaderSection';
import { FormattedDate, FormattedMessage, useIntl, FormattedNumber } from 'react-intl';
import { Pagination } from '../shared/Pagination/Pagination';
import { useLocation, useRouteMatch } from 'react-router-dom';
import queryString from 'query-string';
import { extractParameter } from '../../utils';

const InvoicesList = ({ dependencies: { dopplerBillingApiClient } }) => {
  const [stateInvoices, setStateInvoices] = useState({ loading: true });
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const location = useLocation();
  const { url } = useRouteMatch();
  const invoicesPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const currentPage = extractParameter(location, queryString.parse, 'page') || 1;
      setStateInvoices({ loading: true });
      const invoicesResponse = await dopplerBillingApiClient.getInvoices(
        currentPage,
        invoicesPerPage,
      );
      if (!invoicesResponse.success) {
        setStateInvoices({ loading: false, items: [], success: false });
      } else {
        setStateInvoices({
          loading: false,
          success: true,
          items: invoicesResponse.value.items,
          totalItems: invoicesResponse.value.totalItems,
          currentPage: currentPage,
          pagesCount: Math.ceil(invoicesResponse.value.totalItems / invoicesPerPage),
        });
      }
    };

    fetchData();
  }, [dopplerBillingApiClient, location]);

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
            <div className="dp-msj-error bounceIn">
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
                    <FormattedMessage id="invoices_list.creation_date_column" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="invoices_list.due_date_column" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="invoices_list.currency_column" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="invoices_list.amount_column" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="invoices_list.paid_to_date_column" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="invoices_list.balance_column" />
                  </th>
                  <th scope="col">
                    <FormattedMessage id="invoices_list.downloads_column" />
                  </th>
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
                            <FormattedDate value={invoice.creationDate} />
                          </td>
                          <td>
                            {!!invoice.dueDate ? <FormattedDate value={invoice.dueDate} /> : null}
                          </td>
                          <td>{invoice.currency}</td>
                          <td>
                            <FormattedNumber value={invoice.amount} />
                          </td>
                          <td>
                            <FormattedNumber value={invoice.paidToDate} />
                          </td>
                          <td>
                            <FormattedNumber value={invoice.balance} />
                          </td>
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
                    <td colSpan={9}>
                      <span className="bounceIn">
                        <FormattedMessage id="invoices_list.no_data_msg" />
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
              {stateInvoices.totalItems > 0 && (
                <tfoot>
                  <tr>
                    <td colSpan={9}>
                      <Pagination
                        currentPage={stateInvoices.currentPage}
                        pagesCount={stateInvoices.pagesCount}
                        urlToGo={`${url}?`}
                      />
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </div>
      </section>
    </>
  );
};

export default InjectAppServices(InvoicesList);
