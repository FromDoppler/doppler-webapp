import React from 'react';
import { BigQueryLogo } from './styles/styles';
import { useIntl } from 'react-intl';
import datastudiogif from '../../../../img/google-data-studio.gif';

interface IFreeAccountProps {}

const FreeAccount: React.FunctionComponent<IFreeAccountProps> = (props) => {
  const intl = useIntl();
  const _ = (id: string, values: any) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <section className="dp-gray-page p-t-54 p-b-54">
        <div className="dp-container">
          <div className="dp-rowflex">
            <div className="col-lg-6">
              <div>
                <BigQueryLogo></BigQueryLogo>
                <h1>{_('big_query.free_title', '')}</h1>
              </div>
              <p>{_('big_query.free_text_summary', '')}</p>
              <div>
                <ul className="dp-feature-list">
                  <li>
                    <span className="dp-icodot">.</span>
                    <span>{_('big_query.free_ul_item_one', '')}</span>
                  </li>
                  <li>
                    <span className="dp-icodot">.</span>
                    <span>{_('big_query.free_ul_item_two', '')}</span>
                  </li>
                </ul>
              </div>
              <p>
                <strong>{_('big_query.free_text_strong', '')}</strong>
              </p>
              <hr />
              <div>
                <a
                  href={_('big_query.upgrade_plan_url', '')}
                  className="dp-button button-medium primary-green"
                >
                  {_('big_query.free_btn_redirect', '')}
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <img src={datastudiogif} width="800" height="500" />
              <p className="text-italic">
                {_('big_query.free_text_data_studio_one', '')}{' '}
                <a href="www.datastudio.com">{_('big_query.free_text_data_studio_two', '')}</a>
                {_('big_query.free_text_data_studio_three', '')}{' '}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FreeAccount;
