import { useIntl } from 'react-intl';
import { Link as ScrollLink } from 'react-scroll';

export const FeaturesPlanTypes = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <ul className="dp-anchor-features col-sm-12 m-t-24 m-b-36">
      {ANCHOR_ITEMS.map((anchorItem, index) => (
        <li key={`feature-${index}`}>
          <div className="dp-achor-card">
            <ScrollLink
              smooth={true}
              offset={-90}
              duration={500}
              to={anchorItem.name}
              className={`${anchorItem.className} icon-card`}
              href="#"
              data-text-anchor={_(anchorItem.text)}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export const ANCHOR_ITEMS = [
  {
    name: 'automation',
    className: 'dp-icon-automation',
    text: 'plan_types.table.automation.title',
  },
  {
    name: 'campaing',
    className: 'dp-icon-campaing',
    text: 'plan_types.table.campaings.title',
  },
  {
    name: 'integrations',
    className: 'dp-icon-integrations',
    text: 'plan_types.table.integrations.title',
  },
  {
    name: 'editor',
    className: 'dp-icon-editor',
    text: 'plan_types.table.editor.title',
  },
  {
    name: 'forms',
    className: 'dp-icon-forms',
    text: 'plan_types.table.forms.title',
  },
  {
    name: 'omnicanalidad',
    className: 'dp-icon-omnicanalidad',
    text: 'plan_types.table.omni.title',
  },
  {
    name: 'reports',
    className: 'dp-icon-reports',
    text: 'plan_types.table.report.title',
  },
  {
    name: 'segmentation',
    className: 'dp-icon-segmentation',
    text: 'plan_types.table.segmentation.title',
  },
];
