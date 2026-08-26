import { useEffect, useRef } from 'react';

export const useTrackUpgradeIntention = ({ dopplerLegacyClient, enabled = true }) => {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!enabled || firedRef.current) {
      return;
    }
    firedRef.current = true;
    dopplerLegacyClient.sendTrackUpgradeIntention();
  }, [dopplerLegacyClient, enabled]);
};
