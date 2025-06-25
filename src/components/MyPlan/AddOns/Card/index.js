export const Card = ({
  title,
  icon,
  description,
  priceSection,
  moreInformationText,
  moreInformationLink,
  buyButtonText,
  buyButtonUrl,
}) => {
  return (
    <div className="dp-box-shadow m-b-24">
      <section className="dp-addons-wrapper">
        <header>
          <h3 className="dp-second-order-title">
            {title}
            <span className={`dpicon ${icon}`}></span>
          </h3>
        </header>
        <article className="dp-container">
          <div className="dp-rowflex dp-content-addons">
            <div className="col-sm-6">
              <p className="dp-description-legend">{description}</p>
            </div>
            <div className="col-sm-3">
              <div className="m-l-18">{priceSection}</div>
            </div>
            <div className="col-sm-3"></div>
          </div>
        </article>
        <hr></hr>
        <footer className="dp-footer-addons">
          <a href={moreInformationLink} className="dp-more-information">
            {moreInformationText}
          </a>
          <a href={buyButtonUrl}>
            <button type="button" className="dp-button button-medium primary-green">
              {buyButtonText}
            </button>
          </a>
        </footer>
      </section>
    </div>
  );
};
