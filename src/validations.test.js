import 'jest';
import {
  validateEmail,
  validateRequiredField,
  validateCheckRequired,
  validatePassword,
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

    it('should accept an email address with ñ', () => {
      // Arrange
      const emailAddress = 'test@testñ.com';

      // Act
      const result = validateEmail(emailAddress);

      // Assert
      expect(result).toBeNull();
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

    it('should return a custom error', () => {
      // Arrange
      const emailAddress = 'invalid email address';
      const customKey = 'custom-key';

      // Act
      const result = validateEmail(emailAddress, customKey);

      // Assert
      expect(result).toEqual(customKey);
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
});
