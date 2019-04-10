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
