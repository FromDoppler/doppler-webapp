import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Loading } from '../../Loading/Loading';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedDate, useIntl } from 'react-intl';
import { SubscriberListState } from '../../../services/shopify-client';
import { StyledShopifyLogo } from './Shopify.styles';
import { FormattedMessageMarkdown } from '../../../i18n/FormattedMessageMarkdown';
import { Breadcrumb, BreadcrumbItem } from '../../shared/Breadcrumb/Breadcrumb';
import useInterval from '../../../hooks/useInterval';
import { UnexpectedError } from '../../shared/UnexpectedError';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';

export const FETCH_SHOPIFY_DATA_INTERVAL = 20000;

const ConnectWithShopify = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div className="dp-block">
      <h2>{_('shopify.header_title')}</h2>
      <FormattedMessageMarkdown linkTarget={'_blank'} id="shopify.header_subtitle_MD" />
    </div>
  );
};

const LastSyncronization = ({ shopName, lastSyncDate }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div className="dp-block dp-integration__status">
      <div className="dp-rowflex">
        <div className="col-sm-12 col-md-1 col-lg-1 m-b-24">
          <StyledShopifyLogo />
        </div>
        <div className="col-sm-12 col-md-8 col-lg-8 m-b-24">
          <div className="status__data">
            <ul>
              <li>
                <p>
                  {_('shopify.header_synchronization_date')}{' '}
                  <strong>
                    <FormattedDate value={lastSyncDate} />
                  </strong>
                </p>
                <p>
                  {_('shopify.header_store')} <strong>{shopName}</strong>
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-sm-12 col-md-3 col-lg-3">
          <div className="status__link dp-align-right">
            <a
              href={_('shopify.admin_apps_url', { shopName })}
              className="dp-button button-medium primary-green"
              rel="noopener noreferrer"
              target="_blank"
            >
              {_('shopify.admin_apps')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const FooterBox = ({ children }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <footer className="dp-integration__actions">
      <Link
        to={'/integrations#native-integrations'}
        className="dp-button button-medium primary-grey"
      >
        {_('common.back')}
      </Link>
      {children}
    </footer>
  );
};

const Table = ({ lists }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <tbody>
      {Array.isArray(lists) ? (
        lists.map((list, index) =>
          list.state === SubscriberListState.ready ? (
            <tr key={index}>
              <td>{_('shopify.entity_' + list.entity)}</td>
              <td>{list.name}</td>
              <td>{list.amountSubscribers}</td>
            </tr>
          ) : (
            <tr className="sync" key={index}>
              <td>{_('shopify.entity_' + list.entity)}</td>
              {list.state !== SubscriberListState.notAvailable ? (
                <>
                  <td>{list.name}</td>
                  <td className="text-sync">
                    <span className="ms-icon icon-clock"></span>
                    {_('common.synchronizing')}
                  </td>
                </>
              ) : (
                <td colSpan="2" className="text-sync">
                  {_('shopify.no_list_available')}
                </td>
              )}
            </tr>
          ),
        )
      ) : lists.state === SubscriberListState.ready ? (
        <tr>
          <td></td>
          <td>{lists.name}</td>
          <td>{lists.amountSubscribers}</td>
        </tr>
      ) : (
        <tr className="sync">
          lists.state !== SubscriberListState.notAvailable ? (
          <>
            <td></td>
            <td>{lists.name}</td>
            <td className="text-sync">
              <span className="ms-icon icon-clock"></span>
              {_('common.synchronizing')}
            </td>
          </>
          ) : (
          <td colSpan="2" className="text-sync">
            {_('shopify.no_list_available')}
          </td>
          )
        </tr>
      )}
    </tbody>
  );
};

const Shopify = ({ dependencies: { shopifyClient, dopplerApiClient } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const createInterval = useInterval();
  const [shopifyState, setShopifyState] = useState({
    isLoading: true,
  });
  const shopifyRef = useRef(shopifyState);
  const getShopifyDataRef = useRef(null);
  const iframeRef = useRef(null);
  shopifyRef.current = shopifyState;

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data.type === "setHeight" && iframeRef.current) {
        iframeRef.current.style.height = `${e.data.height}px`;
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const getShopifyData = async () => {
      const getSubscribersAmountFromAPI = async (listId) => {
        const resultAPI = await dopplerApiClient.getListData(listId);
        return resultAPI.success ? resultAPI.value.amountSubscribers : null;
      };

      const updateSubscriberCount = async (list) => {
        if (list) {
          const subscribersCount = await getSubscribersAmountFromAPI(list.id);
          if (subscribersCount) {
            return {
              ...list,
              amountSubscribers: subscribersCount,
            };
          }
          return list;
        }
        return null;
      };

      const shopifyResult = await shopifyClient.getShopifyData();
      if (shopifyResult.value && shopifyResult.value.length) {
        if (shopifyResult.value[0].list) {
          shopifyResult.value[0].list = await updateSubscriberCount(shopifyResult.value[0].list);
        } else {
          //updates only first shop
          // I'm using the old and reliable for loop here, because the forEach loop doesn't work properly with asynchronous functions
          for (let index = 0; index < shopifyResult.value[0].lists.length; index++) {
            shopifyResult.value[0].lists[index] = await updateSubscriberCount(
              shopifyResult.value[0].lists[index],
            );
          }
        }
      }
      return shopifyResult;
    };

    const fetchData = async () => {
      const result = await getShopifyData();
      if (!result.success && !shopifyRef.current.error) {
        setShopifyState({
          error: intl.formatMessage({ id: 'validation_messages.error_unexpected_MD' }),
        });
      } else if (result.value !== shopifyRef.current.shops) {
        setShopifyState({
          shops: result.value,
          isConnected: !!result.value.length,
        });
      }
    };

    getShopifyDataRef.current = fetchData;
    fetchData();
    createInterval(fetchData, FETCH_SHOPIFY_DATA_INTERVAL);
  }, [createInterval, shopifyClient, dopplerApiClient, intl]);

  const connect = () => setShopifyState({ isConnecting: true });

  if (shopifyState.isLoading) {
    return <Loading page />;
  }

  return (
    <>
      <Helmet title={_('shopify.title')} />
      <HeaderSection>
        <div className="col-sm-12">
          <Breadcrumb>
            <BreadcrumbItem
              href="/integrations#native-integrations"
              text={_('common.integrations')}
            />
            <BreadcrumbItem text={_('integrations.native_integrations.shopify_title')} />
          </Breadcrumb>
        </div>
      </HeaderSection>
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12">
            <div className="dp-integration">
              {shopifyState.error ? (
                <>
                  <div className="dp-box-shadow">
                    <ConnectWithShopify />
                    <hr />
                    <FooterBox />
                  </div>
                  <div className="m-t-24 m-b-24">
                    <UnexpectedError msg={shopifyState.error} />
                  </div>
                </>
              ) : shopifyState.isConnected ? (
                shopifyState.shops.map((shop) => (
                  <React.Fragment key={shop.shopName}>
                    <div className="dp-box-shadow">
                      <ConnectWithShopify />
                      <hr />
                      <LastSyncronization
                        shopName={shop.shopName}
                        lastSyncDate={shop.synchronization_date}
                      />
                    </div>
                    <div className="dp-box-shadow m-t-24 m-b-24">
                      <div className="dp-integration__block dp-integration--info">
                        <header className="dp-block">
                          <div>
                            <h2>{_('shopify.list_title')}</h2>
                            <p>{_('shopify.list_subtitle')}</p>
                          </div>
                          <button
                            onClick={getShopifyDataRef.current}
                            className="dp-button button--has-icon"
                            aria-label="sincronize"
                          >
                            <span className="ms-icon icon-reload" />
                          </button>
                        </header>
                        <hr />
                        <div className="dp-block">
                          <table className="dp-c-table">
                            <thead>
                              <tr>
                                <th>{_('shopify.entity_title')}</th>
                                <th>{_('shopify.table_list')}</th>
                                <th> {_('shopify.table_shopify_customers_count')}</th>
                              </tr>
                            </thead>
                            {shop.list != null ? (
                              <Table lists={shop.list} />
                            ) : (
                              <Table lists={shop.lists} />
                            )}
                          </table>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))
              ) : (
                <>
                  <div className="dp-box-shadow">
                    <ConnectWithShopify />
                    <hr />
                    <p className="dp-block">{_('shopify.header_disconnected_warning')}</p>
                    <FooterBox>
                      {!shopifyState.isConnecting ? (
                        <a
                          href={_('shopify.connect_url')}
                          className="dp-button button-medium primary-green"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={connect}
                        >
                          {_('common.connect')}
                        </a>
                      ) : (
                        <button
                          disabled
                          className="dp-button button-medium primary-green button--loading"
                        >
                          {_('common.connect')}
                        </button>
                      )}
                    </FooterBox>
                  </div>
                </>
              )}
            <div className="dp-box-shadow m-b-24" style={{ display: "none" }}>
              <iframe
                ref={iframeRef}
                src="/integration/shopify/rfm"
                style={{ border: "none", width: "100%" }}
                title="rfm"
              />
            </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InjectAppServices(Shopify);
