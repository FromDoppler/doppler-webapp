import { objectKeystoLowerCase } from '../../../utils';

export const INITIAL_STATE = {
  controlPanelSections: [],
  loading: true,
};

export const CONTROL_PANEL_SECTIONS_ACTIONS = {
  FETCH_SECTIONS: 'FETCH_SECTIONS',
  FETCH_INTEGRATIONS_STATUS: 'FETCH_INTEGRATIONS_STATUS',
};

const addConnectionStatus = (integrationsStatus, controlPanelSections) => {
  controlPanelSections.forEach((section) => {
    if (section.showStatus) {
      section.boxes.forEach((box) => {
        const boxName = box.name ? box.name.toLowerCase() : '';
        const lowercaseObj = objectKeystoLowerCase(integrationsStatus);
        box.status = lowercaseObj[boxName + 'status'];
      });
    }
  });
};

export const controlPanelSectionsReducer = (state, action) => {
  switch (action.type) {
    case CONTROL_PANEL_SECTIONS_ACTIONS.FETCH_SECTIONS:
      const { payload: controlPanelSections } = action;
      return {
        ...state,
        loading: false,
        controlPanelSections,
      };
    case CONTROL_PANEL_SECTIONS_ACTIONS.FETCH_INTEGRATIONS_STATUS:
      const { payload: integrationsStatusResult } = action;
      addConnectionStatus(integrationsStatusResult, state.controlPanelSections);
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
