import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ControlPanel } from './ControlPanel';
import { controlPanelSections } from './controlPanelSections';

describe('Control Panel component', () => {
  it('should render sections and boxes', async () => {
    // Act
    render(<ControlPanel />);

    // Assert
    controlPanelSections.forEach((section) => {
      expect(screen.getByRole('heading', { name: section.title }));
      section.items.forEach((box) => {
        expect(screen.getByText(box.iconName)).toBeInTheDocument();
      });
    });
  });
});
