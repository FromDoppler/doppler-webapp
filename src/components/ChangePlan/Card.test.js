import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { MemoryRouter as Router } from 'react-router-dom';
import { Card, CardAction, CardPrice, Ribbon, CardFeatures } from './Card';

describe('Card component', () => {
  it('Should render Card component', () => {
    // Act
    const { container } = render(<Card />);

    // Assert
    expect(container.querySelector('.dp-highlighthed')).not.toBeInTheDocument();
    expect(container.querySelector('.dp-card')).toBeInTheDocument();
  });

  it('Should render Card component with class dp-highlighthed when highlighted is true', () => {
    // Arrange
    const highlighted = true;
    const className = 'test-class';

    // Act
    const { container } = render(<Card highlighted={highlighted} className={className} />);

    // Assert
    expect(container.querySelector('.dp-highlighthed')).toBeInTheDocument();
    expect(container.querySelector(`.${className}`)).toBeInTheDocument();
  });
});

describe('CardAction component', () => {
  const url = '/fake-url';

  it('Should render CardAction component', () => {
    // Act
    const { container } = render(
      <Router>
        <CardAction url={url} />
      </Router>,
    );

    // Assert
    expect(container.querySelector(`a[href='${url}']`)).toBeInTheDocument();
  });

  it('Should render CardAction component when it has children', () => {
    // Arrange
    const linkText = 'fake test';

    // Act
    const { getByText } = render(
      <Router>
        <CardAction url={url}>{linkText}</CardAction>
      </Router>,
    );

    // Assert
    expect(getByText(linkText)).toBeInTheDocument();
  });

  it('Should render CardAction component when it has target attribute', () => {
    // Arrange
    const target = '_blank';

    // Act
    const { container } = render(
      <Router>
        <CardAction url={url} target={target} />
      </Router>,
    );

    // Assert
    expect(container.querySelector(`a[target='${target}']`)).toBeInTheDocument();
  });
});

describe('CardPrice component', () => {
  it('Should render CardPrice component when doNotShowSince is true', () => {
    // Arrange
    const currency = 'US$';
    const price = '1,000';

    // Act
    const { container, getByText } = render(
      <IntlProvider>
        <CardPrice currency={currency} doNotShowSince={true}>
          {price}
        </CardPrice>
      </IntlProvider>,
    );

    // Assert
    expect(getByText('change_plan.per_month')).toBeInTheDocument();
    expect(container.querySelector('.dp-time-lapse-top')).not.toBeInTheDocument();
    expect(getByText(currency)).toBeInTheDocument();
    expect(getByText(price)).toBeInTheDocument();
  });

  it('Should render CardPrice component when doNotShowSince is false', () => {
    // Arrange
    const currency = 'US$';
    const price = '1.000';

    // Act
    const { container, getByText } = render(
      <IntlProvider>
        <CardPrice currency={currency} doNotShowSince={false}>
          {price}
        </CardPrice>
      </IntlProvider>,
    );

    // Assert
    expect(getByText('change_plan.per_month')).toBeInTheDocument();
    expect(container.querySelector('.dp-time-lapse-top')).toBeInTheDocument();
    expect(getByText(currency)).toBeInTheDocument();
    expect(getByText(price)).toBeInTheDocument();
  });
});

describe('Ribbon component', () => {
  it('Should render Ribbon component', () => {
    // Act
    const { container } = render(<Ribbon />);

    // Assert
    expect(container.querySelector('span')).toBeEmptyDOMElement();
    expect(container.querySelector('.dp-ribbon-top-right')).toBeInTheDocument();
  });

  it('Should render Ribbon component when it has content', () => {
    // Arrange
    const content = 'test-content';
    const position = 'top-left';

    // Act
    const { container, getByText } = render(<Ribbon content={content} position={position} />);

    // Assert
    expect(getByText(content)).toBeInTheDocument();
    expect(container.querySelector(`.dp-ribbon-${position}`)).toBeInTheDocument();
  });
});

describe('CardFeatures component', () => {
  it('Should render CardFeatures component', () => {
    // Arrange
    const text = 'All in free and';

    // Act
    const { getByText } = render(
      <CardFeatures>
        <h4>{text}</h4>
      </CardFeatures>,
    );

    // Assert
    expect(getByText(text)).toBeInTheDocument();
  });
});
