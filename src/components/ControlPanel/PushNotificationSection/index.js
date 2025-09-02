import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { Breadcrumb, BreadcrumbItem } from '../../shared/Breadcrumb/Breadcrumb';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { FormattedMessageMarkdown } from '../../../i18n/FormattedMessageMarkdown';
import { Navigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { PushSwitch } from './helper/PushSwitch'
import { PlanAlert }  from './PlanAlert/planAlert'

export const PushNotificationSection = InjectAppServices(
  ({ dependencies: { appSessionRef, dopplerLegacyClient } }) => {
    const [pushNotificationData, setPushNotificationData] = useState({});
    const [isPushServiceEnabled, setIsPushServiceEnabled] = useState(false);
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [loading, setLoading] = useState(true);

    const redirectToDashboard =
      appSessionRef.current.userData.userAccount?.userProfileType &&
      appSessionRef.current.userData.userAccount.userProfileType !== 'USER';
    const { isFreeAccount } = appSessionRef.current.userData.user.plan;
    const { 
      buttonUrl: updatePlanUrl,
      quantity: planQuantity,
      description: planDescription,
    } = appSessionRef.current.userData.user.pushNotification.plan;

     useEffect(() => {
      const fetchData = async () => {
        const res = await dopplerLegacyClient.getPushNotificationSettings()
        setPushNotificationData(res);
        setIsPushServiceEnabled(res.isPushServiceEnabled); 
        setLoading(false);
      };
      fetchData();
    }, [dopplerLegacyClient]);
  
  const pushServiceSwitchHandler = (checked) => {
    setIsPushServiceEnabled(checked);
  };

  const barPercent = planQuantity === 0 ? 0 : pushNotificationData.consumedSends * 100 / planQuantity;
  const availableSends = pushNotificationData.trialPeriodRemainingDays === 0 || planQuantity === 0 ? 0: planQuantity - pushNotificationData.consumedSends;

    if (loading) {
      return <Loading page />;
    }

    if (redirectToDashboard) {
      return <Navigate to="/dashboard" />;
    }

    return (
      <>
        <Helmet>
          <title>{_('push_notification_section.title')}</title>
        </Helmet>
        <HeaderSection>
          <div className="col-sm-12 col-md-12 col-lg-12">
            <Breadcrumb>
              <BreadcrumbItem
                href={_('common.control_panel_url')}
                text={_('common.control_panel')}
              />
              <BreadcrumbItem text={_('push_notification_section.title')} />
            </Breadcrumb>
          </div>
        </HeaderSection>

        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <div className="dp-boxgrey">
                <h1>{_('push_notification_section.panel.title')}</h1>
                <div className="dp-rowflex">
                  <div className="col-sm-8 col-md-10 col-lg-10">
                    <FormattedMessageMarkdown id='push_notification_section.panel.description'/>
                    <FormattedMessageMarkdown id='push_notification_section.panel.description2'/>
                </div>
                <div className="col-sm-4 col-md-2 col-lg-2">
                  <a
                    href={_('push_notification_section.panel.button_configure_domain_link')}
                    className="dp-button button-medium primary-green">
                    {_('push_notification_section.panel.button_configure_domain_label')}
                  </a>
                </div>
              </div>

              <div className="dp-banner">
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <h2 className="m-b-12">{_('push_notification_section.panel.consume_state_title')}</h2>
                    <PlanAlert
                      linkUrl = {updatePlanUrl}
                      days = {pushNotificationData.trialPeriodRemainingDays}
                      availableSends = {availableSends}
                      isUserFree = {isFreeAccount}/>

                    <div className="dp-widget-plan-progress">
                      <p>{planDescription || 'Plan'}:&nbsp;<strong> {_('push_notification_section.panel.sends_month', {quantity: planQuantity})}</strong></p>
                      <div className="dp-progress-bar m-t-12 m-b-12">
                        <div id="progress" className={`progress ${availableSends < 0 ? "exceeded" : ""}`} style={{width: `${barPercent}%`}}></div>
                      </div>
                      <div className="plan-info">
                        <span>
                          <FormattedMessageMarkdown id='push_notification_section.panel.consumed_sends' values= {{quantity: pushNotificationData.consumedSends}}/>
                        </span>
                        {availableSends >= 0 &&
                          <span> {_('push_notification_section.panel.available_sends')}
                            <strong className="text-green"> {_('push_notification_section.panel.sends', {quantity: availableSends})}</strong>
                          </span>
                        }
                        {availableSends < 0 &&
                          <span> {_('push_notification_section.panel.exceeded_sends')}
                            <strong className="text-orange"> {_('push_notification_section.panel.sends', {quantity: (-1 * availableSends)})}</strong>
                          </span>
                        }
                      </div> 
                    </div>
                    
                    <div className="m-t-36">
                      <h2>{_('push_notification_section.panel.sends_option')}</h2>
                      <Formik initialValues={{ isPushServiceEnabled }}>
                        <Form>
                          <PushSwitch
                            name="isPushServiceEnabled"
                            title={_('push_notification_section.panel.sends_option_pause')}
                            text = {_('push_notification_section.panel.sends_option_pause_description')}
                            checked={isPushServiceEnabled}
                            onToggle={pushServiceSwitchHandler}
                          />
                        </Form>
                       </Formik>
                    </div> 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);
