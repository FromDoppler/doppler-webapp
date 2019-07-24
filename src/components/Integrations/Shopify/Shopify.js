import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Loading from '../../Loading/Loading';
import { InjectAppServices } from '../../../services/pure-di';
import logo from './logo.svg';
import { FormattedHTMLMessage, injectIntl, FormattedDate } from 'react-intl';
import styled from 'styled-components';

const Shopify = ({ intl, dependencies: { shopifyClient } }) => {
  const [shops, setShops] = useState([]);
  const [isConnected, setIsConnected] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const ShopifyLogo = ({ className }) => (
    <img className={className} src={logo} alt="Shopify logo" />
  );
  const StyledShopifyLogo = styled(ShopifyLogo)`
    width: 80px;
    @media only screen and (max-width: 600px) {
      display: none;
    }
  `;

  useEffect(() => {
    const getData = async () => {
      const result = await shopifyClient.getShopifyData();
      if (!result.success) {
        setError(<FormattedHTMLMessage id="validation_messages.error_unexpected_HTML" />);
      } else if (result.value.length) {
        setIsConnected(true);
        setShops(result.value);
        setError(null);
      } else {
        setIsConnected(false);
        setError(null);
        setShops(result.value);
      }
      setIsLoading(false);
    };
    getData();
  }, [shopifyClient]);

  const shopifyHeader = (
    <>
      <div className="block">
        <h2>{_('shopify.header_title')}</h2>
        <p>
          <FormattedHTMLMessage id="shopify.header_subtitle" />
        </p>
      </div>
      <hr />
    </>
  );

  return (
    <>
      <Helmet title={_('shopify.title')} />
      {/* inline styles will be removed when breadcrum is ready in ui library */}
      <section className="page-wrapper" style={{ marginTop: '20px', marginBottom: '20px' }}>
        {_('common.control_panel')} | {_('common.advanced_preferences')}
        <div className="dp-integration" style={{ marginTop: '20px' }}>
          {isLoading ? (
            <>
              <div className="dp-integration__block">
                {shopifyHeader}
                <div className="block"></div>
              </div>
              <Loading />
            </>
          ) : error ? (
            <>
              <div className="dp-integration__block">
                {shopifyHeader}
                <div className="block">
                  <p>{error}</p>
                </div>
              </div>
              <footer className="dp-integration__actions">
                <button type="button" className="dp-button button-big primary-grey">
                  {_('common.back')}
                </button>
              </footer>
            </>
          ) : isConnected ? (
            <>
              <div className="dp-integration__block">
                {shopifyHeader}
                <div className="block dp-integration__status">
                  <div className="status__info">
                    <div>
                      <StyledShopifyLogo />
                      <div className="status__data">
                        <ul>
                          {shops.map((shop) => (
                            <li key={shop.shopName}>
                              <p>
                                {_('shopify.header_synchronization_date')}{' '}
                                <strong>
                                  <FormattedDate value={shop.synchronization_date} timeZone="UTC" />
                                </strong>
                              </p>
                              <p>
                                {_('shopify.header_store')} <strong> {shop.shopName} </strong>
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/*<button type="button" className="dp-button button-big primary-green">
                    {_('common.disconnect')}
                          </button>
                    TODO: uncomment when disconnect is implemented
                  */}
                </div>
              </div>
              <div className="dp-integration__block dp-integration--info">
                <header className="block">
                  <div>
                    <h2>{_('shopify.list_title')}</h2>
                    <p>{_('shopify.list_subtitle')}</p>
                  </div>
                  {/*<button className="dp-button button--has-icon"><span class="ms-icon icon-reload"></span></button> TODO: enable this button when ready*/}
                </header>
                <hr />
                <div className="block">
                  <ul>
                    {shops.map((shop) => (
                      <li key={shop.list.id}>
                        <p>
                          {/*{_('shopify.table_list')}: <strong> {shop.list.name} </strong> TODO: enable when we have listname as data*/}
                          Id: <strong> {shop.list.id} </strong>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="dp-integration__block">
                {shopifyHeader}
                <div className="block">{_('shopify.header_disconnected_warning')}</div>
              </div>

              <footer className="dp-integration__actions">
                <button type="button" className="dp-button button-big primary-grey">
                  {_('common.back')}
                </button>
                <button type="button" className="dp-button button-big primary-green">
                  {_('common.connect')}
                </button>
              </footer>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default InjectAppServices(injectIntl(Shopify));
