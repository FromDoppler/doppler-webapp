import { useEffect, useState } from 'react';
import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js';
import { useFingerPrintingV2 } from './fingerprintV2';

export const useFingerPrinting = () => {
  const [fingerPrintingId, setFingerPrintingId] = useState(null);
  const fingerPrintingIdV2 = useFingerPrintingV2();

  useEffect(() => {
    const createFingerPrinting = async () => {
      const browserId = await getCurrentBrowserFingerPrint();
      setFingerPrintingId(browserId);
    };

    createFingerPrinting();
  }, []);

  return { fingerPrintingId, fingerPrintingIdV2 };
};
