export function validateEmail(value) {
  if (!value) {
    return null;
  } else if (!/^([a-z\d[\]])([\w\-.+\][]*)@([ñ\w.\-\][]+)\.[\w\-\][.]{2,}(\?)?.*$/i.test(value)) {
    return 'validation_messages.error_invalid_email_address';
  }
  return null;
}

export function validateRequiredField(value) {
  return !value && value !== false && 'validation_messages.error_required_field';
}

export function validatePassword(value) {
  const digitRegex = /[0-9]/;

  if (!value) {
    return { empty: true };
  }

  const charError = value.length < 8;
  const digitError = !digitRegex.test(value);

  if (charError && digitError) {
    return { charLength: true, digit: true };
  }
  if (charError) {
    return { charLength: true };
  }
  if (digitError) {
    return { digit: true };
  }
}

export function validateCheckRequired(value) {
  if (!value) {
    return true;
  }

  return null;
}
