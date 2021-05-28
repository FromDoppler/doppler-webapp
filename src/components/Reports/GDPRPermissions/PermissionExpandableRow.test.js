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

  const dopplerApiClientDoubleWithOriginType = {
    getSubscriberPermissionHistory: async () => {
      return {
        success: true,
        value: {
          items: [
            {
              subscriberEmail: 'test@fromdoppler.com',
              fieldName: 'Permiso2',
              fieldType: 'permission',
              date: new Date('2021-02-10T15:22:00.000Z'),
              value: 'true',
              originIP: '181.167.226.47',
              originType: 'Manual',
            },
          ],
        },
      };
    },
  };

  const dopplerApiClientDoubleWithoutOriginType = {
    getSubscriberPermissionHistory: async () => {
      return {
        success: true,
        value: {
          items: [
            {
              subscriberEmail: 'test@fromdoppler.com',
              fieldName: 'Permiso2',
              fieldType: 'permission',
              date: new Date('2021-02-10T15:22:00.000Z'),
              value: 'true',
              originIP: '181.167.226.47',
            },
          ],
        },
      };
    },
  };

  const dependencies = {
    dopplerApiClient: dopplerApiClientDouble,
  };

  const dependenciesWithErrorInResponse = {
    dopplerApiClient: dopplerApiClientDoubleWithErrorInResponse,
  };

  const dependenciesWithOriginType = {
    dopplerApiClient: dopplerApiClientDoubleWithOriginType,
  };

  const dependenciesWithoutOriginType = {
    dopplerApiClient: dopplerApiClientDoubleWithoutOriginType,
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

  it('should show origin column when origin type is received', async () => {
    // Arrange
    // Act
    const { container, getByText } = render(
      <AppServicesProvider forcedServices={dependenciesWithOriginType}>
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
      expect(container.querySelector('.dp-table-results')).toBeInTheDocument();
      expect(getByText('subscriber_gdpr.modification_source')).toBeInTheDocument();
      const tableNode = container.querySelector('.dp-table-results');
      expect(tableNode.tHead.rows[0].cells.length).toBe(4);
      expect(tableNode.tBodies[0].rows[0].cells.length).toBe(4);
    });
  });

  it("shouldn't show origin column when origin type is not received", async () => {
    // Arrange
    // Act
    const { container, queryByText } = render(
      <AppServicesProvider forcedServices={dependenciesWithoutOriginType}>
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
      expect(container.querySelector('.dp-table-results')).toBeInTheDocument();
      expect(queryByText('subscriber_gdpr.modification_source')).toBe(null);
      const tableNode = container.querySelector('.dp-table-results');
      expect(tableNode.tHead.rows[0].cells.length).toBe(3);
      expect(tableNode.tBodies[0].rows[0].cells.length).toBe(3);
    });
  });
});
