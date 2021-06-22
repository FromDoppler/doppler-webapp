import { useCallback, useEffect, useState } from 'react';

const useTimeout = () => {
  const [timerIds, setTimerIds] = useState([]);

  // clear the timeout.
  useEffect(() => {
    return () => timerIds.forEach((timerId) => clearTimeout(timerId));
  }, [timerIds]);

  const createTimeout = (callback, delay) => {
    // Don't schedule if no delay or callback is specified.
    if (delay === null || !callback) {
      return;
    }

    const id = setTimeout(callback, delay);
    setTimerIds((timerIds) => [...timerIds, id]);
  };

  return useCallback(createTimeout, []);
};

export default useTimeout;
