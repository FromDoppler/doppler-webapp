import React from 'react';
import { render, cleanup, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';
import PermissionExpandableRow from './PermissionExpandableRow';

describe('PermissionExpandableRow component', () => {
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

  it("should have the class 'show' when the arrow button is clicked", async () => {
    // Arrange
    // Act
    const { container, getByText } = render(
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

    act(() => {
      const arrowButton = container.querySelector('.dp-expand-results');
      fireEvent.click(arrowButton);
    });

    await waitFor(() => {
      expect(container.querySelector('.dp-expanded-table.show')).toBeInTheDocument();
      expect(getByText('subscriber_gdpr.value_none')).toBeInTheDocument();
    });
  });

  it('error message should be displayed when response error is received', async () => {
    // Arrange
    // Act
    const { container, getByText } = render(
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

    act(() => {
      const arrowButton = container.querySelector('.dp-expand-results');
      fireEvent.click(arrowButton);
    });

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.dp-unexpected-error-table')).toBeInTheDocument();
      expect(getByText('validation_messages.error_unexpected_MD')).toBeInTheDocument();
    });
  });
});
