import {
  INITIAL_STATE,
  CONTROL_PANEL_SECTIONS_ACTIONS,
  controlPanelSectionsReducer,
} from './controlPanelSectionsReducer';

describe('controlPanelSectionsReducer', () => {
  it("should fetch control panel's sections", () => {
    // Arrange
    const fakeControlPanelSections = [
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
      type: CONTROL_PANEL_SECTIONS_ACTIONS.FETCH_SECTIONS,
      payload: fakeControlPanelSections,
    };

    // Act
    const newState = controlPanelSectionsReducer(INITIAL_STATE, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE,
      loading: false,
      controlPanelSections: fakeControlPanelSections,
    });
  });

  it('should add status to boxes', () => {
    // Arrange
    const fakeIntegrationsStatusResult = {
      Box1Status: 'connected',
      Box2Status: 'alert',
      Box3Status: 'disconnected',
    };

    const initialState = {
      controlPanelSections: [
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
          ],
        },
      ],
    };

    const expectedState = {
      controlPanelSections: [
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
          ],
        },
      ],
    };

    const action = {
      type: CONTROL_PANEL_SECTIONS_ACTIONS.FETCH_INTEGRATIONS_STATUS,
      payload: fakeIntegrationsStatusResult,
    };

    // Act
    const newState = controlPanelSectionsReducer(initialState, action);

    // Assert
    expect(newState).toEqual({
      ...expectedState,
      loading: false,
    });
  });

  it('should return initialState when the action is not defined', () => {
    // Arrange
    const action = {
      type: 'my-action',
    };

    // Act
    const newState = controlPanelSectionsReducer(INITIAL_STATE, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE);
  });
});
