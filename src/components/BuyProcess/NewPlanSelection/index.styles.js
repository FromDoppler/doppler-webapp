import styled from 'styled-components';

export const NewPlanSelectionStyled = styled.div`
  .dp-new-plan-selection-header {
    padding: 24px 0 12px;
  }

  .dp-new-plan-selection-back {
    margin-bottom: 8px;
  }

  .dp-new-plan-selection-back .dp-button.ctaTertiary {
    background: transparent;
    border: 0;
    color: #33ad73;
    display: inline-flex;
    align-items: center;
    gap: 0;
    font-size: 13px;
    min-height: auto;
    padding: 0;
    text-decoration: none;
  }

  .dp-new-plan-selection-back .dp-button.ctaTertiary::before {
    content: '<';
    display: inline-block;
    margin-right: 6px;
  }

  .dp-new-plan-selection-back .dp-button.ctaTertiary .dp-new-plan-selection-back-text {
    text-decoration: underline;
  }

  .dp-new-plan-selection-back .dp-button.ctaTertiary:hover {
    color: #008046;
  }

  .dp-new-plan-selection-title {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }

  .dp-new-plan-selection-title .dpicon {
    padding-bottom: 10px;
  }

  .dp-new-plan-selection-subtitle {
    color: #666;
    margin: 0;
    max-width: 720px;
  }

  .dp-new-plan-selection-card {
    background: #fff;
    border: 1px solid #eaeaea;
    border-radius: 3px;
    margin-bottom: 24px;
    margin-top: 6px;
    max-width: 900px;
    padding: 24px;
  }

  .dp-new-plan-selection-card-header {
    align-items: flex-start;
    display: flex;
    gap: 16px;
    justify-content: flex-start;
    margin-bottom: 20px;
  }

  .dp-new-plan-selection-card-header h3 {
    margin-bottom: 0;
  }

  .dp-new-plan-selection-plan-title {
    align-items: center;
    display: flex;
    gap: 8px;
    margin-bottom: 6px;
  }

  .dp-new-plan-selection-card-header p {
    color: #666;
    margin: 0;
  }

  .dp-new-plan-selection-badge {
    background: #33ad73;
    border-radius: 3px;
    color: #fff;
    flex: 0 0 auto;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    padding: 7px 10px;
    text-transform: uppercase;
  }

  .dp-new-plan-selection-fields {
    display: grid;
    gap: 16px;
  }

  .dp-new-plan-selection-select-wrap {
    max-width: 350px;
    position: relative;
  }

  .dp-new-plan-selection-select-wrap .labelcontrol,
  .dp-new-plan-selection-payment-frequency h4,
  .dp-new-plan-selection-promocode legend {
    color: #333;
    display: block;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 6px;
    text-transform: none;
  }

  .dp-new-plan-selection-select-wrap .dropdown-arrow {
    pointer-events: none;
    position: absolute;
    right: 12px;
    top: 39px;
  }

  .dp-new-plan-selection-select {
    appearance: none;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 3px;
    color: #333;
    font-size: 13px;
    line-height: 20px;
    min-height: 34px;
    overflow: hidden;
    padding: 6px 40px 6px 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  .dp-new-plan-selection-payment-frequency,
  .dp-new-plan-selection-promocode {
    max-width: 350px;
  }

  .dp-new-plan-selection-main {
    align-items: stretch;
    display: flex;
    flex-wrap: nowrap;
    gap: 22px;
  }

  .dp-new-plan-selection-main > .col-lg-8,
  .dp-new-plan-selection-main > .col-lg-4 {
    max-width: none;
    width: auto;
  }

  .dp-new-plan-selection-main > .col-lg-8 {
    flex: 1 1 auto;
  }

  .dp-new-plan-selection-main > .col-lg-4 {
    flex: 0 0 270px;
  }

  .dp-new-plan-selection-price {
    border-left: 1px solid #e4e4e4;
    margin-left: 0;
    padding-left: 22px;
    padding-top: 6px;
    padding-right: 28px;
  }

  .dp-new-plan-selection-price-label {
    color: #333;
    display: block;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .dp-new-plan-selection-price-value {
    align-items: baseline;
    color: #333;
    display: flex;
    flex-wrap: wrap;
    font-size: 38px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 8px;
  }

  .dp-new-plan-selection-custom-price {
    font-size: 44px;
  }

  .dp-new-plan-selection-price-period {
    font-size: 16px;
    margin-left: 2px;
  }

  .dp-new-plan-selection-price-detail {
    align-items: baseline;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
  }

  .dp-new-plan-selection-old-price {
    color: #666;
    text-decoration: line-through;
  }

  .dp-new-plan-selection-savings {
    color: #008046;
    font-size: 13px;
    font-weight: 700;
  }

  .dp-new-plan-selection-price .dp-button {
    min-width: 100%;
  }

  .dp-new-plan-selection-disclaimer {
    margin: 16px 0 0;
  }

  .dp-new-plan-selection-promocode .dp-form-promocode {
    display: block;
  }

  // .dp-new-plan-selection-promocode .field-group {
  //   align-items: center;
  //   display: flex;
  //   flex-wrap: nowrap;
  //   gap: 6px;
  // }

  .dp-new-plan-selection-promocode .dp-form-promocode .field-item--70 {
    padding-right: 6px;
  }

  .dp-new-plan-selection-promocode .dp-form-promocode .field-item--30 {
    margin: 0;
  }

  // .dp-new-plan-selection-promocode .field-item--70 .labelcontrol {
  //   position: relative;
  // }

  .dp-new-plan-selection-promocode .field-item--70 input {
    margin: 0;
    padding-left: 30px;
    background-image: url(/images/discount-coupon.svg);
    background-repeat: no-repeat;
    background-position: 6px center;

    &::placeholder {
      color: #ccc;
    }

    &:disabled {
      background-image: none;
    }
  }

  .dp-new-plan-selection-promocode .field-item--70 input.dp-approved {
    background-image: url(/images/status-ckeck-icon.svg);
    background-repeat: no-repeat;
    background-position: 6px center;
  }

  .dp-new-plan-selection-promocode .field-item--70 .dp-btn-delete {
    position: absolute;
    width: 25px;
    height: 25px;
    right: 7px;
    top: 7px;
    padding: 11px;
    border-radius: 100%;
    box-shadow: hsla(0, 0%, 100%, 0) 0px 0px 0px 30px;
    transition: box-shadow 0.4s ease 0s;
    font-weight: normal;
    font-size: 1rem;

    &:hover {
      box-shadow: rgba(149, 157, 165, 0.5) 0 0 0 0;
    }

    &::before {
      position: absolute;
      top: 3px;
      right: 5px;
    }

    &:disabled {
      cursor: default;
    }
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency,
  .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en {
    border-radius: 30px;
    display: flex;
    height: 42px;
    margin: 8px 0 2px;
    position: relative;
    width: 100%;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency::before,
  .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en::before {
    border: 1px solid #ccc;
    content: '';
    height: 100%;
    position: absolute;
    width: 100%;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency button,
  .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en button {
    align-items: center;
    color: #333;
    cursor: pointer;
    display: flex;
    font-weight: 400;
    height: 100%;
    justify-content: center;
    line-height: 1;
    padding: 0 6px;
    position: relative;
    text-align: center;
    width: 25%;
    z-index: 1;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency .dp-discount,
  .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en .dp-discount {
    background-color: #fddc79;
    border-radius: 30px;
    color: #333;
    font-size: 9px;
    font-weight: 700;
    line-height: 1;
    padding: 2px 4px;
    position: absolute;
    right: 3px;
    top: -10px;
    z-index: 5;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency .animation,
  .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en .animation {
    border: 2px solid #333;
    height: 100%;
    position: absolute;
    top: 0;
    transition: all 0.3s ease 0s;
    z-index: 0;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency .dp-frequency-annual {
    background: #dff5ea;
    left: 75%;
    width: 25%;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency .dp-frequency-biannual {
    background: #dff5ea;
    left: 50%;
    width: 25%;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency .dp-frequency-quarterly {
    background: #dff5ea;
    left: 25%;
    width: 25%;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency .dp-frequency-monthly {
    background: #dff5ea;
    left: 0;
    width: 25%;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en .dp-frequency-annual {
    background: #dff5ea;
    left: 0;
    width: 25%;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en .dp-frequency-biannual {
    background: #dff5ea;
    left: 25%;
    width: 25%;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en .dp-frequency-quarterly {
    background: #dff5ea;
    left: 50%;
    width: 25%;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en .dp-frequency-monthly {
    background: #dff5ea;
    left: 75%;
    width: 25%;
  }

  .dp-new-plan-selection-promocode .field-item {
    margin-bottom: 0;
  }

  .dp-new-plan-selection-more-than-message {
    align-items: center;
    display: flex;
    gap: 12px;
    margin-top: 16px;
    padding: 10px 12px;
  }

  .dp-new-plan-selection-more-than-link {
    color: #333;
    flex: 0 0 auto;
    font-size: 11px;
    font-weight: 700;
    text-decoration: underline;
    text-transform: uppercase;
  }

  @media (max-width: 991px) {
    .dp-new-plan-selection-card {
      padding: 18px;
    }

    .dp-new-plan-selection-main {
      display: block;
    }

    .dp-new-plan-selection-price {
      border-left: 0;
      margin-left: 0;
      margin-top: 24px;
      padding-left: 0;
      padding-top: 18px;
      position: relative;
    }

    .dp-new-plan-selection-price::before {
      border-top: 1px solid #e4e4e4;
      content: '';
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  @media (max-width: 767px) {
    .dp-new-plan-selection-card-header {
      display: block;
    }

    .dp-new-plan-selection-badge {
      display: inline-block;
      margin-top: 12px;
    }

    .dp-new-plan-selection-price-value {
      font-size: 32px;
    }

    .dp-new-plan-selection-payment-frequency .dp-payment-frequency button,
    .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en button {
      font-size: 12px;
      padding: 0 6px;
    }

    .dp-new-plan-selection-price .dp-button {
      min-width: 0;
      width: 100%;
    }

    .dp-new-plan-selection-price .dp-new-plan-selection-contact-advisor-cta {
      margin-left: 0;
      width: 100%;
    }

    .dp-new-plan-selection-custom-price {
      font-size: 38px;
    }

    .dp-new-plan-selection-more-than-message {
      align-items: flex-start;
      display: block;
    }

    .dp-new-plan-selection-more-than-link {
      display: inline-block;
      margin-top: 6px;
    }

    .dp-new-plan-selection-payment-frequency,
    .dp-new-plan-selection-promocode,
    .dp-new-plan-selection-select-wrap {
      max-width: none;
    }
  }
`;
