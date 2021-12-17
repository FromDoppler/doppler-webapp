import { calculateOpenRate, CampaignSummaryService, mapCampaignsSummary } from './campaignSummary';
import { CampaignSummary } from './reports';
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

describe('calculateOpenRate', () => {
  it('should return 0 when totalSentEmails is 0', async () => {
    // Arrange
    const campaignsSummary: CampaignSummary = {
      totalSentEmails: 0,
      totalOpenClicks: 0,
      clickThroughRate: 0,
    };

    // Act
    const openRate: number = calculateOpenRate(
      campaignsSummary.totalOpenClicks,
      campaignsSummary.totalSentEmails,
    );

    // Assert
    expect(openRate).toBe(0);
  });

  it('should return a value grather to 0 when totalSentEmails and totalOpenClicks are grather to 0', async () => {
    // Arrange
    const campaignsSummary: CampaignSummary = {
      totalSentEmails: 10,
      totalOpenClicks: 5,
      clickThroughRate: 0,
    };

    // Act
    const openRate: number = calculateOpenRate(
      campaignsSummary.totalOpenClicks,
      campaignsSummary.totalSentEmails,
    );

    // Assert
    expect(openRate).toBe(50);
  });
});
