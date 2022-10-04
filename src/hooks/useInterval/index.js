import { useCallback, useEffect, useState } from 'react';

const useInterval = () => {
  const [intervalIds, setIntervalIds] = useState([]);

  // clear the interval.
  useEffect(() => {
    return () => intervalIds.forEach((intervalId) => clearInterval(intervalId));
  }, [intervalIds]);

  const createInterval = (callback, delay) => {
    // Don't schedule if no delay or callback is specified.
    if (delay === null || !callback) {
      return;
    }

    const intervalId = setInterval(callback, delay);
    setIntervalIds((intervalIds) => [...intervalIds, intervalId]);

    return intervalId;
  };

  return useCallback(createInterval, []);
};

export default useInterval;
