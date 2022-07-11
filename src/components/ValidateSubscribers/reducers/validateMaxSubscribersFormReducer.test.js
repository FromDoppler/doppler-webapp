import {
  INITIAL_STATE,
  validateMaxSubscribersFormReducer,
  VALIDATE_MAX_SUBSCRIBERS_FORM_ACTIONS,
} from './validateMaxSubscribersFormReducer';
import { maxSubscribersData } from '../../../services/doppler-legacy-client.doubles';

describe('validateMaxSubscribersFormReducer', () => {
  it(`${VALIDATE_MAX_SUBSCRIBERS_FORM_ACTIONS.START_FETCH} action`, () => {
    // Arrange
    const action = { type: VALIDATE_MAX_SUBSCRIBERS_FORM_ACTIONS.START_FETCH };

    // Act
    const newState = validateMaxSubscribersFormReducer(INITIAL_STATE, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE,
      loading: true,
    });
  });

  it(`${VALIDATE_MAX_SUBSCRIBERS_FORM_ACTIONS.FINISH_FETCH} action`, () => {
    // Arrange
    const action = {
      type: VALIDATE_MAX_SUBSCRIBERS_FORM_ACTIONS.FINISH_FETCH,
      payload: maxSubscribersData,
    };

    // Act
    const newState = validateMaxSubscribersFormReducer(INITIAL_STATE, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE,
      validationFormData: maxSubscribersData,
      loading: false,
    });
  });

  it(`${VALIDATE_MAX_SUBSCRIBERS_FORM_ACTIONS.FAIL_FETCH} action`, () => {
    // Arrange
    const action = {
      type: VALIDATE_MAX_SUBSCRIBERS_FORM_ACTIONS.FAIL_FETCH,
    };

    // Act
    const newState = validateMaxSubscribersFormReducer(INITIAL_STATE, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE,
      hasError: true,
    });
  });

  it('Default action', () => {
    // Arrange
    const action = {};

    // Act
    const newState = validateMaxSubscribersFormReducer(INITIAL_STATE, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE,
    });
  });
});
