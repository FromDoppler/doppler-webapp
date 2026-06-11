import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import useTimeout from '../../../../../hooks/useTimeout';
import { getTransferBankingDetails } from './bankingDetails';
import { thousandSeparatorNumber } from '../../../../../utils';

const SUPPORTED_TRANSFER_COUNTRY = 'ar';
const BILLING_SUPPORT_EMAIL = 'billing@fromdoppler.com';

const steps = [
  {
    iconClassName: 'iconapp-mobile-payment1',
    content: 'checkoutProcessSuccess.transfer_bank_transfer_message',
    needUpgradePending: false,
  },
  {
    iconClassName: 'iconapp-receipt',
    content: 'checkoutProcessSuccess.transfer_send_the_receipt_message',
    needUpgradePending: false,
  },
  {
    iconClassName: 'iconapp-check-search',
    content: 'checkoutProcessSuccess.transfer_confirmation_message',
    needUpgradePending: true,
  },
];

const getStepsForCustomTransferInformation = (upgradePending) => {
  if (upgradePending) {
    return steps;
  } else {
    return steps.filter(({ needUpgradePending }) => !needUpgradePending);
  }
};

const TransferReceiptMailLink = (chunks) => (
  <a href={`mailto:${BILLING_SUPPORT_EMAIL}`}>{chunks}</a>
);

const TransferReceiptMailText = (chunks) => <>{chunks}</>;

const COPY_FEEDBACK_DURATION = 1500;

const copyTextToClipboard = async (text) => {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'absolute';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};

const LegacyTransferInformation = ({ upgradePending }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <h4 className="m-t-24">{_(`checkoutProcessSuccess.transfer_steps_title`)}</h4>
      <div className="dp-rowflex">
        <div className="col-sm-10 m-b-24">
          <div className="dp-checkout-content">
            <div className="dp-plan-detail">
              <ul className="dp-list-detail">
                <li>
                  <span className="dp-wrapp-icon dpicon iconapp-mail-inbox" />
                  <span>
                    {_(`checkoutProcessSuccess.transfer_check_email_with_invoice_message`)}
                  </span>
                </li>
                <li>
                  <span className="dp-wrapp-icon dpicon iconapp-dollar-coin" />
                  <span>{_(`checkoutProcessSuccess.transfer_pay_the_invoice_message`)}</span>
                </li>
                <li>
                  <span className="dp-wrapp-icon dpicon iconapp-create-mail" />
                  <span>
                    <FormattedMessage
                      id={
                        upgradePending
                          ? `checkoutProcessSuccess.transfer_send_the_receipt_message`
                          : `checkoutProcessSuccess.transfer_send_the_receipt_with_not_upgrade_pending_message`
                      }
                      values={{
                        Bold: (chunk) => <strong>{chunk}</strong>,
                        Link: TransferReceiptMailText,
                      }}
                    />
                  </span>
                </li>
                {upgradePending && (
                  <li>
                    <span className="dp-wrapp-icon dpicon iconapp-approve-money" />
                    <span>{_(`checkoutProcessSuccess.transfer_confirmation_message`)}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div></div>
      <hr className="dp-separator"></hr>
    </>
  );
};

const TransferBankingDetailsBlock = ({ billingCountry }) => {
  const intl = useIntl();
  const createTimeout = useTimeout();
  const [copiedField, setCopiedField] = useState('');
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const bankingDetails = getTransferBankingDetails(billingCountry);
  const bankingRows = [
    ['transfer_bank_name_label', bankingDetails.bank, false],
    ['transfer_bank_holder_label', bankingDetails.holder, false],
    ['transfer_bank_tax_id_label', bankingDetails.cuit, false],
    ['transfer_bank_account_label', bankingDetails.account, false],
    ['transfer_bank_cbu_label', bankingDetails.cbu, true],
    ['transfer_bank_alias_label', bankingDetails.alias, true],
  ];

  const handleCopy = async (labelId, value) => {
    try {
      await copyTextToClipboard(value);
      setCopiedField(labelId);
      createTimeout(() => setCopiedField(''), COPY_FEEDBACK_DURATION);
    } catch {
      setCopiedField('');
    }
  };

  return (
    <div className="m-t-12" data-testid="dp-transfer-banking-details">
      <div>
        {bankingRows.map(([labelId, value, isCopyable]) => (
          <p key={labelId}>
            <strong>{_(`checkoutProcessSuccess.${labelId}`)}:</strong> {value}
            {isCopyable ? (
              <>
                <button
                  type="button"
                  className="dp-button link-green p-l-18"
                  onClick={() => handleCopy(labelId, value)}
                  aria-label={_('checkoutProcessSuccess.transfer_bank_copy_button', {
                    label: _(`checkoutProcessSuccess.${labelId}`),
                  })}
                  title={_('checkoutProcessSuccess.transfer_bank_copy_button', {
                    label: _(`checkoutProcessSuccess.${labelId}`),
                  })}
                >
                  <span className="dpicon icon-action iconapp-copy-file" aria-hidden="true" />
                </button>
                {copiedField === labelId ? (
                  <span className="m-l-12" aria-live="polite">
                    {_('checkoutProcessSuccess.transfer_bank_copied_message')}
                  </span>
                ) : null}
              </>
            ) : null}
          </p>
        ))}
      </div>
    </div>
  );
};

const CustomTransferInformation = ({ upgradePending, billingCountry, lang, total }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const normalizedTotal = Number(total) || 0;

  return (
    <>
      <h4 className="m-t-24">{_(`checkoutProcessSuccess.transfer_steps_title`)}</h4>
      <div className="dp-rowflex">
        <div className="col-sm-10 m-b-24">
          <div className="dp-checkout-content">
            <div className="dp-plan-detail" data-testid="dp-new-transfer-details">
              <ul className="dp-list-detail">
                {getStepsForCustomTransferInformation(upgradePending).map(
                  ({ iconClassName, content }) => (
                    <li key={content}>
                      <h3 className={`dp-wrapp-icon dpicon ${iconClassName}`} aria-hidden="true" />
                      <div>
                        {content === 'checkoutProcessSuccess.transfer_bank_transfer_message' ? (
                          <>
                            <p>
                              <FormattedMessage
                                id={content}
                                values={{
                                  Bold: (chunk) => <strong>{chunk}</strong>,
                                  total: thousandSeparatorNumber(
                                    new Intl.Locale(`${lang === 'es' ? 'es-ES' : 'en-US'}`),
                                    normalizedTotal,
                                  ),
                                }}
                              />
                            </p>
                            <TransferBankingDetailsBlock billingCountry={billingCountry} />
                          </>
                        ) : (
                          <FormattedMessage
                            id={content}
                            values={{
                              Link: TransferReceiptMailLink,
                            }}
                          />
                        )}
                      </div>
                    </li>
                  ),
                )}
              </ul>
              <p className="m-t-18">{_(`checkoutProcessSuccess.transfer_explore_message`)}</p>
            </div>
          </div>
        </div>
      </div>
      <hr className="dp-separator" />
      <div className="m-t-24">
        <Link to="/dashboard" className="dp-button button-medium primary-green">
          {_('checkoutProcessSuccess.transfer_explore_button')}
        </Link>
      </div>
    </>
  );
};

export const TransferInformation = ({ billingCountry, upgradePending, lang, total }) => {
  const shouldShowCustomTransferInformation = billingCountry === SUPPORTED_TRANSFER_COUNTRY;

  if (!shouldShowCustomTransferInformation) {
    return <LegacyTransferInformation upgradePending={upgradePending} />;
  }

  return (
    <CustomTransferInformation
      upgradePending={upgradePending}
      billingCountry={billingCountry}
      lang={lang}
      total={total}
    />
  );
};
