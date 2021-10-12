import '@testing-library/jest-dom/extend-expect';
import { INITIAL_STATE_CHANGE_PLAN } from '..';
import { changePlanReducer, CHANGE_PLAN_ACTIONS } from './changePlanReducer';

// TODO: replace the type with a constant
const pathList = [
  {
    type: 'free',
    current: true,
  },
  {
    type: 'standard',
    current: false,
    minimumFee: 15,
  },
  {
    type: 'agencies',
    current: false,
  },
];

const currentPlan = {
  type: 'free',
  subscriberLimit: 500,
  featureSet: 'free',
};

describe('changePlanReducer', () => {
  it(`${CHANGE_PLAN_ACTIONS.SET_LOADING} action`, () => {
    // Arrange
    const action = { type: CHANGE_PLAN_ACTIONS.SET_LOADING };

    // Act
    const newState = changePlanReducer(INITIAL_STATE_CHANGE_PLAN, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_CHANGE_PLAN,
      loading: !INITIAL_STATE_CHANGE_PLAN.loading,
    });
  });

  it(`${CHANGE_PLAN_ACTIONS.RECEIVE_PLAN} action`, () => {
    // Arrange
    const action = {
      type: CHANGE_PLAN_ACTIONS.RECEIVE_PLAN,
      payload: {
        pathList,
        currentPlan,
      },
    };

    // Act
    const newState = changePlanReducer(INITIAL_STATE_CHANGE_PLAN, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_CHANGE_PLAN,
      loading: false,
      pathList,
      currentPlan,
    });
  });

  it('it should return initialState when the action is not defined', () => {
    // Arrange
    const action = {
      type: 'my-action',
    };

    // Act
    const newState = changePlanReducer(INITIAL_STATE_CHANGE_PLAN, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_CHANGE_PLAN);
  });
});
