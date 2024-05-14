import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { TableRow } from '.';

describe('PlanTypes', () => {
  describe('TableRow', () => {
    it('should render TableRow', async () => {
      // Arrange
      const row = {
        name: 'integrations',
        description: 'lorem ipsum dolor si amet',
      };

      // Act
      render(
        <table>
          <tbody>
            <TableRow row={row} />
          </tbody>
        </table>,
      );
    });
  });
});
