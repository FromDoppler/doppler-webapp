import { INITIAL_STATE_SURVEY, surveyReducer } from './surveyReducer';
import { SURVEY_ACTIONS } from './surveyReducer';

describe('surveyReducer', () => {
  it(`${SURVEY_ACTIONS.START_FETCH} action`, () => {
    // Arrange
    const action = { type: SURVEY_ACTIONS.START_FETCH };

    // Act
    const newState = surveyReducer(INITIAL_STATE_SURVEY, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_SURVEY,
      loading: true,
    });
  });

  it(`${SURVEY_ACTIONS.FINISH_FETCH} action`, () => {
    // Arrange
    const payload = {
      surveyFormCompleted: true,
    };
    const action = {
      type: SURVEY_ACTIONS.FINISH_FETCH,
      payload,
    };

    // Act
    const newState = surveyReducer(INITIAL_STATE_SURVEY, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_SURVEY,
      loading: false,
      hasError: false,
      surveyFormCompleted: true,
    });
  });

  it(`${SURVEY_ACTIONS.FAIL_FETCH} action`, () => {
    // Arrange
    const action = { type: SURVEY_ACTIONS.FAIL_FETCH };

    // Act
    const newState = surveyReducer(INITIAL_STATE_SURVEY, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_SURVEY,
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
    const newState = surveyReducer(INITIAL_STATE_SURVEY, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_SURVEY);
  });
});
