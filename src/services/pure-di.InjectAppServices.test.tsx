import React, { Component } from 'react';
import { AppCompositionRoot, AppServicesProvider, InjectAppServices } from './pure-di';
import { render, cleanup } from 'react-testing-library';

describe('Component with injected services', () => {
  const TestComponentWithInjectedServices = InjectAppServices(
    class extends Component {
      constructor(props: any) {
        super(props);

        const {
          anotherProp,
          dependencies: { appConfiguration },
        } = props;

        this.state = {
          appConfiguration: appConfiguration,
          anotherProp: anotherProp,
        };
      }

      render() {
        const { appConfiguration, anotherProp } = this.state as any;
        return (
          <>
            <span>{anotherProp}</span>
            <span>{JSON.stringify(appConfiguration)}</span>
            <span>{!appConfiguration && 'appConfiguration is not present'}</span>
            <code>
              <pre>
                state: {JSON.stringify(this.state)}
                props: {JSON.stringify(this.props)}
              </pre>
            </code>
          </>
        );
      }
    },
  );

  beforeEach(cleanup);

  it('should use AppCompositionRoot services by default', () => {
    // Arrange
    const expectedAppConfiguration = new AppCompositionRoot().appConfiguration;
    const jsx = (
      <AppServicesProvider>
        <TestComponentWithInjectedServices anotherProp="anotherProp should be filled" />
      </AppServicesProvider>
    );

    // Act
    const { getByText } = render(jsx);

    // Assert
    getByText(JSON.stringify(expectedAppConfiguration));
    getByText('anotherProp should be filled');
  });

  it("should not use AppCompositionRoot services when component's dependencies property is defined", () => {
    // Arrange
    const jsx = (
      <AppServicesProvider>
        <TestComponentWithInjectedServices
          anotherProp="anotherProp should be filled"
          dependencies={{}}
        />
      </AppServicesProvider>
    );

    // Act
    const { getByText } = render(jsx);

    // Assert
    getByText('appConfiguration is not present');
    getByText('anotherProp should be filled');
  });

  it("should make honor component's dependencies property when is defined", () => {
    // Arrange
    const dependencies = {
      appConfiguration: 'it is a double' as any,
    };

    const jsx = (
      <AppServicesProvider>
        <TestComponentWithInjectedServices
          anotherProp="anotherProp should be filled"
          dependencies={dependencies}
        />
      </AppServicesProvider>
    );

    // Act
    const { getByText } = render(jsx);

    // Assert
    getByText('"it is a double"');
    getByText('anotherProp should be filled');
  });

  it('should make honor forced services defined in AppServicesProvider', () => {
    // Arrange
    const dependencies = {
      appConfiguration: 'it is a double' as any,
    };

    const jsx = (
      <AppServicesProvider forcedServices={dependencies}>
        <TestComponentWithInjectedServices anotherProp="anotherProp should be filled" />
      </AppServicesProvider>
    );

    // Act
    const { getByText } = render(jsx);

    // Assert
    getByText('"it is a double"');
    getByText('anotherProp should be filled');
  });

  it('should work without AppServicesProvider', () => {
    // Arrange
    const dependencies = {
      appConfiguration: 'it is a double' as any,
    };

    const jsx = (
      <TestComponentWithInjectedServices
        anotherProp="anotherProp should be filled"
        dependencies={dependencies}
      />
    );

    // Act
    const { getByText } = render(jsx);

    // Assert
    getByText('"it is a double"');
    getByText('anotherProp should be filled');
  });

  it("should work without AppServicesProvider and without component's dependencies property", () => {
    // Arrange
    const jsx = <TestComponentWithInjectedServices anotherProp="anotherProp should be filled" />;

    // Act
    const { getByText } = render(jsx);

    // Assert
    getByText('appConfiguration is not present');
    getByText('anotherProp should be filled');
  });
});
