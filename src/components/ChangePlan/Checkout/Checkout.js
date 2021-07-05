import React, { useState } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { ContactInformation } from './ContactInformation/ContactInformation';
import { Step } from './Step/Step';

const checkoutSteps = {
  contactInformation: 'contact-information',
  billingInformation: 'billing-information',
  paymentInformation: 'payment-information',
};

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(checkoutSteps.contactInformation);
  const [complete, setComplete] = useState(false);
  const intl = useIntl();

  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const setNextCheckoutStep = async () => {
    let nextStep = activeStep;

    switch (activeStep) {
      case checkoutSteps.contactInformation:
        nextStep = checkoutSteps.contactInformation;
        break;
      case checkoutSteps.billingInformation:
        nextStep = checkoutSteps.paymentInformation;
        break;
      case checkoutSteps.paymentInformation:
        nextStep = checkoutSteps.paymentInformation;
        break;
      default:
        nextStep = checkoutSteps.contactInformation;
        break;
    }

    setActiveStep(nextStep);
  };

  return (
    <>
      <Helmet>
        <title>{_('checkoutProcessForm.title')}</title>
        <meta name="invoices" />
      </Helmet>
      <HeaderSection>
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12">
              <h2>{_('checkoutProcessForm.title')}</h2>
            </div>
          </div>
        </section>
      </HeaderSection>
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-lg-8 col-md-12 m-b-24">
            <Step
              active={activeStep === checkoutSteps.contactInformation}
              title={_('checkoutProcessForm.contact_information_title')}
              complete={complete}
            >
              <ContactInformation
                handleSaveAndContinue={setNextCheckoutStep}
                onComplete={(value) => {
                  setComplete(value);
                }}
              />
            </Step>
            <Step
              active={activeStep === checkoutSteps.billingInformation}
              title={_('checkoutProcessForm.billing_information_title')}
              complete={false}
            ></Step>
            <Step
              active={activeStep === checkoutSteps.paymentInformation}
              title={_('checkoutProcessForm.payment_method_title')}
              complete={false}
            ></Step>
          </div>
        </div>
      </section>
    </>
  );
};

export default InjectAppServices(Checkout);
