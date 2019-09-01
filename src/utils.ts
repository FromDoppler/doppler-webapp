import urlParse from 'url-parse';
import { useEffect, useRef } from 'react';

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getDataHubParams(partialUrl: string) {
  const parsedUrl = urlParse(partialUrl, false);
  return {
    navigatedPage: parsedUrl.pathname,
    hash: parsedUrl.hash,
    search: parsedUrl.query,
  };
}

export function useInterval({
  callback,
  delay,
  runOnStart,
}: {
  callback: () => void;
  delay: number;
  runOnStart: boolean;
}) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current();
    }
    if (delay !== null) {
      if (runOnStart) {
        savedCallback.current && savedCallback.current();
      }
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, runOnStart]);
}
