import React from 'react';
import Signup from './Signup';
import { render, cleanup, waitForDomChange } from '@testing-library/react';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider';
import { MemoryRouter as Router } from 'react-router-dom';
import { AppServicesProvider } from '../../services/pure-di';
import 'jest-dom/extend-expect';

class MenubuttonFake {
  init() {}
}

describe('Signup', () => {
  beforeEach(cleanup);

  it('should not show errors on blur but after first submit', async () => {
    // Arrange
    const dependencies = {
      window: {
        Menubutton: MenubuttonFake,
      },
    };
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider>
          <Router>
            <Signup />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
    expect(container.querySelectorAll('.error')).toHaveLength(0);

    // Act
    container.querySelector('#lastname').focus();
    await waitForDomChange();

    // Assert
    expect(container.querySelectorAll('.error')).toHaveLength(0);

    // Act
    container.querySelector('button[type="submit"]').click();
    await waitForDomChange();

    // Assert
    expect(container.querySelectorAll('.error')).not.toHaveLength(0);
  });

  it('should show Argentina below Argelia when selected language is ES', () => {
    // Arrange
    const dependencies = {
      window: {
        Menubutton: MenubuttonFake,
      },
    };
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="es">
          <Router>
            <Signup />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(container.querySelector('#iti-item-dz').nextElementSibling.id).toBe('iti-item-ar');
  });

  it('should show Territorio Palestino, Ocupado below Territorio Britanico del Oceano Indico when selected language is ES', () => {
    // Arrange
    const dependencies = {
      window: {
        Menubutton: MenubuttonFake,
      },
    };
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="es">
          <Router>
            <Signup />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(container.querySelector('#iti-item-io').nextElementSibling.id).toBe('iti-item-ps');
  });

  it('should show American Samoa below Algeria when selected language is EN', () => {
    // Arrange
    const dependencies = {
      window: {
        Menubutton: MenubuttonFake,
      },
    };
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="en">
          <Router>
            <Signup />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(container.querySelector('#iti-item-dz').nextElementSibling.id).toBe('iti-item-as');
  });

  it('should show Brunel below British Indian Ocean when selected language is EN', () => {
    // Arrange
    const dependencies = {
      window: {
        Menubutton: MenubuttonFake,
      },
    };
    const { container } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="en">
          <Router>
            <Signup />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(container.querySelector('#iti-item-io').nextElementSibling.id).toBe('iti-item-bn');
  });
});
