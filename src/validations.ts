const emailRegex = /^([a-zñ\d[\]])(\.?([\wñ&/~\-+\][]+))*@([ñ\w.\-\][]+)\.[\w\-\][.]{2,}(\?)?.*$/i;

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

export function validateRequiredField(
  value: any,
  commonErrorKey: true | string = 'validation_messages.error_required_field',
): true | string | null {
  if (value === undefined || value === null || value === '') {
    return commonErrorKey;
  }

  return null;
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
  ...validateFunctions: [(value: any) => true | string | null]
): (value: any) => true | string | null {
  return (value) => {
    for (let validate of validateFunctions) {
      const result = validate(value);
      if (result) {
        return result;
      }
    }
    return null;
  };
}
