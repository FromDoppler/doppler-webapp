import { useEffect } from 'react';
import '@testing-library/jest-dom/extend-expect';
import useTimeout from '.';
import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';

describe('useTimeout hook', () => {
  const delay = 1000;
  let callback;

  beforeEach(() => {
    jest.useFakeTimers();
    callback = jest.fn();
  });

  it('should execute callback function after 1 second', async () => {
    // Act
    const { unmount } = renderHook(() => {
      const createTimeout = useTimeout();

      useEffect(() => {
        createTimeout(callback, delay);
      }, []);
    });

    // Assert
    jest.advanceTimersByTime(delay);
    await waitFor(() => expect(callback).toHaveBeenCalledTimes(1));

    expect(clearTimeout).toHaveBeenCalledTimes(0);
    unmount();
    expect(clearTimeout).toHaveBeenCalledTimes(1);
  });

  it('should execute the callback functions after 1 second and 1.5 second', async () => {
    // Arrange
    const callback2 = jest.fn();
    const delay2 = 1500;

    // Act
    const { unmount } = renderHook(() => {
      const createTimeout = useTimeout();

      useEffect(() => {
        createTimeout(callback, delay);
        createTimeout(callback2, delay2);
      }, []);
    });

    // Assert
    jest.runAllTimers(delay);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);

    expect(clearTimeout).toHaveBeenCalledTimes(0);
    unmount();
    expect(clearTimeout).toHaveBeenCalledTimes(2);
  });

  it('should not execute callback function', () => {
    // Act
    const { unmount } = renderHook(() => useTimeout());

    // Assert
    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalledTimes(0);

    expect(clearTimeout).toHaveBeenCalledTimes(0);
    unmount();
    expect(clearTimeout).toHaveBeenCalledTimes(0);
  });
});
