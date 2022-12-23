import { useEffect } from 'react';
import useTimeout from '../../../hooks/useTimeout';
import { useFormikContext as hookUseFormikContext } from 'formik';

export const ScrollToFieldError = ({
  scrollBehavior = { left: 0, behavior: 'smooth' },
  useFormikContext = hookUseFormikContext,
  fieldsOrder = [],
}) => {
  const { submitCount, isValid, errors } = useFormikContext();
  const createTimeout = useTimeout();

  useEffect(() => {
    if (isValid) {
      return;
    }

    const fieldErrorNames = Object.keys(errors);

    const firstFieldErrorName = fieldsOrder.find((fieldName) =>
      fieldErrorNames.includes(fieldName),
    );
    if (!firstFieldErrorName) {
      return;
    }

    const element = document.querySelector(`input[name='${firstFieldErrorName}']`);
    if (!element) {
      return;
    }

    // unfocus the active element (in mobile, close keyboard)
    if (document.activeElement) {
      document.activeElement.blur();
    }

    // Scroll to first known error into view
    createTimeout(() => {
      window.scroll({
        top: element.getBoundingClientRect().top + window.scrollY - 30,
        ...scrollBehavior,
      });
    }, 150);
    createTimeout(() => {
      element.focus();
    }, 700);
  }, [submitCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};
