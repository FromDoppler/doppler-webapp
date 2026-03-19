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

export const useZendeskSnippet = (sessionStatus) => {
  const resolvedStatusRef = useRef(null);

  useEffect(() => {
    if (sessionStatus === 'unknown') {
      return;
    }

    if (resolvedStatusRef.current === null) {
      resolvedStatusRef.current = sessionStatus;
      const key =
        sessionStatus === 'authenticated'
          ? process.env.REACT_APP_ZENDESK_AUTHENTICATED_KEY
          : process.env.REACT_APP_ZENDESK_PUBLIC_KEY;
      if (key) {
        loadZendeskScript(key);
      }
      return;
    }

    if (sessionStatus !== resolvedStatusRef.current) {
      window.location.reload();
    }
  }, [sessionStatus]);
};
