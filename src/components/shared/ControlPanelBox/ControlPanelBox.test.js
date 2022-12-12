import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ControlPanelBox } from './ControlPanelBox';
import ControlPanelIconImg from '../../ControlPanel/images/account_information_icon.png';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

const box = {
  linkUrl: 'control_panel.external_integrations.dynamics_link_url',
  imgSrc: ControlPanelIconImg,
  imgAlt: 'control_panel.account_preferences.account_information_title',
  iconName: 'control_panel.account_preferences.account_information_title',
};

it('should render a control panel box', async () => {
  //Act
  render(
    <IntlProvider>
      <ControlPanelBox box={box} />
    </IntlProvider>,
  );

  //Assert
  expect(screen.getByRole('img')).toBeInTheDocument();
  expect(screen.getByRole('link')).toBeInTheDocument();
  expect(screen.getByText(box.iconName)).toBeInTheDocument();
});

it('should render disabled control panel box', async () => {
  //Arrenge
  const modifiedBox = {
    ...box,
    disabled: true,
  };

  //Act
  render(
    <IntlProvider>
      <ControlPanelBox box={modifiedBox} />
    </IntlProvider>,
  );

  //Assert
  expect(screen.getByText(box.iconName).parentElement).toHaveAttribute('disabled');
});

it('should not render control panel box when hidden property is true', async () => {
  //Arrenge
  const modifiedBox = {
    ...box,
    hidden: true,
  };

  //Act
  render(
    <IntlProvider>
      <ControlPanelBox box={modifiedBox} />
    </IntlProvider>,
  );

  //Assert
  expect(screen.queryByText(box.iconName)).not.toBeInTheDocument();
});

it('should render status image when status property is truthy', async () => {
  //Arrenge
  const modifiedBox = {
    ...box,
    status: 'connected',
  };
  //Act
  render(
    <IntlProvider>
      <ControlPanelBox box={modifiedBox} />
    </IntlProvider>,
  );

  //Assert
  expect(screen.getByRole('img', { name: 'status image' })).toBeInTheDocument();
});

it('should render promotional ribbon when ribbonColor and ribbonText are truthy', async () => {
  //Arrenge
  const modifiedBox = {
    ...box,
    ribbonColor: 'orange',
    ribbonText: 'promotional_ribbons.coming_soon',
  };
  //Act
  render(
    <IntlProvider>
      <ControlPanelBox box={modifiedBox} />
    </IntlProvider>,
  );

  //Assert
  expect(screen.getByText(modifiedBox.ribbonText)).toBeInTheDocument();
});

it('should not render promotional ribbon when ribbonColor is null', async () => {
  //Arrenge
  const modifiedBox = {
    ...box,
    ribbonText: 'promotional_ribbons.coming_soon',
  };
  //Act
  render(
    <IntlProvider>
      <ControlPanelBox box={modifiedBox} />
    </IntlProvider>,
  );

  //Assert
  expect(screen.queryByText(modifiedBox.ribbonText)).not.toBeInTheDocument();
});
