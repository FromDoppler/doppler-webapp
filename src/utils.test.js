import 'jest';
import {
  getDataHubParams,
  useInterval,
  addDays,
  getStartOfDate,
  extractParameter,
  isWhitelisted,
  searchLinkByRel,
  logAxiosRetryError,
  addLogEntry,
} from './utils';
import { renderHook } from '@testing-library/react-hooks';
import queryString from 'query-string';

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

  describe('setInterval custom hook', () => {
    it('should set an interval and update an outside value', () => {
      // Arrange
      jest.useFakeTimers();
      let counter = 0;

      // Act
      renderHook(() =>
        useInterval({
          runOnStart: false,
          delay: 100,
          callback: () => {
            counter++;
          },
        }),
      );
      jest.runOnlyPendingTimers();

      // Assert
      expect(counter).toBe(1);
    });

    it('should set an interval and pause when delay is null', () => {
      // Arrange
      jest.useFakeTimers();
      let counter = 0;
      // Act
      const { rerender } = renderHook(
        ({ delay }) =>
          useInterval({
            runOnStart: false,
            delay: delay,
            callback: () => {
              counter++;
            },
          }),
        { initialProps: { delay: 100 } },
      );
      // Assert
      jest.advanceTimersByTime(600);
      rerender({ delay: null });
      jest.advanceTimersByTime(800);
      expect(counter).toBe(6);
    });

    it('should set an interval and run callback before start', () => {
      // Arrange
      jest.useFakeTimers();
      let counter = 0;
      // Act
      renderHook(() =>
        useInterval({
          runOnStart: true,
          delay: 100,
          callback: () => {
            counter++;
          },
        }),
      );
      expect(counter).toBe(1);

      jest.advanceTimersByTime(200);
      // Assert
      expect(counter).toBe(3);
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
      expect(logEntry.errorMessage).not.toBe(undefined);
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
      expect(logEntry.errorMessage).not.toBe(undefined);
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
      expect(logEntry.errorMessage).not.toBe(undefined);
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
      expect(logEntry.errorMessage).not.toBe(undefined);
    });
  });
});
