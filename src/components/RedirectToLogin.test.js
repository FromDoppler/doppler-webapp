import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import RedirectToLogin from './RedirectToLogin';

describe('RedirectToLogin', () => {
  it('should redirect to /login without parameters when from has no query params', () => {
    // Arrange
    const from = {
      pathname: '/dashboard',
      search: '',
      hash: '',
    };

    let capturedLocation = null;
    const LoginCapture = () => {
      capturedLocation = useLocation();
      return <div>Login</div>;
    };

    // Act
    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route path="/test" element={<RedirectToLogin from={from} />} />
          <Route path="/login" element={<LoginCapture />} />
        </Routes>
      </MemoryRouter>,
    );

    // Assert
    expect(capturedLocation.pathname).toBe('/login');
    expect(capturedLocation.search).toBe('');
  });

  it('should preserve page parameter when redirecting to login', () => {
    // Arrange
    const from = {
      pathname: '/plan-selection/premium/by-contacts',
      search: '?page=doppler-academy&PromoCode=DOPP50OFF',
      hash: '',
    };

    let capturedLocation = null;
    const LoginCapture = () => {
      capturedLocation = useLocation();
      return <div>Login</div>;
    };

    // Act
    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route path="/test" element={<RedirectToLogin from={from} />} />
          <Route path="/login" element={<LoginCapture />} />
        </Routes>
      </MemoryRouter>,
    );

    // Assert
    expect(capturedLocation.pathname).toBe('/login');
    expect(capturedLocation.search).toContain('page=doppler-academy');
    expect(capturedLocation.search).not.toContain('PromoCode');
  });

  it('should handle case-insensitive parameters (Page uppercase)', () => {
    // Arrange
    const from = {
      pathname: '/dashboard',
      search: '?Page=test-page',
      hash: '',
    };

    let capturedLocation = null;
    const LoginCapture = () => {
      capturedLocation = useLocation();
      return <div>Login</div>;
    };

    // Act
    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route path="/test" element={<RedirectToLogin from={from} />} />
          <Route path="/login" element={<LoginCapture />} />
        </Routes>
      </MemoryRouter>,
    );

    // Assert
    expect(capturedLocation.pathname).toBe('/login');
    expect(capturedLocation.search).toContain('page=test-page');
  });

  it('should maintain state with from location for post-login redirect', () => {
    // Arrange
    const from = {
      pathname: '/plan-selection/premium/by-contacts',
      search: '?PromoCode=DOPP50OFF&page=test',
      hash: '',
    };

    let capturedLocation = null;
    const LoginCapture = () => {
      capturedLocation = useLocation();
      return <div>Login</div>;
    };

    // Act
    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route path="/test" element={<RedirectToLogin from={from} />} />
          <Route path="/login" element={<LoginCapture />} />
        </Routes>
      </MemoryRouter>,
    );

    // Assert
    expect(capturedLocation.state).toEqual({ from });
  });

  it('should not preserve parameters not in PARAMS_TO_PRESERVE list', () => {
    // Arrange
    const from = {
      pathname: '/dashboard',
      search: '?page=test&PromoCode=DOPP50OFF&utm_source=email&redirect=somewhere',
      hash: '',
    };

    let capturedLocation = null;
    const LoginCapture = () => {
      capturedLocation = useLocation();
      return <div>Login</div>;
    };

    // Act
    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route path="/test" element={<RedirectToLogin from={from} />} />
          <Route path="/login" element={<LoginCapture />} />
        </Routes>
      </MemoryRouter>,
    );

    // Assert
    expect(capturedLocation.pathname).toBe('/login');
    expect(capturedLocation.search).toContain('page=test');
    expect(capturedLocation.search).not.toContain('PromoCode');
    expect(capturedLocation.search).not.toContain('utm_source');
    expect(capturedLocation.search).not.toContain('redirect');
  });
});
