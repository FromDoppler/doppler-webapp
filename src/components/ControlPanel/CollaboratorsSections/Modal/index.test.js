import React from 'react';
import { render, cleanup, getByText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { Modal } from '.';

describe('Modal Component', () => {
  afterEach(cleanup);

  it('should show Breadcrumb', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <Modal />
      </BrowserRouter>,
    );

    // Asserts
    expect(container.querySelector('#modal-new-collaborator')).toBeInTheDocument();
  });

  it('should render Modal title and description', () => {
    //Act
    const { container } = render(
      <BrowserRouter>
        <Modal title="Modal title" subtitle="Modal subtitle" />
      </BrowserRouter>,
    );

    // Asserts
    const modal = container.querySelector('#modal-new-collaborator');
    expect(getByText(modal, 'Modal title')).toBeInTheDocument();
    expect(getByText(modal, 'Modal subtitle')).toBeInTheDocument();
  });
});
