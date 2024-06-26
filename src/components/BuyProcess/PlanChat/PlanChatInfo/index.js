import { useIntl } from 'react-intl';

export const PlanChatInfo = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <p>{_('chat_selection.plan_chat_info.legend')}</p>
      <section className="dp-rowflex m-t-24">
        <div className="col-lg-6">
          <h6>
            <strong>{_('chat_selection.plan_chat_info.section_1.title')}</strong>
          </h6>
          <p>{_('chat_selection.plan_chat_info.section_1.legend')}</p>
        </div>
        <div className="col-lg-6">
          <h6>
            <strong>{_('chat_selection.plan_chat_info.section_2.title')}</strong>
          </h6>
          <p>{_('chat_selection.plan_chat_info.section_2.legend')}</p>
        </div>
      </section>
    </>
  );
};
