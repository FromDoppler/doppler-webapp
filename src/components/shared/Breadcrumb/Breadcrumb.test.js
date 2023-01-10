import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';
import { BrowserRouter } from 'react-router-dom';

describe('Breadcrumb Component', () => {
  afterEach(cleanup);

  it('should show Breadcrumb', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <Breadcrumb />
      </BrowserRouter>,
    );

    // Asserts
    expect(container.querySelector('.dp-breadcrumb')).toBeInTheDocument();
  });

  it('should show Breadcrumb without <li> item when the breadcrumb has no elements', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <Breadcrumb></Breadcrumb>
      </BrowserRouter>,
    );

    // Asserts
    expect(container.querySelector('.dp-breadcrumb li')).not.toBeInTheDocument();
  });

  it('should show Breadcrumb with <a> item when new item contains href', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <Breadcrumb>
          <BreadcrumbItem href={'http://Test'} text={'Item Test'} />
        </Breadcrumb>
      </BrowserRouter>,
    );

    // Asserts
    expect(container.querySelector('.dp-breadcrumb li a')).toBeInTheDocument();
  });

  it('should show Breadcrumb without <a> item when item not contains href', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <Breadcrumb>
          <BreadcrumbItem text={'Item Test'} />
        </Breadcrumb>
      </BrowserRouter>,
    );

    // Asserts
    expect(container.querySelector('.dp-breadcrumb li a')).not.toBeInTheDocument();
  });

  it('Should render Link component when href redirects inside webapp', () => {
    //Act
    render(
      <BrowserRouter>
        <Breadcrumb>
          <BreadcrumbItem href={'/Test'} text={'Item Test'} />
        </Breadcrumb>
      </BrowserRouter>,
    );

    // Asserts
    expect(screen.queryByTestId('internal-link')).toBeInTheDocument();
  });

  it('Should not render Link component when href redirects outside webapp', () => {
    //Act
    render(
      <BrowserRouter>
        <Breadcrumb>
          <BreadcrumbItem href={'http://Test'} text={'Item Test'} />
        </Breadcrumb>
      </BrowserRouter>,
    );

    // Asserts
    expect(screen.queryByTestId('internal-link')).not.toBeInTheDocument();
  });
});
