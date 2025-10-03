import { useField } from 'formik';
import { FormattedMessageMarkdown } from '../../../../i18n/FormattedMessageMarkdown';

export const PushSwitch = ({ name, title, textId, disabled, onToggle }) => {
  const [field, , helpers] = useField({ name, type: 'checkbox' });

  return (
    <>
      <h3 style={{ fontWeight: '400' }}>{title}</h3>
      <div className="dp-text-switch col-lg-9 col-md-9">
        <div className="dp-switch">
          <input
            disabled={disabled}
            type="checkbox"
            id={name}
            {...field}
            checked={field.value}
            onChange={(e) => {
              const checked = e.target.checked;
              helpers.setValue(checked);
              onToggle?.(checked);
            }}
          />
          <label aria-disabled={disabled} htmlFor={name}>
            <span></span>
          </label>
        </div>
        <FormattedMessageMarkdown id={textId} />
      </div>
    </>
  );
};
