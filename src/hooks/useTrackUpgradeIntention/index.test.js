import { renderHook } from '@testing-library/react';
import { useTrackUpgradeIntention } from '.';

describe('useTrackUpgradeIntention', () => {
  it('calls sendTrackUpgradeIntention once when enabled', () => {
    // Arrange
    const dopplerLegacyClient = { sendTrackUpgradeIntention: jest.fn(async () => true) };

    // Act
    const { rerender } = renderHook(() => useTrackUpgradeIntention({ dopplerLegacyClient }));
    rerender();

    // Assert
    expect(dopplerLegacyClient.sendTrackUpgradeIntention).toHaveBeenCalledTimes(1);
  });

  it('does not call sendTrackUpgradeIntention when disabled', () => {
    // Arrange
    const dopplerLegacyClient = { sendTrackUpgradeIntention: jest.fn(async () => true) };

    // Act
    renderHook(() =>
      useTrackUpgradeIntention({ dopplerLegacyClient, enabled: false }),
    );

    // Assert
    expect(dopplerLegacyClient.sendTrackUpgradeIntention).not.toHaveBeenCalled();
  });

  it('fires once when going from disabled to enabled and stays fired afterwards', () => {
    // Arrange
    const dopplerLegacyClient = { sendTrackUpgradeIntention: jest.fn(async () => true) };

    // Act
    const { rerender } = renderHook(
      ({ enabled }) => useTrackUpgradeIntention({ dopplerLegacyClient, enabled }),
      { initialProps: { enabled: false } },
    );
    rerender({ enabled: true });
    rerender({ enabled: true });

    // Assert
    expect(dopplerLegacyClient.sendTrackUpgradeIntention).toHaveBeenCalledTimes(1);
  });
});
