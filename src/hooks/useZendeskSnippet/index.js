import { useEffect, useRef } from 'react';

const ZENDESK_SCRIPT_ID = 'ze-snippet';
const ZENDESK_SCRIPT_BASE_URL = 'https://static.zdassets.com/ekr/snippet.js?key=';

const removeZendeskWidget = () => {
  const script = document.getElementById(ZENDESK_SCRIPT_ID);
  if (script) {
    script.remove();
  }

  document.querySelectorAll('[id^="ze-"]').forEach((el) => el.remove());
  document.querySelectorAll('iframe[title*="zendesk" i]').forEach((el) => el.remove());
  document.querySelectorAll('iframe[title*="messaging" i]').forEach((el) => el.remove());

  window.zE = undefined;
  window.zESettings = undefined;
  window.zEmbed = undefined;
  window.zEACLoaded = undefined;
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
      removeZendeskWidget();
      loadZendeskScript(authenticatedKey);
      swappedRef.current = true;
    } else if (!isAuthenticated && swappedRef.current) {
      removeZendeskWidget();
      if (defaultKeyRef.current) {
        loadZendeskScript(defaultKeyRef.current);
      }
      swappedRef.current = false;
    }
  }, [isAuthenticated]);
};
