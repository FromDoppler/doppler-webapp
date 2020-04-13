// eslint-disable-next-line
const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
const nameRegex = /^[\u00C0-\u1FFF\u2C00-\uD7FF\w][\u00C0-\u1FFF\u2C00-\uD7FF\w'`\-. ]+$/i;

export function validateEmail(
  value: string,
  commonErrorKey: true | string = 'validation_messages.error_invalid_email_address',
): true | string | null {
  if (!value) {
    return null;
  }

  if (!emailRegex.test(value)) {
    return commonErrorKey;
  }

  return null;
}

export function validateName(
  value: string,
  commonErrorKey: true | string = 'validation_messages.error_invalid_name',
): true | string | null {
  if (!value || nameRegex.test(value)) {
    return null;
  } else {
    return commonErrorKey;
  }
}

export function validateRequiredField(
  value: any,
  commonErrorKey: true | string = 'validation_messages.error_required_field',
): true | string | null {
  if (value === undefined || value === null || value === '') {
    return commonErrorKey;
  }

  return null;
}

export function validateMinLength(
  value: any,
  minLength: true | number = 2,
  commonErrorKey: true | string = 'validation_messages.error_min_length',
): true | string | null {
  if (!value || value.length >= minLength) {
    return null;
  }

  return commonErrorKey;
}

export function validatePassword(
  value: string,
): { empty: true } | { charLength?: boolean; digit?: boolean; letter?: boolean } | null {
  const digitRegex = /[0-9]/;
  const letterRegex = /[a-zA-Z]/;

  if (!value) {
    return { empty: true };
  }

  const charError = value.length < 8;
  const digitError = !digitRegex.test(value);
  const letterError = !letterRegex.test(value);

  if (charError || digitError || letterError) {
    return { charLength: charError, digit: digitError, letter: letterError };
  }

  return null;
}

export function validateCheckRequired(
  value: any,
  commonErrorKey: true | string = true,
): true | string | null {
  if (!value) {
    return commonErrorKey;
  }

  return null;
}

export function combineValidations(
  ...validateFunctions: [((value: any) => true | string | null) | undefined | false | null]
): (value: any) => true | string | null {
  return (value) => {
    for (let validate of validateFunctions) {
      const result = validate && validate(value);
      if (result) {
        return result;
      }
    }
    return null;
  };
}
