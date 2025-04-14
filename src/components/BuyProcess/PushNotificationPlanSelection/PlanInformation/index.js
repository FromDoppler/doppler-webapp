import { FormattedMessage, useIntl } from 'react-intl';

export const PlanInformation = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <p>
        <FormattedMessage
          id={'push_notification_selection.push_notification_plan_info.legend'}
          values={{
            bold: (chunks) => <b>{chunks}</b>,
          }}
        />
      </p>
      <section className="dp-rowflex m-t-24">
        <div className="col-lg-6">
          <h6>
            <strong>
              {_('push_notification_selection.push_notification_plan_info.section_1.title')}
            </strong>
          </h6>
          <p>
            <FormattedMessage
              id={'push_notification_selection.push_notification_plan_info.section_1.legend'}
              values={{
                bold: (chunks) => <b>{chunks}</b>,
              }}
            />
          </p>
        </div>
        <div className="col-lg-6">
          <h6>
            <strong>
              {_('push_notification_selection.push_notification_plan_info.section_2.title')}
            </strong>
          </h6>
          <p>{_('push_notification_selection.push_notification_plan_info.section_2.legend')}</p>
        </div>
      </section>
    </>
  );
};
