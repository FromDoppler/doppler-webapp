export const GrayCard = ({ title, subtitle, description, button, handleClick }) => {
  return (
    <div className="dp-card-grey">
      <h4>{title}</h4>
      <h2>{subtitle}</h2>
      <p>{description}</p>
      <button
        type="button"
        className="dp-button button-medium primary-green dp-w-100"
        onClick={handleClick}
      >
        {button}
      </button>
    </div>
  );
};
