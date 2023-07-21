import {
  render,
  screen,
  getByRole,
  getAllByRole,
  getByText,
  queryByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { BreadcrumbNew, BreadcrumbNewItem } from '.';

describe('BreadcrumbNew Component', () => {
  it('should show BreadcrumbNew', () => {
    // Act
    render(
      <BrowserRouter>
        <BreadcrumbNew>
          <BreadcrumbNewItem href={'/control-panel'} text="Control panel" active={true} />
          <BreadcrumbNewItem text="Contact policy" />
        </BreadcrumbNew>
      </BrowserRouter>,
    );

    // Assert
    const nav = screen.getByRole('navigation');
    const listItems = getAllByRole(nav, 'listitem');
    expect(listItems.length).toBe(2);

    const firstItem = getByRole(listItems[0], 'link', { name: 'Control panel' });
    expect(firstItem).toHaveAttribute('class', 'dp-bc--active');

    const lastItem = queryByRole(listItems[1], 'link', { name: 'Contact policy' });
    expect(lastItem).not.toBeInTheDocument(); // because it hasn't a link
    getByText(listItems[1], 'Contact policy');
  });
});
