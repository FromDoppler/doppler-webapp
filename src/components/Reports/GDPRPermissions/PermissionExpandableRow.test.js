import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';
import PermissionExpandableRow from './PermissionExpandableRow';

describe('PermissionExpandableRow component', () => {
  const subscriber = {
    email: 'test@test.com',
    fields: [
      {
        name: 'FIRSTNAME',
        value: 'Manuel',
        predefined: true,
        private: true,
        readonly: true,
        type: 'boolean',
      },
    ],
    unsubscribedDate: '2019-11-27T18:05:40.847Z',
    unsubscriptionType: 'hardBounce',
    manualUnsubscriptionReason: 'administrative',
    unsubscriptionComment: 'test',
    status: 'active',
    score: 0,
  };

  const field = {
    name: 'Permiso2',
    value: 'true',
    predefined: false,
    private: false,
    readonly: false,
    type: 'permission',
    permissionHTML:
      '<p>Acepta las promociones indicadas <a href="http://www.google.com">aqui</a></p>',
  };

  const field_value_none = {
    name: 'Permiso2',
    value: 'none',
    predefined: false,
    private: false,
    readonly: false,
    type: 'permission',
    permissionHTML:
      '<p>Acepta las promociones indicadas <a href="http://www.google.com">aqui</a></p>',
  };

  const dopplerApiClientDouble = {
    getSubscriberPermissionHistory: async () => {
      return { success: true, value: { items: [] } };
    },
  };

  const dopplerApiClientDoubleWithErrorInResponse = {
    getSubscriberPermissionHistory: async () => {
      return { success: false, error: new Error('Dummy error') };
    },
  };

  const dependencies = {
    dopplerApiClient: dopplerApiClientDouble,
  };

  const dependenciesWithErrorInResponse = {
    dopplerApiClient: dopplerApiClientDoubleWithErrorInResponse,
  };

  afterEach(cleanup);

  it('renders PermissionExpandableRow without error', async () => {
    // Arrange
    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <table>
            <tbody>
              <PermissionExpandableRow field={field} />
            </tbody>
          </table>
        </IntlProvider>
      </AppServicesProvider>,
    );
  });

  it('should show the arrow button if the value of the field is not none', () => {
    // Arrange
    // Act
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <table>
            <tbody>
              <PermissionExpandableRow field={field} />
            </tbody>
          </table>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(container.querySelector('.dp-expand-results')).toBeInTheDocument();
  });

  it('should show the arrow button if the value of the field is none', () => {
    // Arrange
    // Act
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <table>
            <tbody>
              <PermissionExpandableRow field={field_value_none} />
            </tbody>
          </table>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(container.querySelector('.dp-expand-results')).toBeInTheDocument();
  });

  it("shouldn't have the class 'show' if the arrow button is not clicked at least once", () => {
    // Arrange
    // Act
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <table>
            <tbody>
              <PermissionExpandableRow field={field} />
            </tbody>
          </table>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(container.querySelector('.dp-expanded-table').classList.contains('show')).toBe(false);
  });

  it("should have the class 'show' when the arrow button is clicked", () => {
    // Arrange
    // Act
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <table>
            <tbody>
              <PermissionExpandableRow field={field} />
            </tbody>
          </table>
        </IntlProvider>
      </AppServicesProvider>,
    );

    const arrowButton = container.querySelector('.dp-expand-results');
    arrowButton.click();

    // Assert
    expect(container.querySelector('.dp-expanded-table').classList.contains('show')).toBe(true);
  });

  it('error message should be displayed when response error is received', async () => {
    // Arrange
    // Act
    const { container } = render(
      <AppServicesProvider forcedServices={dependenciesWithErrorInResponse}>
        <IntlProvider>
          <table>
            <tbody>
              <PermissionExpandableRow field={field} />
            </tbody>
          </table>
        </IntlProvider>
      </AppServicesProvider>,
    );

    const arrowButton = container.querySelector('.dp-expand-results');
    arrowButton.click();

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.dp-unexpected-error-table')).toBeInTheDocument();
    });
  });
});
