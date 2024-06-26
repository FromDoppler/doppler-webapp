import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';
import { useConversationPlans } from '.';

describe('useConversationPlans', () => {
  it('should complete conversation-plans with success', async () => {
    // Arrange
    const conversationPlansData = [
      {
        planId: 1,
        conversationsQty: 500,
        agents: 1,
        channels: 4,
      },
      {
        planId: 2,
        conversationsQty: 1000,
        agents: 2,
        channels: 3,
      },
    ];
    const dopplerAccountPlansApiClientFake = {
      getCoversationsPLans: jest
        .fn()
        .mockResolvedValue({ success: true, value: conversationPlansData }),
    };

    // Act
    const { result, waitForNextUpdate } = renderHook(() =>
      useConversationPlans(dopplerAccountPlansApiClientFake),
    );

    // Assert
    expect(result.current[0].loading).toBe(true);

    await waitForNextUpdate();
    expect(result.current[0].loading).toBe(false);
    expect(result.current[0].hasError).toBe(false);
    expect(result.current[0].conversationPlans).toEqual(conversationPlansData);
  });
});
