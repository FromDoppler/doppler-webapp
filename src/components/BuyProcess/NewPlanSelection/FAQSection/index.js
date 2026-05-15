import { FAQ } from '../../../FAQ';
import { topics } from '../../../FAQ/constants';

export const FAQSection = () => (
  <div className="dp-new-plan-selection-faq" data-testid="dp-faq-section">
    <FAQ topics={topics} />
  </div>
);
