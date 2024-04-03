import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export const AddOn = ({ title, titleIconName, description, link1, link2, priceComponent }) => {
  return (
    <article className="dp-card-addons">
      <h3>
        <span className={titleIconName} /> {title}
      </h3>
      <p>{description}</p>
      <span className="dp-pricing-addons">{priceComponent}</span>
      <footer>
        <ul>
          {link1 && (
            <li>
              <Link to={link1.pathname}>{link1.label}</Link>
            </li>
          )}
          <li>
            <Link to={link2.pathname} className="dp-button button-medium secondary-green">
              {link2.label}
            </Link>
          </li>
        </ul>
      </footer>
    </article>
  );
};

AddOn.propTypes = {
  title: PropTypes.string.isRequired,
  titleIconName: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.object]).isRequired,
  link1: PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.object]),
    pathname: PropTypes.string.isRequired,
  }),
  link2: PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.object]),
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  priceComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.object]).isRequired,
};
