import { FormattedMessage, useIntl } from 'react-intl';

export const AdditionalServicesLegal = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div className="dp-container">
      <div className="dp-rowflex">
        <div className="col-lg-8 col-md-12 m-b-24">
          <div className="dp-additional-services-content-legal">
            <p>{_('my_plan.addtional_services.legal.title')}</p>
            <p>
              <FormattedMessage
                id={'my_plan.addtional_services.legal.purpose_legend'}
                values={{
                  Strong: (chunks) => <strong>{chunks}</strong>,
                }}
              />
            </p>
            <p>
              <FormattedMessage
                id={'my_plan.addtional_services.legal.legitimation_legend'}
                values={{
                  Strong: (chunks) => <strong>{chunks}</strong>,
                }}
              />
            </p>
            <p>
              <FormattedMessage
                id={'my_plan.addtional_services.legal.recipients_legend'}
                values={{
                  Strong: (chunks) => <strong>{chunks}</strong>,
                }}
              />
            </p>
            <p>
              <FormattedMessage
                values={{
                  Link: (chunk) => (
                    <a
                      href={_('my_plan.addtional_services.forms.privacy_policy_consent_url')}
                      target="_blank"
                    >
                      {chunk}
                    </a>
                  ),
                  Strong: (chunks) => <strong>{chunks}</strong>,
                }}
                id="my_plan.addtional_services.legal.additional_information"
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
