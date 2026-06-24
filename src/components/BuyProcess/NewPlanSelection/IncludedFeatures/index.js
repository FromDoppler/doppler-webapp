import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Modal from '../../../Modal/Modal';

const FEATURE_ITEMS = [
  {
    iconClassName: 'dpicon iconapp-check-email',
    titleId: 'buy_process.new_plan_selection.included_features.item_1_title',
    descriptionId: 'buy_process.new_plan_selection.included_features.item_1_description',
  },
  {
    iconClassName: 'dpicon iconapp-data-flow',
    titleId: 'buy_process.new_plan_selection.included_features.item_2_title',
    descriptionId: 'buy_process.new_plan_selection.included_features.item_2_description',
  },
  {
    iconClassName: 'dpicon iconapp-email-network',
    titleId: 'buy_process.new_plan_selection.included_features.item_3_title',
    descriptionId: 'buy_process.new_plan_selection.included_features.item_3_description',
  },
  {
    iconClassName: 'dpicon icon-sparkle-ia',
    titleId: 'buy_process.new_plan_selection.included_features.item_4_title',
    descriptionId: 'buy_process.new_plan_selection.included_features.item_4_description',
  },
  {
    iconClassName: 'dpicon iconapp-teamwork',
    titleId: 'buy_process.new_plan_selection.included_features.item_5_title',
    descriptionId: 'buy_process.new_plan_selection.included_features.item_5_description',
  },
  {
    iconClassName: 'dpicon iconapp-growth-chart',
    titleId: 'buy_process.new_plan_selection.included_features.item_6_title',
    descriptionId: 'buy_process.new_plan_selection.included_features.item_6_description',
  },
];

const MODAL_SECTIONS = [
  {
    key: 'email-marketing-ai',
    titleId:
      'buy_process.new_plan_selection.included_features.modal_sections.email_marketing_ai.title',
    rows: [
      {
        nameId:
          'buy_process.new_plan_selection.included_features.modal_sections.email_marketing_ai.name_1',
        descriptionId:
          'buy_process.new_plan_selection.included_features.modal_sections.email_marketing_ai.description_1',
      },
      {
        nameId:
          'buy_process.new_plan_selection.included_features.modal_sections.email_marketing_ai.name_2',
        descriptionId:
          'buy_process.new_plan_selection.included_features.modal_sections.email_marketing_ai.description_2',
      },
      {
        nameId:
          'buy_process.new_plan_selection.included_features.modal_sections.email_marketing_ai.name_3',
        descriptionId:
          'buy_process.new_plan_selection.included_features.modal_sections.email_marketing_ai.description_3',
      },
      {
        nameId:
          'buy_process.new_plan_selection.included_features.modal_sections.email_marketing_ai.name_4',
        descriptionId:
          'buy_process.new_plan_selection.included_features.modal_sections.email_marketing_ai.description_4',
      },
      {
        nameId:
          'buy_process.new_plan_selection.included_features.modal_sections.email_marketing_ai.name_5',
        descriptionId:
          'buy_process.new_plan_selection.included_features.modal_sections.email_marketing_ai.description_5',
      },
    ],
  },
  {
    key: 'automation-marketing',
    titleId:
      'buy_process.new_plan_selection.included_features.modal_sections.automation_marketing.title',
    rows: [
      {
        nameId:
          'buy_process.new_plan_selection.included_features.modal_sections.automation_marketing.name_1',
        descriptionId:
          'buy_process.new_plan_selection.included_features.modal_sections.automation_marketing.description_1',
      },
      {
        nameId:
          'buy_process.new_plan_selection.included_features.modal_sections.automation_marketing.name_2',
        descriptionId:
          'buy_process.new_plan_selection.included_features.modal_sections.automation_marketing.description_2',
      },
      {
        nameId:
          'buy_process.new_plan_selection.included_features.modal_sections.automation_marketing.name_3',
        descriptionId:
          'buy_process.new_plan_selection.included_features.modal_sections.automation_marketing.description_3',
      },
      {
        nameId:
          'buy_process.new_plan_selection.included_features.modal_sections.automation_marketing.name_4',
        descriptionId:
          'buy_process.new_plan_selection.included_features.modal_sections.automation_marketing.description_4',
      },
    ],
  },
  {
    key: 'segmentation-advanced',
    titleId:
      'buy_process.new_plan_selection.included_features.modal_sections.segmentation_advanced.title',
    rows: [
      {
        nameId:
          'buy_process.new_plan_selection.included_features.modal_sections.segmentation_advanced.name_1',
        descriptionId:
          'buy_process.new_plan_selection.included_features.modal_sections.segmentation_advanced.description_1',
      },
      {
        nameId:
          'buy_process.new_plan_selection.included_features.modal_sections.segmentation_advanced.name_2',
        descriptionId:
          'buy_process.new_plan_selection.included_features.modal_sections.segmentation_advanced.description_2',
      },
      {
        nameId:
          'buy_process.new_plan_selection.included_features.modal_sections.segmentation_advanced.name_3',
        descriptionId:
          'buy_process.new_plan_selection.included_features.modal_sections.segmentation_advanced.description_3',
      },
    ],
  },
  {
    key: 'reports-analytics',
    titleId:
      'buy_process.new_plan_selection.included_features.modal_sections.reports_analytics.title',
    rows: [
      {
        nameId:
          'buy_process.new_plan_selection.included_features.modal_sections.reports_analytics.name_1',
        descriptionId:
          'buy_process.new_plan_selection.included_features.modal_sections.reports_analytics.description_1',
      },
      {
        nameId:
          'buy_process.new_plan_selection.included_features.modal_sections.reports_analytics.name_2',
        descriptionId:
          'buy_process.new_plan_selection.included_features.modal_sections.reports_analytics.description_2',
      },
      {
        nameId:
          'buy_process.new_plan_selection.included_features.modal_sections.reports_analytics.name_3',
        descriptionId:
          'buy_process.new_plan_selection.included_features.modal_sections.reports_analytics.description_3',
      },
      {
        nameId:
          'buy_process.new_plan_selection.included_features.modal_sections.reports_analytics.name_4',
        descriptionId:
          'buy_process.new_plan_selection.included_features.modal_sections.reports_analytics.description_4',
      },
    ],
  },
];

export const IncludedFeatures = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSectionKey, setActiveSectionKey] = useState(MODAL_SECTIONS[0].key);

  const handleOpenModal = () => {
    setActiveSectionKey(MODAL_SECTIONS[0].key);
    setIsModalOpen(true);
  };

  const handleToggleSection = (sectionKey) => {
    setActiveSectionKey((currentSectionKey) =>
      currentSectionKey === sectionKey ? null : sectionKey,
    );
  };

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
        <button type="button" onClick={handleOpenModal}>
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
                  onClick={() => handleToggleSection(section.key)}
                  aria-expanded={isActive}
                >
                  <FormattedMessage id={section.titleId} />
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
                          {section.rows.map((row) => (
                            <tr key={`${section.key}-${row.nameId}`}>
                              <td>
                                <div className="dp-icon-lock">
                                  <span className="dp-ico--ok" />
                                  <span>
                                    <FormattedMessage id={row.nameId} />
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span>
                                  <FormattedMessage id={row.descriptionId} />
                                </span>
                              </td>
                            </tr>
                          ))}
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
