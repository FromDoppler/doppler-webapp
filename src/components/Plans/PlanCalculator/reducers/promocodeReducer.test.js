import { INITIAL_STATE_PROMOCODE, promocodeReducer, PROMOCODE_ACTIONS } from './promocodeReducer';

describe('promocodeReducer', () => {
  it(`${PROMOCODE_ACTIONS.START_FETCH} action`, () => {
    // Arrange
    const action = { type: PROMOCODE_ACTIONS.START_FETCH };

    // Act
    const newState = promocodeReducer(INITIAL_STATE_PROMOCODE, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_PROMOCODE,
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
      hasError: false,
      promotion: {
        ...payload,
        isValid: true,
      },
    });
  });

  it(`${PROMOCODE_ACTIONS.FAIL_FETCH} action`, () => {
    // Arrange
    const action = { type: PROMOCODE_ACTIONS.FAIL_FETCH };

    // Act
    const newState = promocodeReducer(INITIAL_STATE_PROMOCODE, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_PROMOCODE,
      loading: false,
      hasError: true,
    });
  });

  it('should return initialState when the action is not defined', () => {
    // Arrange
    const action = {
      type: 'my-action',
    };

    // Act
    const newState = promocodeReducer(INITIAL_STATE_PROMOCODE, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_PROMOCODE);
  });
});
