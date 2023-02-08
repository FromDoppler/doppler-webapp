import '@testing-library/jest-dom/extend-expect';
import useInterval from '.';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useInterval hook', () => {
  const delay = 1000;
  let callback;

  beforeEach(() => {
    jest.useFakeTimers('legacy');
    callback = jest.fn();
  });

  it('should execute callback function every 1 second', async () => {
    // Act
    const {
      result: { current: createInterval },
      unmount,
    } = renderHook(() => useInterval());

    act(() => {
      createInterval(callback, delay);
    });

    // Assert
    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalledTimes(1);

    expect(clearInterval).toHaveBeenCalledTimes(0);
    unmount();
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });

  it('should execute the callback functions every 1 second, 1.5 second and 2 second', async () => {
    // Arrange
    const callback2 = jest.fn();
    const callback3 = jest.fn();
    const delay2 = 1500;
    const delay3 = 2000;

    // Act
    const {
      result: { current: createInterval },
      unmount,
    } = renderHook(() => useInterval());

    act(() => {
      createInterval(callback, delay);
      createInterval(callback2, delay2);
      createInterval(callback3, delay3);
    });

    // Assert
    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(delay2 - delay);
    expect(callback2).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(delay3 - delay2);
    expect(callback3).toHaveBeenCalledTimes(1);

    expect(clearInterval).toHaveBeenCalledTimes(0);
    unmount();
    expect(clearInterval).toHaveBeenCalledTimes(3);
  });

  it('should not execute callback function', () => {
    // Act
    const { unmount } = renderHook(() => useInterval());

    // Assert
    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalledTimes(0);

    expect(clearInterval).toHaveBeenCalledTimes(0);
    unmount();
    expect(clearInterval).toHaveBeenCalledTimes(0);
  });
});
