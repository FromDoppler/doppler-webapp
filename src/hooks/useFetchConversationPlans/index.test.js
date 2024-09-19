import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';
import { useConversationPlans } from '.';
import { PLAN_TYPE } from '../../doppler-types';

describe('useConversationPlans', () => {
  it('should complete conversation-plans with success', async () => {
    // Arrange
    const appSessionRef = {
      current: {
        userData: {
          user: {
            plan: {
              idPlan: 3,
              planType: PLAN_TYPE.free,
            },
            chat: {
              plan: {
                idPlan: 3,
                conversationQty: 500,
              },
            },
          },
        },
      },
    };

    const conversationPlansData = [
      {
        planId: 1,
        conversationsQty: 500,
        agents: 1,
        channels: 4,
        active: true,
      },
      {
        planId: 2,
        conversationsQty: 1000,
        agents: 2,
        channels: 3,
        active: true,
      },
    ];

    const customConversationPlansData = [
      {
        planId: 1,
        conversationsQty: 500,
        agents: 1,
        channels: 4,
        active: true,
      },
    ];

    const dopplerAccountPlansApiClientFake = {
      getCoversationsPLans: jest
        .fn()
        .mockResolvedValue({ success: true, value: conversationPlansData }),
      getCustomCoversationsPlans: jest
        .fn()
        .mockResolvedValue({ success: true, value: customConversationPlansData }),
    };

    // Act
    const { result, waitForNextUpdate } = renderHook(() =>
      useConversationPlans(dopplerAccountPlansApiClientFake, appSessionRef),
    );

    // Assert
    expect(result.current[0].loading).toBe(true);

    await waitForNextUpdate();
    expect(result.current[0].loading).toBe(false);
    expect(result.current[0].hasError).toBe(false);
    expect(result.current[0].conversationPlans).toEqual([
      { conversationsQty: 0 },
      ...conversationPlansData,
    ]);
  });
});
