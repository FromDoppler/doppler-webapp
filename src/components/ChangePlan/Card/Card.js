import React from 'react';


const Card = ({ data }) => {

  return (
    <div class="dp-card">
      <h3>{data.title}</h3>
      <p>{data.description}</p>
      <p>{data.descriptionPlan}</p>
      <div class="dp-price" data-start={data.price.initialText}>
        <div class="dp-amount">
          <span class="dp-money-number" data-money="US$">{data.price.value}</span>
          <span>{data.price.endText}</span>
        </div>
      </div>
      <a href={data.action.url} class="dp-button button-medium primary-green">{data.action.text}</a>
    </div>
  );
}

export default Card;
