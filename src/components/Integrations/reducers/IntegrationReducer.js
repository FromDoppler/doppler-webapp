import { objectKeystoLowerCase } from '../../../utils';

export const INITIAL_STATE = {
  integrationSection: [],
  loadingPage: false,
  loadingNativeIntegrations: false,
};

const addConnectionStatusToBoxes = (integrationsStatus, integrationSection) => {
  return integrationSection.map((section) =>
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

export const INTEGRATION_SECTION_ACTIONS = {
  START_FETCH: 'START_FETCH',
  GET_SECTIONS: 'GET_SECTIONS',
  GET_INTEGRATIONS_STATUS: 'GET_INTEGRATIONS_STATUS',
  GET_INTEGRATIONS_STATUS_FAILED: 'GET_INTEGRATIONS_STATUS_FAILED',
};

export const IntegrationReducer = (state, action) => {
  switch (action.type) {
    case INTEGRATION_SECTION_ACTIONS.START_FETCH:
      return {
        loadingPage: true,
      };

    case INTEGRATION_SECTION_ACTIONS.GET_SECTIONS:
      const { payload: integrationSection } = action;
      return {
        loadingPage: false,
        integrationSection,
        loadingNativeIntegrations: true,
      };

    case INTEGRATION_SECTION_ACTIONS.GET_INTEGRATIONS_STATUS:
      const { payload: integrationsStatusResult } = action;
      const lowercaseObj = objectKeystoLowerCase(integrationsStatusResult);
      return {
        integrationSection: addConnectionStatusToBoxes(lowercaseObj, state.integrationSection),
        loadingPage: false,
        loadingNativeIntegrations: false,
      };

    case INTEGRATION_SECTION_ACTIONS.GET_INTEGRATIONS_STATUS_FAILED:
      return {
        loadingPage: false,
        integrationSection: state.integrationSection,
        loadingNativeIntegrations: false,
      };

    default:
      return state;
  }
};
