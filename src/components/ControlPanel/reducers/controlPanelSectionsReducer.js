import { objectKeystoLowerCase } from '../../../utils';

export const INITIAL_STATE = {
  controlPanelSections: [],
  loading: false,
};

const addConnectionStatusToBoxes = (integrationsStatus, controlPanelSections) => {
  return controlPanelSections.map((section) =>
    section.showStatus
      ? {
          ...section,
          boxes: section.boxes.map((box) =>
            box.name
              ? {
                  ...box,
                  status: integrationsStatus[box.name.toLowerCase() + 'status'],
                }
              : {
                  ...box,
                },
          ),
        }
      : {
          ...section,
        },
  );
};

export const CONTROL_PANEL_SECTIONS_ACTIONS = {
  START_FETCH: 'START_FETCH',
  GET_SECTIONS: 'GET_SECTIONS',
  GET_INTEGRATIONS_STATUS: 'GET_INTEGRATIONS_STATUS',
};

export const controlPanelSectionsReducer = (state, action) => {
  switch (action.type) {
    case CONTROL_PANEL_SECTIONS_ACTIONS.START_FETCH:
      return {
        loading: true,
      };

    case CONTROL_PANEL_SECTIONS_ACTIONS.GET_SECTIONS:
      const { payload: controlPanelSections } = action;
      return {
        loading: false,
        controlPanelSections,
      };

    case CONTROL_PANEL_SECTIONS_ACTIONS.GET_INTEGRATIONS_STATUS:
      const { payload: integrationsStatusResult } = action;
      const lowercaseObj = objectKeystoLowerCase(integrationsStatusResult);
      return {
        controlPanelSections: addConnectionStatusToBoxes(lowercaseObj, state.controlPanelSections),
        loading: false,
      };

    default:
      return state;
  }
};
