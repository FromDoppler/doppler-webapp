import React, { useState, useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import MultiInputContainer from './MultiInputContainer';
import { FormattedMessageMarkdown } from '../../../../i18n/FormattedMessageMarkdown';
import { VerticalLine } from './style/styles.js';
import datastudiogif from '../../../../img/google-data-studio.gif';

interface IControlPanelProps {
  values?: string[];
  onChange: (newValues: string[]) => void;
}

const ControlPanel: React.FunctionComponent<IControlPanelProps> = (props) => {
  const intl = useIntl();
  const i18 = useCallback(
    (id: string, values?: any) => {
      return intl.formatMessage({ id: id }, values);
    },
    [intl],
  );

  const [values, setValues] = useState<string[]>([]);
  const [message, setMessage] = useState(false);
  const [saved, setSaved] = useState(false);

  const onClickHandler = useCallback(
    (isSaved: boolean) => {
      setMessage(isSaved);
      setSaved(isSaved);
    },
    [setMessage, setSaved],
  );

  const onClickBtnHandler = useCallback(() => {
    setMessage(true);
    setSaved(false);
  }, [setMessage, setSaved, values]);

  const MessageMemo = useMemo(() => {
    let messageText;
    if (saved) {
      messageText = <p>{i18('big_query.plus_message_saved')}</p>;
    } else {
      messageText = <p>{i18('big_query.plus_message_remember')}</p>;
    }

    if (message === true) {
      return (
        <div className="p-t-96" data-testid="message-info">
          <div className={`dp-wrap-message dp-wrap-${saved ? 'success' : 'info'}`}>
            <span className="dp-message-icon"></span>
            <div className="dp-content-message">{messageText}</div>
          </div>
        </div>
      );
    }
  }, [saved, message, i18]);

  return (
    <>
      <header className="hero-banner">
        <div className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <nav className="dp-breadcrumb">
                <ul>
                  <li>
                    <a href={i18('big_query.url_legacy_doppler')}>
                      {i18('big_query.plus_beginning')}
                    </a>
                  </li>
                  <li>
                    <a href={i18('big_query.url_legacy_control_panel')}>
                      {i18('big_query.plus_configuration')}
                    </a>
                  </li>
                  <li>
                    <a href={i18('big_query.url_legacy_control_panel')}>
                      {i18('big_query.plus_control_panel')}
                    </a>
                  </li>
                  <li>{i18('big_query.plus_big_query')}</li>
                </ul>
              </nav>
              <h2>{i18('big_query.plus_title')}</h2>
            </div>
            <div className="col-sm-7">
              <FormattedMessageMarkdown id="big_query.plus_header_MD" />
            </div>
          </div>
          <span className="arrow"></span>
        </div>
      </header>
      <div className="dp-container">
        <div className="dp-rowflex">
          <div className="col-lg-5">
            <div>
              <span>{i18('big_query.plus_step_one')}</span>
              <strong>
                <FormattedMessageMarkdown id="big_query.plus_body_step_one_HD" />
              </strong>
              <p className="p-t-36">{i18('big_query.plus_step_one_paragraph')}</p>
            </div>

            <div className="dp-rowflex p-t-48">
              <ul className="field-group">
                <MultiInputContainer
                  values={values}
                  onChange={setValues}
                  onAdd={onClickBtnHandler}
                  onRemove={onClickBtnHandler}
                />
              </ul>
            </div>

            {MessageMemo}
          </div>
          <div className="col-lg-1">
            <VerticalLine />
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-5">
            <div>
              <span>{i18('big_query.plus_step_two')}</span>
              <strong>
                <FormattedMessageMarkdown id="big_query.plus_body_step_two_HD" />
              </strong>
              <p className="p-t-36">{i18('big_query.plus_step_two_paragraph')}</p>
            </div>
            <div className="p-t-54">
              <img
                src={datastudiogif}
                alt={i18('big_query.free_alt_image')}
                width="500"
                height="300"
              />
            </div>
          </div>
        </div>
        <div className="p-t-36">
          <hr />
        </div>
        <div className="dp-rowflex p-t-24">
          <div>
            <button
              data-testid="btn-cancel"
              type="button"
              className="dp-button button-medium primary-grey"
              onClick={() => onClickHandler(false)}
            >
              {i18('big_query.plus_btn_cancel')}
            </button>
          </div>
          <div className="p-l-24">
            <button
              data-testid="btn-save"
              type="button"
              className="dp-button button-medium primary-green p-l-96"
              onClick={() => onClickHandler(true)}
            >
              {i18('big_query.plus_btn_save')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ControlPanel;
