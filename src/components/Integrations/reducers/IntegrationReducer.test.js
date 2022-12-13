import {
  INITIAL_STATE,
  INTEGRATION_SECTION_ACTIONS,
  IntegrationReducer,
} from './IntegrationReducer';

describe('IntegrationReducer', () => {
  it("should get integration's sections", () => {
    // Arrange
    const fakeIntegrationSection = [
      {
        title: 'title',
        boxes: [
          {
            linkUrl: 'link1',
            imgSrc: 'imagen1',
            imgAlt: 'imagen1',
            iconName: 'boxName1',
          },
          {
            linkUrl: 'link2',
            imgSrc: 'imagen2',
            imgAlt: 'imagen2',
            iconName: 'boxName2',
          },
          {
            linkUrl: 'link3',
            imgSrc: 'imagen3',
            imgAlt: 'imagen3',
            iconName: 'boxName3',
          },
        ],
      },
    ];
    const action = {
      type: INTEGRATION_SECTION_ACTIONS.GET_SECTIONS,
      payload: fakeIntegrationSection,
    };

    // Act
    const newState = IntegrationReducer(INITIAL_STATE, action);

    // Assert
    expect(newState).toEqual({
      loading: false,
      integrationSection: fakeIntegrationSection,
      loadingStatus: true,
    });
  });

  it('should add status to boxes with name', () => {
    // Arrange
    const fakeIntegrationsStatusResult = {
      Box1Status: 'connected',
      Box2Status: 'alert',
      Box3Status: 'disconnected',
    };

    const initialState = {
      integrationSection: [
        {
          title: 'title',
          showStatus: true,
          boxes: [
            {
              name: 'Box1',
              linkUrl: 'link1',
              imgSrc: 'imagen1',
              imgAlt: 'imagen1',
              iconName: 'boxName1',
            },
            {
              name: 'Box2',
              linkUrl: 'link2',
              imgSrc: 'imagen2',
              imgAlt: 'imagen2',
              iconName: 'boxName2',
            },
            {
              name: 'Box3',
              linkUrl: 'link3',
              imgSrc: 'imagen3',
              imgAlt: 'imagen3',
              iconName: 'boxName3',
            },
            {
              linkUrl: 'link4',
              imgSrc: 'imagen4',
              imgAlt: 'imagen4',
              iconName: 'boxName4',
            },
          ],
        },
      ],
    };

    const expectedState = {
      integrationSection: [
        {
          title: 'title',
          showStatus: true,
          boxes: [
            {
              name: 'Box1',
              linkUrl: 'link1',
              imgSrc: 'imagen1',
              imgAlt: 'imagen1',
              iconName: 'boxName1',
              status: 'connected',
            },
            {
              name: 'Box2',
              linkUrl: 'link2',
              imgSrc: 'imagen2',
              imgAlt: 'imagen2',
              iconName: 'boxName2',
              status: 'alert',
            },
            {
              name: 'Box3',
              linkUrl: 'link3',
              imgSrc: 'imagen3',
              imgAlt: 'imagen3',
              iconName: 'boxName3',
              status: 'disconnected',
            },
            {
              linkUrl: 'link4',
              imgSrc: 'imagen4',
              imgAlt: 'imagen4',
              iconName: 'boxName4',
            },
          ],
        },
      ],
    };

    const action = {
      type: INTEGRATION_SECTION_ACTIONS.GET_INTEGRATIONS_STATUS,
      payload: fakeIntegrationsStatusResult,
    };

    // Act
    const newState = IntegrationReducer(initialState, action);

    // Assert
    expect(newState).toEqual({
      ...expectedState,
      loading: false,
      loadingStatus: false,
    });
  });

  it('should return current state when the action is not defined', () => {
    // Arrange
    const action = {
      type: 'my-action',
    };

    // Act
    const newState = IntegrationReducer(INITIAL_STATE, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE);
  });

  it('should set loading true for START_FETCH action', () => {
    // Arrange
    const action = {
      type: INTEGRATION_SECTION_ACTIONS.START_FETCH,
    };

    // Act
    const newState = IntegrationReducer(INITIAL_STATE, action);

    // Assert
    expect(newState).toEqual({ loading: true });
  });

  it('should set loadingStatus false and keep integrationSection unchanged for GET_INTEGRATIONS_STATUS_FAILED action', () => {
    // Arrange
    const action = {
      type: INTEGRATION_SECTION_ACTIONS.GET_INTEGRATIONS_STATUS_FAILED,
    };

    const fakeState = {
      loading: false,
      integrationSection: [
        {
          title: 'title',
          showStatus: true,
          boxes: [
            {
              name: 'Box1',
              linkUrl: 'link1',
              imgSrc: 'imagen1',
              imgAlt: 'imagen1',
              iconName: 'boxName1',
            },
          ],
        },
      ],
    };

    // Act
    const newState = IntegrationReducer(fakeState, action);

    // Assert
    expect(newState).toEqual({
      ...fakeState,
      loadingStatus: false,
    });
  });
});
