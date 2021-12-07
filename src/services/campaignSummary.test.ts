import { CampaignSummaryService, mapCampaignsSummary } from './campaignSummary';
import { fakeCampaignsSummary, HardcodedReportClient } from './reports/index.double';

describe('CampaignSummaryService', () => {
  it('should get campaign kpis', async () => {
    // Arrange
    const reportClient = new HardcodedReportClient();
    const spyGetCampaignsSummary = jest.spyOn(reportClient, 'getCampaignsSummary');

    // Act
    const campaignSummaryService = new CampaignSummaryService({ reportClient });
    const response = await campaignSummaryService.getCampaignsSummary();

    // Assert
    expect(spyGetCampaignsSummary).toHaveBeenCalled();
    expect(response.success).toBe(true);
    expect(response.value).toEqual(mapCampaignsSummary(fakeCampaignsSummary));
  });
});
