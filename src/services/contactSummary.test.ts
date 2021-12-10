import { ContactSummaryService, mapContactSummary } from './contactSummary';
import { fakeContactsSummary, HardcodedReportClient } from './reports/index.double';

describe('ContactSummaryService', () => {
  it('should get contact kpis', async () => {
    // Arrange
    const reportClient = new HardcodedReportClient();
    const spyGetContactsSummary = jest.spyOn(reportClient, 'getContactsSummary');

    // Act
    const contactSummaryService = new ContactSummaryService({ reportClient });
    const response = await contactSummaryService.getContactsSummary();

    // Assert
    expect(spyGetContactsSummary).toHaveBeenCalled();
    expect(response.success).toBe(true);
    expect(response.value).toEqual(mapContactSummary(fakeContactsSummary));
  });
});
