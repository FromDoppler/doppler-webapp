import {
  INITIAL_STATE_DELETE_LANDING_PAGES,
  DELETE_LANDING_PAGES_ACTIONS,
  deleteLandingPagesReducer,
} from './deleteLandingPagesReducer';

describe('deleteLandingPagesReducer', () => {
  it(`${DELETE_LANDING_PAGES_ACTIONS.FETCHING_STARTED} action`, () => {
    // Arrange
    const action = { type: DELETE_LANDING_PAGES_ACTIONS.FETCHING_STARTED };

    // Act
    const newState = deleteLandingPagesReducer(INITIAL_STATE_DELETE_LANDING_PAGES, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_DELETE_LANDING_PAGES,
      loading: true,
      initialized: false,
    });
  });

  it(`${DELETE_LANDING_PAGES_ACTIONS.FINISH_FETCH} action`, () => {
    // Arrange
    const action = {
      type: DELETE_LANDING_PAGES_ACTIONS.FINISH_FETCH,
    };

    // Act
    const newState = deleteLandingPagesReducer(INITIAL_STATE_DELETE_LANDING_PAGES, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_DELETE_LANDING_PAGES,
      loading: false,
      error: null,
      success: true,
      initialized: false,
      removed: true,
    });
  });

  it(`${DELETE_LANDING_PAGES_ACTIONS.FETCH_FAILED} action`, () => {
    // Arrange
    const action = {
      type: DELETE_LANDING_PAGES_ACTIONS.FETCH_FAILED,
      payload: 'delete_landing_pages_error_message',
    };

    // Act
    const newState = deleteLandingPagesReducer(INITIAL_STATE_DELETE_LANDING_PAGES, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_DELETE_LANDING_PAGES,
      loading: false,
      error: action.payload,
      success: false,
      initialized: false,
    });
  });

  it(`${DELETE_LANDING_PAGES_ACTIONS.INITIALIZE} action`, () => {
    // Arrange
    const action = {
      type: DELETE_LANDING_PAGES_ACTIONS.INITIALIZE,
    };

    // Act
    const newState = deleteLandingPagesReducer(
      { ...INITIAL_STATE_DELETE_LANDING_PAGES, initialized: false },
      action,
    );

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_DELETE_LANDING_PAGES,
      loading: false,
      error: null,
      success: false,
      initialized: true,
      removed: true,
    });
  });

  it('should return initialState when the action is not defined', () => {
    // Arrange
    const action = {
      type: 'my-undefined-action',
    };

    // Act
    const newState = deleteLandingPagesReducer(INITIAL_STATE_DELETE_LANDING_PAGES, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_DELETE_LANDING_PAGES);
  });
});
