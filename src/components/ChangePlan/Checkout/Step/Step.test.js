import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Step } from './Step';
import { BrowserRouter } from 'react-router-dom';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { ContactInformation } from '../ContactInformation/ContactInformation';
import { act } from 'react-dom/test-utils';

describe('Step Component', () => {
  afterEach(cleanup);

  it('should show step header when the step is inactive', () => {
    //Act
    const { container } = render(
      <AppServicesProvider>
        <IntlProvider>
          <BrowserRouter>
            <Step active={false} />
          </BrowserRouter>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Asserts
    expect(container.querySelector('.step-header-container')).toBeInTheDocument();
  });

  it('should show step header and button when the step is inactive and complete', () => {
    //Act
    const { container } = render(
      <AppServicesProvider>
        <IntlProvider>
          <BrowserRouter>
            <Step active={false} complete={true} />
          </BrowserRouter>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Asserts
    expect(container.querySelector('.step-header-container')).toBeInTheDocument();
    expect(container.querySelector('.edit-button')).toBeInTheDocument();
  });

  it('should show step header without button when the step is inactive and incomplete', () => {
    //Act
    const { container } = render(
      <AppServicesProvider>
        <IntlProvider>
          <BrowserRouter>
            <Step active={false} complete={false} />
          </BrowserRouter>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Asserts
    expect(container.querySelector('.step-header-container')).toBeInTheDocument();
    expect(container.querySelector('.edit-button')).toBeNull();
  });

  it('should show contact informarion section when the step is active', async () => {
    //Act
    const mockedFunction = jest.fn();

    const contactInformation = {
      email: 'test@makingsense.com',
      completed: false,
    };

    const dependencies = {
      dopplerUserApiClient: {
        getContactInformationData: async () => {
          return { success: true, value: contactInformation };
        },
      },
    };

    let result;
    await act(async () => {
      result = render(
        <AppServicesProvider forcedServices={dependencies}>
          <IntlProvider>
            <BrowserRouter>
              <Step active={true}>
                <ContactInformation onComplete={mockedFunction} />
              </Step>
            </BrowserRouter>
          </IntlProvider>
        </AppServicesProvider>,
      );
    });

    const { container } = result;

    // Asserts
    expect(container.querySelector('.contact-information')).toBeInTheDocument();
  });
});
