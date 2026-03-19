import { useEffect, useRef } from 'react';

const ZENDESK_SCRIPT_ID = 'ze-snippet';
const ZENDESK_SCRIPT_BASE_URL = 'https://static.zdassets.com/ekr/snippet.js?key=';

const cleanupZendeskDOM = () => {
  const script = document.getElementById(ZENDESK_SCRIPT_ID);
  if (script) {
    script.remove();
  }

  document.querySelectorAll('[id^="ze-"]').forEach((el) => el.remove());
  document.querySelectorAll('iframe[title*="zendesk" i]').forEach((el) => el.remove());
  document.querySelectorAll('iframe[title*="messaging" i]').forEach((el) => el.remove());
  document.querySelectorAll('iframe[class^="zEWidget-"]').forEach((el) => {
    const wrapper = el.parentNode;
    if (wrapper && wrapper.tagName === 'DIV') {
      wrapper.remove();
    }
  });
  document.querySelectorAll('head iframe[src="javascript:false"]').forEach((el) => el.remove());

  window.zE = undefined;
  window.zESettings = undefined;
  window.zEmbed = undefined;
  window.zEACLoaded = undefined;

  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('ZD-') || key.includes('zd_') || key.includes('zendesk'))
      .forEach((key) => localStorage.removeItem(key));
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith('ZD-') || key.includes('zd_') || key.includes('zendesk'))
      .forEach((key) => sessionStorage.removeItem(key));
  } catch (e) {
  }
};

const removeZendeskWidget = () => {
  return new Promise((resolve) => {
    if (typeof window.zE === 'function') {
      try {
        window.zE('messenger', 'close');
        window.zE('messenger', 'hide');
      } catch (e) {
      }
    }
    setTimeout(() => {
      cleanupZendeskDOM();
      resolve();
    }, 100);
  });
};

const loadZendeskScript = (key) => {
  const script = document.createElement('script');
  script.id = ZENDESK_SCRIPT_ID;
  script.src = `${ZENDESK_SCRIPT_BASE_URL}${key}`;
  script.async = true;
  document.body.appendChild(script);
  return script;
};

export const useZendeskSnippet = (isAuthenticated) => {
  const defaultKeyRef = useRef(null);
  const swappedRef = useRef(false);

  useEffect(() => {
    const script = document.getElementById(ZENDESK_SCRIPT_ID);
    if (script) {
      const url = new URL(script.src);
      defaultKeyRef.current = url.searchParams.get('key');
    }
  }, []);

  useEffect(() => {
    const authenticatedKey = process.env.REACT_APP_ZENDESK_AUTHENTICATED_KEY;

    if (isAuthenticated && authenticatedKey && !swappedRef.current) {
      swappedRef.current = true;
      removeZendeskWidget().then(() => {
        loadZendeskScript(authenticatedKey);
      });
    } else if (!isAuthenticated && swappedRef.current) {
      swappedRef.current = false;
      removeZendeskWidget().then(() => {
        if (defaultKeyRef.current) {
          loadZendeskScript(defaultKeyRef.current);
        }
      });
    }
  }, [isAuthenticated]);
};
