import { useIntl } from 'react-intl';

export const Modal = ({ title, subtitle, items, onClose }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <div className="modal" id="modal-new-collaborator">
        <div className="modal-content--medium">
          <span className="close" onClick={() => onClose(false)}></span>
          <h2 className="modal-title">{title}</h2>
          <p>{subtitle}</p>
          <form action="#" className="awa-form">
            <legend>{title}</legend>
            <fieldset>
              <ul className="field-group">
                {items.map((item, index) => (
                  <li className="field-item" key={`item-key-${index}`}>
                    {item.subItems !== null ? (
                      <ul className="field-group">
                        {item.subItems.map((subItem, subIndex) => (
                          <li className="field-item field-item--50" key={`subItem-key-${subIndex}`}>
                            <label
                              for={subItem.name}
                              className="labelcontrol"
                              aria-disabled="false"
                              data-required="true"
                            >
                              {subItem.name}
                              <input
                                type={subItem.type}
                                name={subItem.name}
                                placeholder={subItem.placeholder}
                                aria-required="true"
                                aria-invalid="false"
                                aria-placeholder={subItem.placeholder}
                              />
                            </label>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <label
                        for={item.name}
                        className="labelcontrol"
                        aria-disabled="false"
                        data-required="true"
                      >
                        {item.name}
                        <input
                          type={item.type}
                          name={item.name}
                          placeholder={item.placeholder}
                          aria-required="true"
                          aria-invalid="false"
                          aria-placeholder={item.placeholder}
                        />
                      </label>
                    )}
                  </li>
                ))}
              </ul>
              <ul className="dp-group-buttons">
                <li>
                  <button type="button" className="dp-button button-medium primary-green">
                    {_('common.next')}
                  </button>
                </li>
              </ul>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
};
