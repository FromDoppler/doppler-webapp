import 'jest';
import {
  validateEmail,
  validateRequiredField,
  validateCheckRequired,
  validatePassword,
  validateName,
  validateMinLength,
  validateRfc,
  validateCuit,
  validateCbu,
} from './validations';

describe('validations', () => {
  describe('validateEmail', () => {
    it('should accept an empty email address', () => {
      // Arrange
      const emailAddress = '';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept a simple email address', () => {
      // Arrange
      const emailAddress = 'test@test.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept an email address with a subdomain', () => {
      // Arrange
      const emailAddress = 'test@sub.test.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept an email address with /', () => {
      // Arrange
      const emailAddress = 'te/st@test.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept an email address with &', () => {
      // Arrange
      const emailAddress = 'a&test&@test.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept an email address with ~', () => {
      // Arrange
      const emailAddress = 'a~test~@test.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toBeNull();
    });

    it('should not accept an email address with ñ', () => {
      // Arrange
      const emailAddress = 'testñ@testñ.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toEqual('validation_messages.error_has_accents');
    });

    it('should not accept an email address with dot (.) before @', () => {
      // Arrange
      const emailAddress = 'test.@test.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toEqual('validation_messages.error_invalid_email_address');
    });

    it('should accept an email address with multiple levels of subdomains', () => {
      // Arrange
      const emailAddress = 'test@test.test.com.ar';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toBeNull();
    });

    it('should not accept an email address starting with dot (.)', () => {
      // Arrange
      const emailAddress = '.test@test.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toEqual('validation_messages.error_invalid_email_address');
    });

    it('should not accept an email address with two dots (.) together', () => {
      // Arrange
      const emailAddress = 'te..st@test.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toEqual('validation_messages.error_invalid_email_address');
    });

    it('should accept an email only a character before @', () => {
      // Arrange
      const emailAddress = 'a@test.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept an email with dot separated sections before @', () => {
      // Arrange
      const emailAddress = 'test.test.test@test.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toBeNull();
    });

    it('should not accept an email address from a top-level domain', () => {
      // Arrange
      const emailAddress = 'test@test';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toEqual('validation_messages.error_invalid_email_address');
    });

    it('should not accept an email address without @', () => {
      // Arrange
      const emailAddress = 'test.test.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toEqual('validation_messages.error_invalid_email_address');
    });

    it('should not accept an email address with spaces', () => {
      // Arrange
      const emailAddress = 'te st@test.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toEqual('validation_messages.error_invalid_email_address');
    });

    it('should not accept an email address with accents', () => {
      // Arrange
      const emailAddress = 'testé@test.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toEqual('validation_messages.error_has_accents');
    });

    it('should not accept an email address with accent in the beginning', () => {
      // Arrange
      const emailAddress = 'átest@test.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toEqual('validation_messages.error_has_accents');
    });

    it('should not accept an email address with accent in the end', () => {
      // Arrange
      const emailAddress = 'test@test.comó';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toEqual('validation_messages.error_has_accents');
    });

    it('should return a custom error', () => {
      // Arrange
      const emailAddress = 'invalid email address';
      const customKey = 'custom-key';

      // Act
      const result = validateEmail(emailAddress, customKey);

      // Assert
      expect(result).toEqual(customKey);
    });

    it('should accept an email with spaces in the beginning', () => {
      // Arrange
      const emailAddress = '  test.test.test@test.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept an email with spaces in the end', () => {
      // Arrange
      const emailAddress = 'test.test.test@test.com    ';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept an email with spaces in the beginning and in the end', () => {
      // Arrange
      const emailAddress = '     test.test.test@test.com    ';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('validateRequiredField', () => {
    it('should accept a character', () => {
      // Arrange
      const value = 'a';

      // Act
      const result = validateRequiredField(value);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept a number', () => {
      // Arrange
      const value = 345;

      // Act
      const result = validateRequiredField(value);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept a zero', () => {
      // Arrange
      const value = 0;

      // Act
      const result = validateRequiredField(value);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept a boolean true', () => {
      // Arrange
      const value = true;

      // Act
      const result = validateRequiredField(value);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept a boolean false', () => {
      // Arrange
      const value = false;

      // Act
      const result = validateRequiredField(value);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept an empty array', () => {
      // Arrange
      const value = [];

      // Act
      const result = validateRequiredField(value);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept an empty object', () => {
      // Arrange
      const value = {};

      // Act
      const result = validateRequiredField(value);

      // Assert
      expect(result).toBeNull();
    });

    it('should not accept an empty string', () => {
      // Arrange
      const value = '';

      // Act
      const result = validateRequiredField(value);

      // Assert
      expect(result).toEqual('validation_messages.error_required_field');
    });

    it('should not accept a null value', () => {
      // Arrange
      const value = null;

      // Act
      const result = validateRequiredField(value);

      // Assert
      expect(result).toEqual('validation_messages.error_required_field');
    });

    it('should not accept undefined value', () => {
      // Arrange

      // Act
      const result = validateRequiredField();

      // Assert
      expect(result).toEqual('validation_messages.error_required_field');
    });

    it('should return a custom error', () => {
      // Arrange
      const value = '';
      const customKey = 'custom-key';

      // Act
      const result = validateRequiredField(value, customKey);

      // Assert
      expect(result).toEqual(customKey);
    });
  });

  describe('validateCheckRequired', () => {
    it('should accept true', () => {
      // Arrange
      const value = true;

      // Act
      const result = validateCheckRequired(value);

      // Assert
      expect(result).toBeNull();
    });

    it('should not accept an empty string', () => {
      // Arrange
      const value = '';

      // Act
      const result = validateCheckRequired(value);

      // Assert
      expect(result).toStrictEqual(true);
    });

    it('should not accept null', () => {
      // Arrange
      const value = null;

      // Act
      const result = validateCheckRequired(value);

      // Assert
      expect(result).toStrictEqual(true);
    });

    it('should not accept undefined', () => {
      // Act
      const result = validateCheckRequired();

      // Assert
      expect(result).toStrictEqual(true);
    });

    it('should not accept false', () => {
      // Arrange
      const value = false;

      // Act
      const result = validateCheckRequired(value);

      // Assert
      expect(result).toStrictEqual(true);
    });

    it('should return a custom error', () => {
      // Arrange
      const value = '';
      const customKey = 'custom-key';

      // Act
      const result = validateCheckRequired(value, customKey);

      // Assert
      expect(result).toEqual(customKey);
    });
  });
  describe('validatePassword', () => {
    it('should not accept empty passwords', () => {
      // Arrange
      const value = '';

      // Act
      const result = validatePassword(value);

      // Assert
      expect(result).toEqual({ empty: true });
    });

    it('should not accept numeric only passwords', () => {
      // Arrange
      const value = '123456789';

      // Act
      const result = validatePassword(value);

      // Assert
      expect(result).toEqual({ charLength: false, digit: false, letter: true });
    });

    it('should not accept letter only', () => {
      // Arrange
      const value = 'qazwsxedc';

      // Act
      const result = validatePassword(value);

      // Assert
      expect(result).toEqual({ charLength: false, digit: true, letter: false });
    });

    it('should not accept less than 8 chars', () => {
      // Arrange
      const value = 'qa3zw';

      // Act
      const result = validatePassword(value);

      // Assert
      expect(result).toEqual({ charLength: true, digit: false, letter: false });
    });

    it('should not accept numbers and char length less than 8', () => {
      // Arrange
      const value = '999';

      // Act
      const result = validatePassword(value);

      // Assert
      expect(result).toEqual({ charLength: true, digit: false, letter: true });
    });

    it('should not accept password with no digits and no letters and more than 8 characters', () => {
      // Arrange
      const value = '*********';

      // Act
      const result = validatePassword(value);

      // Assert
      expect(result).toEqual({ letter: true, digit: true, charLength: false });
    });

    it('should not accept password with no digits and no letters and with less length than 8', () => {
      // Arrange
      const value = '***';

      // Act
      const result = validatePassword(value);

      // Assert
      expect(result).toEqual({ charLength: true, letter: true, digit: true });
    });
  });

  describe('validateName', () => {
    it('should accept an empty name', () => {
      // Arrange
      const name = '';

      // Act
      const result = validateName(name);

      // Assert
      expect(result).toBeNull();
    });

    it('should not accept a name with one char', () => {
      // Arrange
      const name = 'a';

      // Act
      const result = validateName(name);

      // Assert
      expect(result).toEqual('validation_messages.error_invalid_name');
    });

    it('should accept a name with two chars', () => {
      // Arrange
      const name = 'Fe';

      // Act
      const result = validateName(name);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept a name with more than one char in chinese language', () => {
      // Arrange
      const name = '陸軍上校';

      // Act
      const result = validateName(name);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept a name with point', () => {
      // Arrange
      const name = 'A.';

      // Act
      const result = validateName(name);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept a name with spaces', () => {
      // Arrange
      const name = 'John Snow';

      // Act
      const result = validateName(name);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept names with single quotes', () => {
      // Arrange
      const name = "D'onofrio";

      // Act
      const result = validateName(name);

      // Assert
      expect(result).toBeNull();
    });

    it('should not accept names starting with apostrophe', () => {
      // Arrange
      const name = '`A';

      // Act
      const result = validateName(name);

      // Assert
      expect(result).toEqual('validation_messages.error_invalid_name');
    });

    it('should not accept names with emojis', () => {
      // Arrange
      const name = 'a😀';

      // Act
      const result = validateName(name);

      // Assert
      expect(result).toEqual('validation_messages.error_invalid_name');
    });

    it('should not accept names starting with single quotes', () => {
      // Arrange
      const name = "'A";

      // Act
      const result = validateName(name);

      // Assert
      expect(result).toEqual('validation_messages.error_invalid_name');
    });

    it('should not accept a name with point in the beginning', () => {
      // Arrange
      const name = '.A';

      // Act
      const result = validateName(name);

      // Assert
      expect(result).toEqual('validation_messages.error_invalid_name');
    });

    it('should return a custom error', () => {
      // Arrange
      const name = 'Jon+';
      const customError = 'validation_messages.error_invalid_name_custom';

      // Act
      const result = validateEmail(name, customError);

      // Assert
      expect(result).toEqual(customError);
    });

    it('should not accept a name with special character', () => {
      // Arrange
      const characters = [
        'a¿',
        'a$',
        'a*',
        'a#',
        'a&',
        'a<',
        'a>',
        'a[',
        'a]',
        'a(',
        'a)',
        'a"',
        'a~',
        'a;',
        'a+',
        'a@',
        'a:',
        'a*',
        'a$',
        'a^',
        'a%',
        'a{',
        'a}',
        'a?',
        'a!',
        'a,',
        'a=',
      ];

      // Act
      const result = characters.find((item) => {
        return validateName(item) === null;
      });

      // Assert
      expect(result).toBeUndefined();
    });

    it('should accept other languages', () => {
      // Arrange
      const languages = [
        'Español',
        'Français',
        '日本語',
        'Português',
        'Русский',
        'Tiếng Việt',
        '中文',
        'Български',
        'Bân-lâm-gú',
        'Беларуская',
        'Акадэмічная',
        'Català',
        'Čeština',
        'Ελληνικά',
        'فارسی',
        'Հայերեն',
        'Română',
        'Slovenščina',
        'Српски',
        'Српскохрватски',
        'Türkçe',
      ];

      // Act
      const result = languages.find((item) => {
        return validateName(item) !== null;
      });

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('validateMinLength', () => {
    it('should accept empty value', () => {
      // Arrange
      const value = '';

      // Act
      const result = validateMinLength(value);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept value with equal length than default min length', () => {
      // Arrange
      const value = 'pp';

      // Act
      const result = validateMinLength(value);

      // Assert
      expect(result).toBeNull();
    });

    it('should accept value with equal length than min length', () => {
      // Arrange
      const value = 'aa';
      const minLength = 2;

      // Act
      const result = validateMinLength(value, minLength);

      // Assert
      expect(result).toBeNull();
    });

    it('should not accept with a length value less than min length', () => {
      // Arrange
      const value = 'aa';
      const minLength = 3;

      // Act
      const result = validateMinLength(value, minLength);

      // Assert
      expect(result).toEqual('validation_messages.error_min_length');
    });

    it('should not accept with a length value less than min length and custom message value', () => {
      // Arrange
      const value = 'p';
      const minLength = 2;
      const customMessageKey = 'validation_messages.error_min_length_2';

      // Act
      const result = validateMinLength(value, minLength, customMessageKey);

      // Assert
      expect(result).toEqual('validation_messages.error_min_length_2');
    });

    it('should not accept with a length value less than default min length', () => {
      // Arrange
      const value = 'p';

      // Act
      const result = validateMinLength(value);

      // Assert
      expect(result).toEqual('validation_messages.error_min_length');
    });
  });

  describe('validateRfc', () => {
    it('should show the invalid message when the RFC is incorrect', () => {
      // Arrange
      const value = '123456';

      // Act
      const result = validateRfc(value);

      // Assert
      expect(result).toEqual('validation_messages.error_invalid_rfc');
    });

    it('should be accept the value when the RFC is valid', () => {
      // Arrange
      const value = 'CAAR530917EV7';

      // Act
      const result = validateRfc(value);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('validateCuit', () => {
    it('should show the invalid message when the CUIT is incorrect', () => {
      // Arrange
      const value = '25123456789';

      // Act
      const result = validateCuit(value);

      // Assert
      expect(result).toEqual('validation_messages.error_invalid_cuit');
    });

    it('should be accept the value when the CUIT is valid', () => {
      // Arrange
      const value = '24331550929';

      // Act
      const result = validateCuit(value);

      // Assert
      expect(result).toBeNull();
    });
  });
});

describe('validateCbu', () => {
  it('should return null for a valid string of numbers with 22 digits ', () => {
    // Arrange
    const value = '2850590940090418135201';

    // Act
    const result = validateCbu(value);

    // Assert
    expect(result).toBeNull();
  });

  it('should return the error message for a string with non-digits characters', () => {
    // Arrange
    const value = 'A850590940090418135201';

    // Act
    const result = validateCbu(value);

    // Assert
    expect(result).toEqual('validation_messages.error_invalid_cbu');
  });

  it('should return the error message for a string with less than 22 digits', () => {
    // Arrange
    const value = '285059094009041813520'; //21 digits

    // Act
    const result = validateCbu(value);

    // Assert
    expect(result).toEqual('validation_messages.error_invalid_cbu');
  });

  it('should return the error message for a string with more than 22 digits', () => {
    // Arrange
    const value = '28505909400904181352012'; //23 digits

    // Act
    const result = validateCbu(value);

    // Assert
    expect(result).toEqual('validation_messages.error_invalid_cbu');
  });
});
