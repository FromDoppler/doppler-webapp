import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Modal from '../../../Modal/Modal';

const FEATURE_ITEMS = [
  {
    iconClassName: 'dpicon iconapp-sitemap',
    titleId: 'buy_process.new_plan_selection.included_features.item_1_title',
    descriptionId: 'buy_process.new_plan_selection.included_features.item_1_description',
  },
  {
    iconClassName: 'dpicon icon-sparkle-ia',
    titleId: 'buy_process.new_plan_selection.included_features.item_2_title',
    descriptionId: 'buy_process.new_plan_selection.included_features.item_2_description',
  },
  {
    iconClassName: 'dpicon iconapp-persons',
    titleId: 'buy_process.new_plan_selection.included_features.item_3_title',
    descriptionId: 'buy_process.new_plan_selection.included_features.item_3_description',
  },
  {
    iconClassName: 'dpicon iconapp-personal-network',
    titleId: 'buy_process.new_plan_selection.included_features.item_4_title',
    descriptionId: 'buy_process.new_plan_selection.included_features.item_4_description',
  },
  {
    iconClassName: 'dpicon iconapp-growth-chart',
    titleId: 'buy_process.new_plan_selection.included_features.item_5_title',
    descriptionId: 'buy_process.new_plan_selection.included_features.item_5_description',
  },
  {
    iconClassName: 'dpicon iconapp-network-configuration',
    titleId: 'buy_process.new_plan_selection.included_features.item_6_title',
    descriptionId: 'buy_process.new_plan_selection.included_features.item_6_description',
  },
];

const MODAL_SECTIONS = [
  { key: 'automation', rows: 9 },
  { key: 'campaings', rows: 10 },
  { key: 'integrations', rows: 38 },
  { key: 'editor', rows: 6 },
  { key: 'forms', rows: 8 },
  { key: 'omni', rows: 3 },
  { key: 'report', rows: 7 },
  { key: 'segmentation', rows: 5 },
];

export const IncludedFeatures = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSectionKey, setActiveSectionKey] = useState(MODAL_SECTIONS[0].key);

  return (
    <section className="dp-new-plan-selection-included-features">
      <h3 className="dp-second-order-title dp-new-plan-selection-included-features-title">
        <FormattedMessage id="buy_process.new_plan_selection.included_features.title" />
      </h3>
      <p className="dp-new-plan-selection-included-features-subtitle">
        <FormattedMessage id="buy_process.new_plan_selection.included_features.subtitle" />
      </p>

      <div className="dp-new-plan-selection-included-features-grid">
        {FEATURE_ITEMS.map((item, index) => (
          <article key={item.titleId} className="dp-new-plan-selection-included-features-item">
            <span
              className={`dp-new-plan-selection-feature-icon-wrap dp-feature-icon-${index + 1}`}
            >
              <span className={item.iconClassName} />
            </span>
            <span className="dp-new-plan-selection-feature-separator" />
            <h4>
              <FormattedMessage id={item.titleId} />
            </h4>
            <p>
              <FormattedMessage id={item.descriptionId} />
            </p>
          </article>
        ))}
      </div>

      <div className="dp-new-plan-selection-see-more">
        <button type="button" onClick={() => setIsModalOpen(true)}>
          <FormattedMessage id="buy_process.new_plan_selection.included_features.see_more" />
          <span className="dpicon iconapp-arrow-right" />
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        type="large"
        className="dp-new-plan-selection-features-modal"
        handleClose={() => setIsModalOpen(false)}
        modalId="new-plan-selection-features-modal"
      >
        <h2 className="modal-title">
          <FormattedMessage id="buy_process.new_plan_selection.included_features.modal_title" />
        </h2>

        <ul className="dp-accordion dp-new-plan-selection-features-accordion">
          {MODAL_SECTIONS.map((section) => {
            const isActive = activeSectionKey === section.key;

            return (
              <li key={section.key}>
                <button
                  type="button"
                  className="dp-accordion-thumb dp-new-plan-selection-features-accordion-thumb"
                  onClick={() => setActiveSectionKey(section.key)}
                  aria-expanded={isActive}
                >
                  <FormattedMessage id={`plan_types.table.${section.key}.title`} />
                  <span className="dp-new-plan-selection-features-accordion-arrow">
                    <span className={isActive ? 'is-active' : ''} />
                  </span>
                </button>
                <div
                  className="dp-accordion-panel"
                  style={{ display: isActive ? 'block' : 'none' }}
                >
                  <div className="dp-table-plans">
                    <div className="dp-table-responsive">
                      <table className="dp-c-table dp-nested-table">
                        <tbody>
                          {Array.from({ length: section.rows }, (_, index) => index + 1).map(
                            (rowNumber) => (
                              <tr key={`${section.key}-${rowNumber}`}>
                                <td>
                                  <div className="dp-icon-lock">
                                    <span className="dp-ico--ok" />
                                    <span>
                                      <FormattedMessage
                                        id={`plan_types.table.${section.key}.name_${rowNumber}`}
                                      />
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span>
                                    <FormattedMessage
                                      id={`plan_types.table.${section.key}.description_${rowNumber}`}
                                    />
                                  </span>
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Modal>
    </section>
  );
};
