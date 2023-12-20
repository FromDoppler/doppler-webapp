import { useEffect, useState } from 'react';
import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js';

export const useFingerPrinting = () => {
  const [fingerPrintingId, setFingerPrintingId] = useState(null);

  useEffect(() => {
    const createFingerPrinting = async () => {
      const browserId = await getCurrentBrowserFingerPrint();
      setFingerPrintingId(browserId);
    };

    createFingerPrinting();
  }, []);

  return fingerPrintingId;
};
