import { useIntl } from 'react-intl';

export const LandingPacksMessages = ({
  showArchiveLandings,
  loadingRemoveLandingPages,
  errorRemoveLandingPages,
  successRemoveLandingPages,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      {showArchiveLandings && !loadingRemoveLandingPages && (
        <div className="dp-wrap-message dp-wrap-warning m-t-12 bounceIn">
          <span className="dp-message-icon" />
          <div className="dp-content-message">
            <p>{_('landing_selection.user_messages.warning_description')}</p>
            <a
              href={`${process.env.REACT_APP_DOPPLER_MY_LANDINGS_URL}`}
              className="dp-message-link"
            >
              {_('landing_selection.user_messages.warning_link_title')}
            </a>
          </div>
        </div>
      )}
      {!errorRemoveLandingPages && successRemoveLandingPages && (
        <div className="dp-wrap-message dp-wrap-success m-t-12 bounceIn">
          <span className="dp-message-icon"></span>
          <div className="dp-content-message">
            <p>{_('big_query.plus_message_saved')}</p>
          </div>
        </div>
      )}
      {!showArchiveLandings && !loadingRemoveLandingPages && errorRemoveLandingPages && (
        <div className="dp-wrap-message dp-wrap-cancel m-t-12 bounceIn">
          <span className="dp-message-icon"></span>
          <div className="dp-content-message">
            <p>{_('validation_messages.error_unexpected_register_MD')}</p>
          </div>
        </div>
      )}
    </>
  );
};
