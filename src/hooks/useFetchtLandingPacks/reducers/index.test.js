import { INITIAL_STATE_LANDING_PACKS, LANDING_PACKS_ACTIONS, landingPacksReducer } from './index';

describe('landingPacksReducer', () => {
  it(`${LANDING_PACKS_ACTIONS.FETCHING_STARTED} action`, () => {
    // Arrange
    const action = { type: LANDING_PACKS_ACTIONS.FETCHING_STARTED };

    // Act
    const newState = landingPacksReducer(INITIAL_STATE_LANDING_PACKS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_LANDING_PACKS,
      loading: true,
    });
  });

  it(`${LANDING_PACKS_ACTIONS.FINISH_FETCH} action`, () => {
    // Arrange
    const payload = {
      landingPacks: [
        {
          planId: 1,
          description: 'PACK 5',
          landingsQty: 5,
          price: 10,
          unitPrice: 2,
        },
        {
          planId: 2,
          description: 'PACK 25',
          landingsQty: 25,
          price: 45,
          unitPrice: 1.8,
        },
        {
          planId: 3,
          description: 'PACK 50',
          landingsQty: 50,
          price: 80,
          unitPrice: 1.6,
        },
      ],
    };
    const action = {
      type: LANDING_PACKS_ACTIONS.FINISH_FETCH,
      payload,
    };

    // Act
    const newState = landingPacksReducer(INITIAL_STATE_LANDING_PACKS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_LANDING_PACKS,
      loading: false,
      error: null,
      landingPacks: action.payload.landingPacks,
      cheapestLandingPack: {
        planId: 1,
        description: 'PACK 5',
        landingsQty: 5,
        price: 10,
        unitPrice: 2,
      },
    });
  });

  it(`${LANDING_PACKS_ACTIONS.FETCH_FAILED} action`, () => {
    // Arrange
    const action = {
      type: LANDING_PACKS_ACTIONS.FETCH_FAILED,
      payload: 'landing_packs_error_message',
    };

    // Act
    const newState = landingPacksReducer(INITIAL_STATE_LANDING_PACKS, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_LANDING_PACKS,
      loading: false,
      error: action.payload,
    });
  });

  it('should return initialState when the action is not defined', () => {
    // Arrange
    const action = {
      type: 'my-undefined-action',
    };

    // Act
    const newState = landingPacksReducer(INITIAL_STATE_LANDING_PACKS, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_LANDING_PACKS);
  });
});
