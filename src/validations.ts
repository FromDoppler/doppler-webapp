export function validateEmail(value: string): string | null {
  if (!value) {
    return null;
  }

  if (!/^([a-z\d[\]])([\w\-.+\][]*)@([ñ\w.\-\][]+)\.[\w\-\][.]{2,}(\?)?.*$/i.test(value)) {
    return 'validation_messages.error_invalid_email_address';
  }

  return null;
}

export function validateRequiredField(value: any): string | null {
  if (!value && value !== false) {
    return 'validation_messages.error_required_field';
  }

  return null;
}

export function validatePassword(
  value: string,
): { empty: true } | { charLength?: boolean; digit?: boolean } | null {
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

  return null;
}

export function validateCheckRequired(value: any): true | null {
  if (!value) {
    return true;
  }

  return null;
}
