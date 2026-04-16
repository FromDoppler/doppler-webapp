import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';
import { useZendeskSnippet } from '.';

const ZENDESK_SCRIPT_ID = 'ze-snippet';
const ZENDESK_SCRIPT_BASE_URL = 'https://static.zdassets.com/ekr/snippet.js?key=';

describe('useZendeskSnippet hook', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalAuthKey = process.env.REACT_APP_ZENDESK_AUTHENTICATED_KEY;
  const originalPublicKey = process.env.REACT_APP_ZENDESK_PUBLIC_KEY;

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    process.env.REACT_APP_ZENDESK_AUTHENTICATED_KEY = 'auth-key';
    process.env.REACT_APP_ZENDESK_PUBLIC_KEY = 'public-key';
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.REACT_APP_ZENDESK_AUTHENTICATED_KEY = originalAuthKey;
    process.env.REACT_APP_ZENDESK_PUBLIC_KEY = originalPublicKey;
    const existingScript = document.getElementById(ZENDESK_SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }
    jest.restoreAllMocks();
  });

  it('should not inject the script in test environment', () => {
    // Arrange
    process.env.NODE_ENV = 'test';

    // Act
    renderHook(() => useZendeskSnippet('authenticated'));

    // Assert
    expect(document.getElementById(ZENDESK_SCRIPT_ID)).toBeNull();
  });

  it('should not inject the script when session status is unknown', () => {
    // Act
    renderHook(() => useZendeskSnippet('unknown'));

    // Assert
    expect(document.getElementById(ZENDESK_SCRIPT_ID)).toBeNull();
  });

  it('should inject the authenticated key when session status is authenticated', () => {
    // Act
    renderHook(() => useZendeskSnippet('authenticated'));

    // Assert
    const script = document.getElementById(ZENDESK_SCRIPT_ID);
    expect(script).not.toBeNull();
    expect(script.src).toBe(`${ZENDESK_SCRIPT_BASE_URL}auth-key`);
    expect(script.async).toBe(true);
  });

  it('should inject the public key when session status is not authenticated', () => {
    // Act
    renderHook(() => useZendeskSnippet('non-authenticated'));

    // Assert
    const script = document.getElementById(ZENDESK_SCRIPT_ID);
    expect(script).not.toBeNull();
    expect(script.src).toBe(`${ZENDESK_SCRIPT_BASE_URL}public-key`);
  });

  it('should not inject the script when the resolved key is empty', () => {
    // Arrange
    process.env.REACT_APP_ZENDESK_PUBLIC_KEY = '';

    // Act
    renderHook(() => useZendeskSnippet('non-authenticated'));

    // Assert
    expect(document.getElementById(ZENDESK_SCRIPT_ID)).toBeNull();
  });

  it('should reload the page when the resolved key changes between renders', () => {
    // Arrange
    const reload = jest.fn();
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload },
    });

    // Act
    const { rerender } = renderHook(({ status }) => useZendeskSnippet(status), {
      initialProps: { status: 'non-authenticated' },
    });
    rerender({ status: 'authenticated' });

    // Assert
    expect(reload).toHaveBeenCalledTimes(1);

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });
});
