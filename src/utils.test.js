import 'jest';
import { getDataHubParams } from './utils';

describe('utils', () => {
  describe('getDataHubParams', () => {
    it('should parse url with no params and no hash correctly', () => {
      //Arrange
      //Act
      const dataHubParams = getDataHubParams('/login');
      //Assert
      expect(dataHubParams.navigatedPage).toBe('/login');
      expect(dataHubParams.search).toBe('');
      expect(dataHubParams.hash).toBe('');
    });
    it('should parse url with no params and hash correctly', () => {
      //Arrange
      //Act
      const dataHubParams = getDataHubParams('/login#hash');
      //Assert
      expect(dataHubParams.navigatedPage).toBe('/login');
      expect(dataHubParams.search).toBe('');
      expect(dataHubParams.hash).toBe('#hash');
    });
    it('should parse url with params and no hash correctly', () => {
      //Arrange
      //Act
      const dataHubParams = getDataHubParams('/login?param1=value');
      //Assert
      expect(dataHubParams.navigatedPage).toBe('/login');
      expect(dataHubParams.search).toBe('?param1=value');
      expect(dataHubParams.hash).toBe('');
    });
    it('should parse url with params and hash correctly', () => {
      //Arrange
      //Act
      const dataHubParams = getDataHubParams('/login?param1=value#hash');
      //Assert
      expect(dataHubParams.navigatedPage).toBe('/login');
      expect(dataHubParams.search).toBe('?param1=value');
      expect(dataHubParams.hash).toBe('#hash');
    });
    it('should parse url with several params and several hash correctly', () => {
      //Arrange
      //Act
      const dataHubParams = getDataHubParams('/login?param1=value&param2=value2#hash1#hash2');
      //Assert
      expect(dataHubParams.navigatedPage).toBe('/login');
      expect(dataHubParams.search).toBe('?param1=value&param2=value2');
      expect(dataHubParams.hash).toBe('#hash1#hash2');
    });
    it('should parse url with several params even badly formatted and several hash correctly', () => {
      //Arrange
      //Act
      const dataHubParams = getDataHubParams(
        '/login?param1=value?param2=value2?param3=value3#hash1#hash2',
      );
      //Assert
      expect(dataHubParams.navigatedPage).toBe('/login');
      expect(dataHubParams.search).toBe('?param1=value?param2=value2?param3=value3');
      expect(dataHubParams.hash).toBe('#hash1#hash2');
    });
  });
});
