import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Pagination } from './Pagination';
import { BrowserRouter } from 'react-router-dom';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('Pagination Component', () => {
  afterEach(cleanup);

  it('should show previous page element when current page is not the first one', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <DopplerIntlProvider locale="es">
          <Pagination currentPage={2} pagesCount={100} urlToGo={'https://domain.com/section?'} />
        </DopplerIntlProvider>
      </BrowserRouter>,
    );

    // Asserts
    expect(container.querySelector('.icon-arrow-prev')).toBeInTheDocument();
  });

  it('should show next page element when current page is not the last one', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <DopplerIntlProvider locale="es">
          <Pagination currentPage={99} pagesCount={100} urlToGo={'https://domain.com/section?'} />
        </DopplerIntlProvider>
      </BrowserRouter>,
    );

    // Asserts
    expect(container.querySelector('.icon-arrow-next')).toBeInTheDocument();
  });

  it('should not show previous page element when current page is the first one', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <DopplerIntlProvider locale="es">
          <Pagination currentPage={1} pagesCount={100} urlToGo={'https://domain.com/section?'} />
        </DopplerIntlProvider>
      </BrowserRouter>,
    );

    // Asserts
    expect(container.querySelector('.icon-arrow-prev')).not.toBeInTheDocument();
  });

  it('should not show next page element when current page is the last one', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <DopplerIntlProvider locale="es">
          <Pagination currentPage={100} pagesCount={100} urlToGo={'https://domain.com/section?'} />
        </DopplerIntlProvider>
      </BrowserRouter>,
    );

    // Asserts
    expect(container.querySelector('.icon-arrow-next')).not.toBeInTheDocument();
  });

  it('should show ... to slide to left when selected page is not the first one', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <DopplerIntlProvider locale="es">
          <Pagination currentPage={3} pagesCount={100} urlToGo={'https://domain.com/section?'} />
        </DopplerIntlProvider>
      </BrowserRouter>,
    );

    // Asserts
    expect(container.querySelector('#pag-point-left')).toBeInTheDocument();
  });

  it('should show ... to slide to right when selected page is not one of the last 5 pages', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <DopplerIntlProvider locale="es">
          <Pagination currentPage={90} pagesCount={100} urlToGo={'https://domain.com/section?'} />
        </DopplerIntlProvider>
      </BrowserRouter>,
    );

    // Asserts
    expect(container.querySelector('#pag-point-right')).toBeInTheDocument();
  });

  it('should not show ... to slide to left when selected page is the first one', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <DopplerIntlProvider locale="es">
          <Pagination currentPage={1} pagesCount={100} urlToGo={'https://domain.com/section?'} />
        </DopplerIntlProvider>
      </BrowserRouter>,
    );

    // Asserts
    expect(container.querySelector('#pag-point-left')).not.toBeInTheDocument();
  });

  it('should not show ... to slide to right when selected page is one of the last 5 pages', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <DopplerIntlProvider locale="es">
          <Pagination currentPage={96} pagesCount={100} urlToGo={'https://domain.com/section?'} />
        </DopplerIntlProvider>
      </BrowserRouter>,
    );

    // Asserts
    expect(container.querySelector('#pag-point-right')).not.toBeInTheDocument();
  });

  it('should not show any ... neither to slide to right neither to slide to left if page count is 5', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <DopplerIntlProvider locale="es">
          <Pagination currentPage={1} pagesCount={5} urlToGo={'https://domain.com/section?'} />
        </DopplerIntlProvider>
      </BrowserRouter>,
    );

    // Asserts
    expect(container.querySelector('#pag-point-right')).not.toBeInTheDocument();
    expect(container.querySelector('#pag-point-left')).not.toBeInTheDocument();
  });

  it('should not show pagination if there is no pages', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <DopplerIntlProvider locale="es">
          <Pagination currentPage={1} pagesCount={0} urlToGo={'https://domain.com/section?'} />
        </DopplerIntlProvider>
      </BrowserRouter>,
    );

    // Asserts
    expect(container.querySelector('.dp-pagination')).not.toBeInTheDocument();
  });

  it('should show pagination if there is at least one page', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <DopplerIntlProvider locale="es">
          <Pagination currentPage={1} pagesCount={1} urlToGo={'https://domain.com/section?'} />
        </DopplerIntlProvider>
      </BrowserRouter>,
    );

    // Asserts
    expect(container.querySelector('.dp-pagination')).toBeInTheDocument();
  });
});
