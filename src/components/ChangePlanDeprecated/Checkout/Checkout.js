import React, { useState } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { ContactInformation } from './ContactInformation/ContactInformation';
import { BillingInformation } from './BillingInformation/BillingInformation';
import { PaymentMethod } from './PaymentMethod/PaymentMethod';
import { Step } from './Step/Step';
import { PurchaseSummary } from './PurchaseSummary/PurchaseSummary';

const checkoutSteps = {
  contactInformation: 'contact-information',
  billingInformation: 'billing-information',
  paymentInformation: 'payment-information',
};

export const actionPage = {
  READONLY: 'readOnly',
  UPDATE: 'update',
};

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(checkoutSteps.contactInformation);
  const [completeContactInformationStep, setCompleteContactInformationStep] = useState(true);
  const [completeBillingInformationStep, setCompleteBillingInformationStep] = useState(false);
  const [paymentInformationAction, setPaymentInformationAction] = useState(actionPage.READONLY);
  const [selectedDiscountId, setSelectedDiscountId] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const intl = useIntl();

  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const setNextCheckoutStep = async () => {
    let nextStep = activeStep;

    switch (activeStep) {
      case checkoutSteps.contactInformation:
        nextStep = checkoutSteps.billingInformation;
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
          <div className="col-sm-12">
            <h3 className="m-b-24">{_('checkoutProcessForm.title')}</h3>
          </div>
          <div className="col-md-12 col-lg-7 m-b-24">
            <div className="dp-wrapper-payment-process">
              <ul className="dp-accordion">
                <Step
                  active={activeStep === checkoutSteps.contactInformation}
                  title={_('checkoutProcessForm.contact_information_title')}
                  complete={completeContactInformationStep}
                  stepNumber={1}
                  onActivate={() => setActiveStep(checkoutSteps.contactInformation)}
                >
                  <ContactInformation
                    handleSaveAndContinue={() => {
                      setNextCheckoutStep(activeStep);
                      setCompleteContactInformationStep(true);
                    }}
                  />
                </Step>
                <Step
                  active={activeStep === checkoutSteps.billingInformation}
                  title={_('checkoutProcessForm.billing_information_title')}
                  complete={completeBillingInformationStep}
                  stepNumber={2}
                  onActivate={() => setActiveStep(checkoutSteps.billingInformation)}
                >
                  <BillingInformation
                    handleSaveAndContinue={() => {
                      setNextCheckoutStep(activeStep);
                      setCompleteBillingInformationStep(true);
                    }}
                  />
                </Step>
                <Step
                  active={activeStep === checkoutSteps.paymentInformation}
                  title={_('checkoutProcessForm.payment_method.title')}
                  complete={
                    paymentInformationAction === actionPage.READONLY &&
                    completeContactInformationStep &&
                    completeBillingInformationStep
                  }
                  stepNumber={3}
                  onActivate={() => {
                    setPaymentInformationAction(actionPage.UPDATE);
                    setActiveStep(checkoutSteps.paymentInformation);
                  }}
                  lastStep={true}
                >
                  <PaymentMethod
                    optionView={paymentInformationAction}
                    handleChangeView={(view) => {
                      setPaymentInformationAction(view);
                    }}
                    handleSaveAndContinue={() => {
                      setNextCheckoutStep(activeStep);
                      setPaymentInformationAction(actionPage.READONLY);
                    }}
                    handleChangeDiscount={(discount) => {
                      setSelectedDiscountId(discount?.id);
                    }}
                    handleChangePaymentMethod={(paymentMethod) => {
                      setSelectedPaymentMethod(paymentMethod);
                    }}
                  />
                </Step>
              </ul>
            </div>
          </div>
          <div className="dp-space-l24"></div>
          <div className="col-lg-4 col-sm-12">
            <PurchaseSummary
              canBuy={
                paymentInformationAction === actionPage.READONLY &&
                completeContactInformationStep &&
                completeBillingInformationStep
              }
              discountId={selectedDiscountId}
              paymentMethod={selectedPaymentMethod}
            ></PurchaseSummary>
          </div>
        </div>
      </section>
    </>
  );
};

export default InjectAppServices(Checkout);
