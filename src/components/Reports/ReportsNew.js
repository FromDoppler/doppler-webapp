import React, { useEffect, useState } from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { Helmet } from 'react-helmet';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../Loading/Loading';
import { BoxMessage } from '../styles/messages';

/**
 * @param { Object } props
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */

const ReportsNew = ({ dependencies: { datahubClient } }) => {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const response = await datahubClient.getAccountDomains();
      if (response.success) {
        setState({
          domains: response.value,
          domainSelected: response.value.length ? response.value[0] : null,
          loading: false,
        });
      } else {
        setState({ loading: false });
      }
    };

    fetchData();
  }, [datahubClient]);

  return (
    <>
      <FormattedMessage id="reports_title">
        {(reports_title) => (
          <Helmet>
            <title>{reports_title}</title>
          </Helmet>
        )}
      </FormattedMessage>

      <section className="dp-container m-t-24">
        <span>
          <FormattedMessage id="reports_title" />
        </span>
        <div>
          {state.loading ? (
            <Loading />
          ) : state.domains ? (
            state.domains.map((domain, index) => (
              <div>
                <span key={index}>{domain.name}</span>
                <FormattedDate value={domain.verified_date} />
              </div>
            ))
          ) : (
            <BoxMessage className="dp-msj-error bounceIn" spaceTopBottom>
              <FormattedMessage id="common.unexpected_error" />
            </BoxMessage>
          )}
        </div>
      </section>
    </>
  );
};

export default InjectAppServices(ReportsNew);
