import { useEffect } from 'react';
import LinkedInTag from 'react-linkedin-insight';

export const useLinkedinInsightTag = () => {
  useEffect(() => {
    if (document.getElementsByTagName('script').length !== 0) {
      LinkedInTag.init(2366057, 'dc', false);
    }
  }, []);
};
