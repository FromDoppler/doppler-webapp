import { useIntl } from 'react-intl';

export const ConfirmationContent = ({ contentActivation }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  if (contentActivation) {
    return (
      <div data-testid="dinamic-content" dangerouslySetInnerHTML={{ __html: contentActivation }} />
    );
  }

  return (
    <article className="confirmation-article">
      <h1>{_('signup.thanks_for_registering')}</h1>
      <p>{_('signup.check_inbox')}</p>
      <span className="icon-registration m-bottom--lv6">
        {_('signup.check_inbox_icon_description')}
      </span>
      <p className="text-italic">{_('signup.activate_account_instructions')}</p>
    </article>
  );
};
