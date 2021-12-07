import { fakeCampaignsSummary, INITIAL_STATE_CAMPAIGNS_SUMMARY } from '..';
import {
  ACTIONS_CAMPAIGNS_SUMMARY,
  campaignSummaryReducer,
  mapCampaignsSummary,
} from './campaignSummaryReducer';

describe('campaignSummaryReducer', () => {
  it(`${ACTIONS_CAMPAIGNS_SUMMARY.START_FETCH} action`, () => {
    // Arrange
    const action = { type: ACTIONS_CAMPAIGNS_SUMMARY.START_FETCH };

    // Act
    const newState = campaignSummaryReducer(INITIAL_STATE_CAMPAIGNS_SUMMARY, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_CAMPAIGNS_SUMMARY,
      loading: !INITIAL_STATE_CAMPAIGNS_SUMMARY.loading,
      hasError: false,
    });
  });

  it(`${ACTIONS_CAMPAIGNS_SUMMARY.FINISH_FETCH} action`, () => {
    // Arrange
    const action = {
      type: ACTIONS_CAMPAIGNS_SUMMARY.FINISH_FETCH,
      payload: mapCampaignsSummary(fakeCampaignsSummary),
    };

    // Act
    const newState = campaignSummaryReducer(INITIAL_STATE_CAMPAIGNS_SUMMARY, action);

    // Assert
    expect(newState).toEqual({
      loading: false,
      hasError: false,
      kpis: mapCampaignsSummary(fakeCampaignsSummary),
    });
  });

  it(`${ACTIONS_CAMPAIGNS_SUMMARY.FAIL_FETCH} action`, () => {
    // Arrange
    const action = { type: ACTIONS_CAMPAIGNS_SUMMARY.FAIL_FETCH };

    // Act
    const newState = campaignSummaryReducer(INITIAL_STATE_CAMPAIGNS_SUMMARY, action);

    // Assert
    expect(newState).toEqual({
      ...INITIAL_STATE_CAMPAIGNS_SUMMARY,
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
    const newState = campaignSummaryReducer(INITIAL_STATE_CAMPAIGNS_SUMMARY, action);

    // Assert
    expect(newState).toEqual(INITIAL_STATE_CAMPAIGNS_SUMMARY);
  });
});
