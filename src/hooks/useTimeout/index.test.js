import '@testing-library/jest-dom/extend-expect';
import useTimeout from '.';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useTimeout hook', () => {
  const delay = 1000;
  let callback;

  beforeEach(() => {
    jest.useFakeTimers('legacy');
    callback = jest.fn();
  });

  it('should execute callback function after 1 second', async () => {
    // Act
    const {
      result: { current: createTimeout },
      unmount,
    } = renderHook(() => useTimeout());

    act(() => {
      createTimeout(callback, delay);
    });

    // Assert
    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalledTimes(1);

    expect(clearTimeout).toHaveBeenCalledTimes(0);
    unmount();
    expect(clearTimeout).toHaveBeenCalledTimes(1);
  });

  it('should execute the callback functions after 1 second, 1.5 second and 2 second', async () => {
    // Arrange
    const callback2 = jest.fn();
    const callback3 = jest.fn();
    const delay2 = 1500;
    const delay3 = 2000;

    // Act
    const {
      result: { current: createTimeout },
      unmount,
    } = renderHook(() => useTimeout());

    act(() => {
      createTimeout(callback, delay);
      createTimeout(callback2, delay2);
      createTimeout(callback3, delay3);
    });

    // Assert
    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(delay2 - delay);
    expect(callback2).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(delay3 - delay2);
    expect(callback3).toHaveBeenCalledTimes(1);

    expect(clearTimeout).toHaveBeenCalledTimes(0);
    unmount();
    expect(clearTimeout).toHaveBeenCalledTimes(3);
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
