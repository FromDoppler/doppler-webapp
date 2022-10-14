import 'jest';
import {
  getDataHubParams,
  addDays,
  getStartOfDate,
  extractParameter,
  isWhitelisted,
  searchLinkByRel,
  logAxiosRetryError,
  thousandSeparatorNumber,
  compactNumber,
  orderPlanTypes,
  getFormInitialValues,
  getPlanTypeFromUrlSegment,
  objectKeystoLowerCase,
} from './utils';
import queryString from 'query-string';
import { PLAN_TYPE, URL_PLAN_TYPE } from './doppler-types';

describe('utils', () => {
  describe.each([
    ['should return plan type when the selected tab is by contact', PLAN_TYPE.byContact],
    ['should return plan type when the selected tab is by email', PLAN_TYPE.byEmail],
    ['should return plan type when the selected tab is by credit', PLAN_TYPE.byCredit],
  ])('getPlanTypeFromUrlSegment function', (testName, planType) => {
    it(testName, () => {
      // Arrange
      const planTypeUrl = URL_PLAN_TYPE[planType];

      // Act
      const planTypeFromUrl = getPlanTypeFromUrlSegment(planTypeUrl);

      // Assert
      expect(planTypeFromUrl).toBe(planType);
    });
  });

  describe('orderPlanTypes', () => {
    it('should sort plan types when all first plans are present', () => {
      // Arrange
      const planTypes = ['demo', 'prepaid', 'free', 'monthly-deliveries', 'subscribers'];
      const expectedPlans = ['subscribers', 'monthly-deliveries', 'prepaid', 'demo', 'free'];

      // Act
      const orderedPlans = orderPlanTypes(planTypes);

      // Assert
      expect(orderedPlans).toEqual(expectedPlans);
    });

    it('should sort plan types when there are only first 2 plans', () => {
      // Arrange
      const planTypes = ['demo', 'prepaid', 'free', 'monthly-deliveries'];
      const expectedPlans = ['monthly-deliveries', 'prepaid', 'demo', 'free'];

      // Act
      const orderedPlans = orderPlanTypes(planTypes);

      // Assert
      expect(orderedPlans).toEqual(expectedPlans);
    });

    it('should return original list when there are no plans to sort', () => {
      // Arrange
      const planTypes = ['demo', 'agencies', 'free'];
      const expectedPlans = ['demo', 'agencies', 'free'];

      // Act
      const orderedPlans = orderPlanTypes(planTypes);

      // Assert
      expect(orderedPlans).toEqual(expectedPlans);
    });

    it('should return original list when there are no plans to sort', () => {
      // Arrange
      const planTypes = [
        'demo',
        'free',
        'agencies',
        'monthly-deliveries',
        'prepaid',
        'subscribers',
      ];
      const expectedPlans = [
        'agencies',
        'prepaid',
        'free',
        'demo',
        'monthly-deliveries',
        'subscribers',
      ];
      const firstPlans = ['agencies', 'prepaid', 'free'];

      // Act
      const orderedPlans = orderPlanTypes(planTypes, firstPlans);

      // Assert
      expect(orderedPlans).toEqual(expectedPlans);
    });
  });

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

  describe('addDays feature', () => {
    it('should return a valid date, without mutating the base date', () => {
      // Arrange
      const initialDate = new Date();
      // Act
      const resultDate = addDays(initialDate, 3);
      // Assert
      expect(resultDate.toISOString()).toBeDefined();
      expect(initialDate).not.toEqual(resultDate);
    });

    it('should add three exact days to start date', () => {
      // Arrange
      const initialDate = new Date('01/01/2019');
      // Act
      const resultDate = addDays(initialDate, 3);
      // Assert
      expect(resultDate.getDate() - initialDate.getDate()).toBe(3);
    });
  });

  describe('getStartOfDate function', () => {
    it('should return a valid date', () => {
      // Arrange
      const initialDate = new Date();

      // Act
      const resultDate = getStartOfDate(initialDate);

      // Assert
      expect(resultDate.toDateString()).toBeDefined();
    });

    it('should return empty value when pass type different to Date', () => {
      // Arrange
      const initialDate = '20-13-2018';

      // Act
      const resultDate = getStartOfDate(initialDate);

      // Assert
      expect(resultDate).not.toBeDefined();
    });

    it('should return start of date with 0 minutes and 0 seconds', () => {
      // Arrange
      const initialDate = new Date('2019-08-15T03:23:59.123');

      // Act
      const resultDate = getStartOfDate(initialDate);

      // Assert
      expect(resultDate.toDateString()).toBeDefined();
      expect(resultDate.getMinutes()).toEqual(0);
      expect(resultDate.getSeconds()).toEqual(0);
      expect(resultDate.getMilliseconds()).toEqual(0);
      expect(resultDate.getFullYear()).toEqual(initialDate.getFullYear());
      expect(resultDate.getMonth()).toEqual(initialDate.getMonth());
      expect(resultDate.getDate()).toEqual(initialDate.getDate());
    });
  });

  describe('extractParameter function', () => {
    it('should map parameter if it exists uppercase', () => {
      // Arrange
      var location = {
        search: '?Page=signup',
      };

      // Act
      var param = extractParameter(location, queryString.parse, 'page', 'Page');

      // Assert
      expect(param).toEqual('signup');
    });

    it('should map parameter if it exists only lowercase', () => {
      // Arrange
      var location = {
        search: '?Page=signup&redirect=http://mypage.com',
      };

      // Act
      var param = extractParameter(location, queryString.parse, 'redirect');

      // Assert
      expect(param).toEqual('http://mypage.com');
    });

    it('should map parameter with char +', () => {
      // Arrange
      var location = {
        search: '?email=fcoronel+2@makingsense.com',
      };

      // Act
      var param = extractParameter(location, queryString.parse, 'email');

      // Assert
      expect(param).toEqual('fcoronel 2@makingsense.com');
    });

    it('should return null if parameter does not exist', () => {
      // Arrange
      var location = {
        search: '?Page=signup&redirect=http://mypage.com',
      };

      // Act
      var param = extractParameter(location, queryString.parse, 'otherparam');

      // Assert
      expect(param).toEqual(null);
    });

    it('should return null if url has no parameters', () => {
      // Arrange
      var location = {
        search: '',
      };

      // Act
      var param = extractParameter(location, queryString.parse, 'otherparam');

      // Assert
      expect(param).toEqual(null);
    });
  });

  describe('isWhitelisted function', () => {
    it('should receive empty url without breaking', () => {
      // Arrange
      // Act
      var isAllowed = isWhitelisted('');
      // Assert
      expect(isAllowed).toBe(false);
    });
  });

  //search links with regular expression in the rel property
  describe('search link by pattern', () => {
    it('should return a valid link, with text "file otras palabras" ', () => {
      // Arrange
      var rel = 'file';
      var links = [
        {
          rel: 'file otras palabras',
          href: 'http://test.com/link.pdf',
          description: 'Test link',
        },
      ];

      // Act
      const result = searchLinkByRel(links, rel);

      // Assert
      expect(result[0]).not.toEqual(undefined);
    });

    it('should return a valid link, with text "otras palabras file" ', () => {
      // Arrange
      var rel = 'file';
      var links = [
        {
          rel: 'otras palabras file',
          href: 'http://test.com/link.pdf',
          description: 'Test link',
        },
      ];

      // Act
      const result = searchLinkByRel(links, rel);

      // Assert
      expect(result[0]).not.toEqual(undefined);
    });

    it('should return a valid link, with text "otras file palabras" ', () => {
      // Arrange
      var rel = 'file';
      var links = [
        {
          rel: 'otras file palabras',
          href: 'http://test.com/link.pdf',
          description: 'Test link',
        },
      ];

      // Act
      const result = searchLinkByRel(links, rel);

      // Assert
      expect(result[0]).not.toEqual(undefined);
    });

    it('should return a valid link, with text "file" ', () => {
      // Arrange
      var rel = 'file';
      var links = [
        {
          rel: 'file',
          href: 'http://test.com/link.pdf',
          description: 'Test link',
        },
      ];

      // Act
      const result = searchLinkByRel(links, rel);

      // Assert
      expect(result[0]).not.toEqual(undefined);
    });

    it('should not return a link, with text "fileotro" ', () => {
      // Arrange
      var rel = 'file';
      var links = [
        {
          rel: 'fileotro',
          href: 'http://test.com/link.pdf',
          description: 'Test link',
        },
      ];

      // Act
      const result = searchLinkByRel(links, rel);

      // Assert
      expect(result[0]).toEqual(undefined);
    });

    it('should not return a link, with text "otrofile" ', () => {
      // Arrange
      var rel = 'file';
      var links = [
        {
          rel: 'otrofile',
          href: 'http://test.com/link.pdf',
          description: 'Test link',
        },
      ];

      // Act
      const result = searchLinkByRel(links, rel);

      // Assert
      expect(result[0]).toEqual(undefined);
    });
  });

  describe('logAxiosRetryError', () => {
    it('should log error correctly for signup', () => {
      // Arrange
      let logEntry;
      const addLogEntry = jest.fn().mockImplementation((obj) => (logEntry = obj));
      const fakeWindow = {
        navigator: {
          userAgent: 'some',
        },
        location: {
          origin: 'localhost',
        },
      };
      const axiosError = {
        config: {
          data: `{"Email":"somemail@mail.com","Origin":"academy/cursos"}`,
          url: 'webapp/CreateUser',
        },
        message: 'Network Error',
      };

      // Act
      logAxiosRetryError(axiosError, addLogEntry, fakeWindow);

      // Assert
      expect(logEntry.origin).not.toBe(undefined);
      expect(logEntry.account).not.toBe(undefined);
      expect(logEntry.message).not.toBe(undefined);
    });

    it('should log error correctly for login', () => {
      // Arrange
      let logEntry;
      const addLogEntry = jest.fn().mockImplementation((obj) => (logEntry = obj));
      const fakeWindow = {
        navigator: {
          userAgent: 'some',
        },
        location: {
          origin: 'localhost',
        },
      };
      const axiosError = {
        config: {
          data: `{"Username":"somemail@mail.com"}`,
          url: 'webapp/Login',
        },
        message: 'Network Error',
      };

      // Act
      logAxiosRetryError(axiosError, addLogEntry, fakeWindow);

      // Assert
      expect(logEntry.account).not.toBe(undefined);
      expect(logEntry.message).not.toBe(undefined);
    });

    it('should not break if parameters are missing', () => {
      // Arrange
      let logEntry;
      const addLogEntry = jest.fn().mockImplementation((obj) => (logEntry = obj));
      const fakeWindow = {
        navigator: {
          userAgent: 'some',
        },
        location: {
          origin: 'localhost',
        },
      };
      const axiosError = {
        config: {
          data: `{"other":"otherData"}`,
        },
        message: 'Network Error',
      };

      // Act
      logAxiosRetryError(axiosError, addLogEntry, fakeWindow);

      // Assert
      expect(logEntry.account).toBe(undefined);
      expect(logEntry.message).not.toBe(undefined);
    });

    it('should not break if error is empty', () => {
      // Arrange
      let logEntry;
      const addLogEntry = jest.fn().mockImplementation((obj) => (logEntry = obj));
      const fakeWindow = {
        navigator: {
          userAgent: 'some',
        },
        location: {
          origin: 'localhost',
        },
      };
      const axiosError = { config: {}, message: 'Unexpected' };

      // Act
      logAxiosRetryError(axiosError, addLogEntry, fakeWindow);

      // Assert
      expect(logEntry.account).toBe(undefined);
      expect(logEntry.message).not.toBe(undefined);
    });
  });

  describe('thousandSeparatorNumber function', () => {
    it('should return correct intl format for numbers in ESP', () => {
      // Assert
      expect(thousandSeparatorNumber('es', 100)).toBe('100');
      expect(thousandSeparatorNumber('es', 1000)).toBe('1.000');
      expect(thousandSeparatorNumber('es', 10000)).toBe('10.000');
    });

    it('should return correct intl format for numbers in ENG', () => {
      // Assert
      expect(thousandSeparatorNumber('en', 100)).toBe('100');
      expect(thousandSeparatorNumber('en', 1000)).toBe('1,000');
      expect(thousandSeparatorNumber('en', 10000)).toBe('10,000');
    });
  });

  describe('compactNumber function', () => {
    it('should return correct compact format for numbers (no matter what language)', () => {
      // Assert
      expect(compactNumber(100)).toBe('100');
      expect(compactNumber(1000)).toBe('1K');
      expect(compactNumber(10000)).toBe('10K');
    });
  });

  describe('getFormInitialValues function', () => {
    it('should return an object with empty values when fieldNames it has properties', () => {
      // Arrange
      const field1 = 'field1';
      const field2 = 'field2';

      const fieldNames = {
        [field1]: field1,
        [field2]: field2,
      };
      const expectedResult = {
        [field1]: '',
        [field2]: '',
      };

      // Act
      const result = getFormInitialValues(fieldNames);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('should return an empty object when fieldNames it has not properties', () => {
      // Arrange
      const fieldNames = {};
      const expectedResult = {};

      // Act
      const result = getFormInitialValues(fieldNames);

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe('objectKeystoLowerCase function', () => {
    it('should return the same object with lowercase keys', () => {
      // Arrange
      const testingObject = {
        Key0: 'value1',
        KEY1: 'value2',
        KeY2: 'value3',
      };
      const expectedResult = {
        key0: 'value1',
        key1: 'value2',
        key2: 'value3',
      };

      // Act
      const result = objectKeystoLowerCase(testingObject);

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });
});
