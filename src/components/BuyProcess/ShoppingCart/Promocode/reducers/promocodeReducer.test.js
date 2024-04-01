import { INITIAL_STATE_PROMOCODE, PROMOCODE_ACTIONS, promocodeReducer } from './promocodeReducer';

describe('promocodeReducer', () => {
  it(`${PROMOCODE_ACTIONS.FETCHING_STARTED} action`, () => {
    // Arrange
    const action = { type: PROMOCODE_ACTIONS.FETCHING_STARTED };

    // Act
    const newState = promocodeReducer(INITIAL_STATE_PROMOCODE, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_PROMOCODE,
      initialized: false,
      loading: true,
    });
  });

  it(`${PROMOCODE_ACTIONS.FINISH_FETCH} action`, () => {
    // Arrange
    const payload = {
      idPromotion: 100062,
      extraCredits: 1500,
      discountPercentage: 10,
    };
    const action = {
      type: PROMOCODE_ACTIONS.FINISH_FETCH,
      payload,
    };

    // Act
    const newState = promocodeReducer(INITIAL_STATE_PROMOCODE, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_PROMOCODE,
      loading: false,
      error: null,
      promotion: {
        ...payload,
        isValid: true,
      },
      validated: true,
      promocodeApplied: false,
    });
  });

  it(`${PROMOCODE_ACTIONS.FETCH_FAILED} action`, () => {
    // Arrange
    const action = { type: PROMOCODE_ACTIONS.FETCH_FAILED, payload: 'promocode_error_message' };

    // Act
    const newState = promocodeReducer(INITIAL_STATE_PROMOCODE, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_PROMOCODE,
      loading: false,
      error: action.payload,
      validated: false,
      promocodeApplied: false,
      initialized: false,
    });
  });

  it(`${PROMOCODE_ACTIONS.PROMOCODE_APPLIED} action`, () => {
    // Arrange
    const initialState = { ...INITIAL_STATE_PROMOCODE, initialized: false };
    const action = { type: PROMOCODE_ACTIONS.PROMOCODE_APPLIED };

    // Act
    const newState = promocodeReducer(initialState, action);

    // Assert
    expect(newState).toEqual({
      ...initialState,
      promocodeApplied: true,
    });
  });

  it(`${PROMOCODE_ACTIONS.INITIALIZE_STATE} action`, () => {
    // Arrange
    const action = { type: PROMOCODE_ACTIONS.INITIALIZE_STATE };

    // Act
    const newState = promocodeReducer(
      {
        ...INITIAL_STATE_PROMOCODE,
        initialized: false,
      },
      action,
    );

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_PROMOCODE,
      initialized: true,
    });
  });

  it('should return initialState when the action is not defined', () => {
    // Arrange
    const action = {
      type: 'my-undefined-action',
    };

    // Act
    const newState = promocodeReducer(INITIAL_STATE_PROMOCODE, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_PROMOCODE);
  });
});
