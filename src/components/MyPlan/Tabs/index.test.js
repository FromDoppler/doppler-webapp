import { BrowserRouter } from 'react-router-dom';
import { MyPlan, Tabs } from '.';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Tabs component', () => {
  it('should render component', () => {
    // Assert
    const tabs = [
      {
        active: true,
        label: 'test',
        key: 'key',
      },
    ];

    // Act
    render(
      <BrowserRouter>
        <DopplerIntlProvider>
          <Tabs tabsProperties={tabs} />
        </DopplerIntlProvider>
      </BrowserRouter>,
    );

    // Assert
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
