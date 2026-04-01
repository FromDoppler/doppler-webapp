import { useEffect, useRef } from 'react';

const ZENDESK_SCRIPT_ID = 'ze-snippet';
const ZENDESK_SCRIPT_BASE_URL = 'https://static.zdassets.com/ekr/snippet.js?key=';

const loadZendeskScript = (key) => {
  const script = document.createElement('script');
  script.id = ZENDESK_SCRIPT_ID;
  script.src = `${ZENDESK_SCRIPT_BASE_URL}${key}`;
  script.async = true;
  document.body.appendChild(script);
};

const getZendeskKey = (sessionStatus) =>
  sessionStatus === 'authenticated'
    ? process.env.REACT_APP_ZENDESK_AUTHENTICATED_KEY
    : process.env.REACT_APP_ZENDESK_PUBLIC_KEY;

export const useZendeskSnippet = (sessionStatus) => {
  const loadedKeyRef = useRef(null);

  useEffect(() => {
    if (sessionStatus === 'unknown') {
      return;
    }

    const key = getZendeskKey(sessionStatus);

    if (loadedKeyRef.current === null) {
      loadedKeyRef.current = key;
      if (key) {
        loadZendeskScript(key);
      }
      return;
    }

    if (key !== loadedKeyRef.current) {
      window.location.reload();
    }
  }, [sessionStatus]);
};
