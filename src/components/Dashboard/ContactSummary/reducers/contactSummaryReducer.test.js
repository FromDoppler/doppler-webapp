import { INITIAL_STATE_CONTACTS_SUMMARY } from '..';
import { mapContactSummary } from '../../../../services/contactSummary';
import { fakeContactsSummary } from '../../../../services/reports/index.double';
import { ACTIONS_CONTACTS_SUMMARY, contactSummaryReducer } from './contactSummaryReducer';

describe('contactSummaryReducer', () => {
  it(`${ACTIONS_CONTACTS_SUMMARY.START_FETCH} action`, () => {
    // Arrange
    const action = { type: ACTIONS_CONTACTS_SUMMARY.START_FETCH };

    // Act
    const newState = contactSummaryReducer(INITIAL_STATE_CONTACTS_SUMMARY, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_CONTACTS_SUMMARY,
      loading: !INITIAL_STATE_CONTACTS_SUMMARY.loading,
      hasError: false,
    });
  });

  it(`${ACTIONS_CONTACTS_SUMMARY.FINISH_FETCH} action`, () => {
    // Arrange
    const action = {
      type: ACTIONS_CONTACTS_SUMMARY.FINISH_FETCH,
      payload: mapContactSummary(fakeContactsSummary),
    };

    // Act
    const newState = contactSummaryReducer(INITIAL_STATE_CONTACTS_SUMMARY, action);

    // Assert
    expect(newState).toEqual({
      loading: false,
      hasError: false,
      kpis: mapContactSummary(fakeContactsSummary),
    });
  });

  it(`${ACTIONS_CONTACTS_SUMMARY.FAIL_FETCH} action`, () => {
    // Arrange
    const action = { type: ACTIONS_CONTACTS_SUMMARY.FAIL_FETCH };

    // Act
    const newState = contactSummaryReducer(INITIAL_STATE_CONTACTS_SUMMARY, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_CONTACTS_SUMMARY,
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
    const newState = contactSummaryReducer(INITIAL_STATE_CONTACTS_SUMMARY, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_CONTACTS_SUMMARY);
  });
});
