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
    text-transform: uppercase;
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

  .dp-new-plan-selection-sticky-summary {
    background: #f5f5f5;
    border-top: 1px solid #e5e5e5;
    bottom: 0;
    left: 0;
    margin-bottom: 0;
    position: fixed;
    right: 0;
    width: 100%;
    z-index: 30;
  }

  .dp-new-plan-selection-layout {
  }

  .dp-new-plan-selection-sticky-summary-content {
    align-items: center;
    margin: 0 auto;
    max-width: 1250px;
    display: flex;
    gap: 20px;
    justify-content: space-between;
    padding: 12px 18px;
  }

  .dp-new-plan-selection-sticky-summary-copy {
    min-width: 0;
  }

  .dp-new-plan-selection-sticky-summary-copy h5 {
    text-transform: none;
  }

  .dp-new-plan-selection-sticky-summary-copy h1 {
    padding-bottom: 0px;
  }

  .dp-new-plan-selection-sticky-summary-title {
  }

  .dp-new-plan-selection-sticky-summary-price {
  }

  .dp-new-plan-selection-sticky-summary-discount-text {
    margin: 0;
  }

  .dp-new-plan-selection-sticky-summary .dp-button {
    flex: 0 0 auto;
    min-width: 230px;
  }

  .dp-new-plan-selection-card {
    background: #fff;
    border: 1px solid #eaeaea;
    border-radius: 3px;
    margin-bottom: 24px;
    margin-top: 24px;
    padding: 30px 114px;
  }

  .dp-new-plan-selection-card-credits {
    background: #fdf5c8;
    border-color: #e9dfaa;
    border-left: 0;
    border-radius: 0;
    border-right: 0;
    box-shadow: 0 0 0 9999px #fdf5c8;
    clip-path: inset(0 -9999px);
    padding: 24px 0 28px;
  }

  .dp-new-plan-selection-card-credits-content {
    padding: 0;
  }

  .dp-new-plan-selection-credits-fullwidth {
    margin: 0;
    max-width: none;
    padding-left: 0;
    padding-right: 0;
    width: 100%;
  }

  .dp-new-plan-selection-credits-fullwidth .dp-new-plan-selection-card-credits {
    margin: 0;
    max-width: none;
    width: 100%;
  }

  .dp-new-plan-selection-card-credits .dp-new-plan-selection-card-header {
    margin-bottom: 14px;
  }

  .dp-new-plan-selection-card-credits .dp-new-plan-selection-plan-title {
    margin-bottom: 4px;
  }

  .dp-new-plan-selection-credits-description {
    max-width: 640px;
  }

  .dp-new-plan-selection-main-credits {
    gap: 16px;
  }

  .dp-new-plan-selection-fields-credits {
    gap: 12px;
    padding-right: 42px;
  }

  .dp-new-plan-selection-card-credits .dp-new-plan-selection-select-wrap,
  .dp-new-plan-selection-card-credits .dp-new-plan-selection-promocode {
    max-width: 415px;
    margin-top: 6px;
  }

  .dp-new-plan-selection-card-credits .dp-new-plan-selection-price-credits {
    border-left: 0;
    justify-content: flex-start;
    padding-left: 42px;
    padding-top: 2px;
    padding-right: 0;
  }

  .dp-new-plan-selection-card-credits .dp-new-plan-selection-price-value {
    margin-bottom: 10px;
  }

  .dp-new-plan-selection-card-credits .dp-new-plan-selection-buy-credits-cta {
    background-color: #fab221;
    border-color: #e58900;
    color: #302100;
  }

  .dp-new-plan-selection-card-credits .dp-new-plan-selection-buy-credits-cta:hover {
    background-color: #e58900;
    border-color: #e58900;
    color: #302100;
  }

  .dp-new-plan-selection-card-credits .dp-new-plan-selection-disclaimer-credits {
    line-height: 1.45;
    margin-top: 14px;
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
    border-radius: 12px;
    color: #fff;
    flex: 0 0 auto;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    padding: 7px 10px;
    text-transform: uppercase;
  }

  .dp-new-plan-selection-fields {
    display: grid;
    gap: 16px;
    padding-right: 64px;
  }

  .dp-new-plan-selection-select-wrap {
    position: relative;
  }

  .dp-new-plan-selection-select-wrap .labelcontrol,
  .dp-new-plan-selection-payment-frequency h4,
  .dp-new-plan-selection-promocode legend {
    display: block;
    font-weight: 700;
  }

  .dp-new-plan-selection-select-wrap .dropdown-arrow {
    bottom: 13px;
    pointer-events: none;
    position: absolute;
    right: 12px;
    top: auto;
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
    align-self: stretch;
    border-left: 1px solid #e4e4e4;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 0;
    padding-left: 84px;
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
    margin-top: 10px;
    width: 250px;
  }

  .dp-new-plan-selection-extra-credits-message {
    margin: 0 0 12px;
  }

  .dp-new-plan-selection-disclaimer {
    margin: 16px 0 0;
  }

  .dp-new-plan-selection-promocode .dp-form-promocode {
    display: block;
    margin: 0;
    width: 100%;
  }

  .dp-new-plan-selection-promocode .dp-form-promocode .field-group {
    align-items: flex-start;
    display: flex;
    gap: 8px;
    margin: 0;
    padding: 0;
    width: 100%;
  }

  .dp-new-plan-selection-promocode .dp-form-promocode .field-item--70 {
    flex: 1 1 auto;
    margin: 0;
    min-width: 0;
    padding-right: 0;
    width: auto;
  }

  .dp-new-plan-selection-promocode .dp-form-promocode .field-item--30 {
    flex: 0 0 120px;
    margin: 0;
    min-width: 0;
    width: 120px;
  }

  .dp-new-plan-selection-promocode .field-item--30 .dp-button {
    margin: 0;
    width: 100%;
  }

  .dp-new-plan-selection-promocode .field-item--70 .labelcontrol {
    display: block;
    position: relative;
  }

  .dp-new-plan-selection-promocode .field-item--70 .dp-new-plan-selection-promocode-icon {
    font-size: 14px;
    left: 8px;
    pointer-events: none;
    position: absolute;
    top: 12px;
    z-index: 1;
  }

  .dp-new-plan-selection-promocode .field-item--70 .labelcontrol.is-approved {
    .dp-new-plan-selection-promocode-icon {
      color: #33ad73;
    }
  }

  .dp-new-plan-selection-promocode .field-item--70 input {
    margin: 0;
    padding-left: 30px;
    box-shadow: 0 0 0 2px transparent;

    &::placeholder {
      color: #ccc;
    }
  }

  .dp-new-plan-selection-promocode .field-item--70 input.dp-approved {
    background-image: url('/images/status-ckeck-icon.svg');
    background-repeat: no-repeat;
    background-position: 6px center;
  }

  .dp-new-plan-selection-promocode .field-item--70 .dp-btn-delete {
    position: absolute;
    width: 20px;
    height: 20px;
    right: 7px;
    top: 12px;
    background-image: url('/images/actions-close-icon.svg');
    background-repeat: no-repeat;

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

  .dp-new-plan-selection-promocode .dp-wrap-message,
  .dp-new-plan-selection-promocode .dp-simulated-price {
    margin-top: 12px;
    width: 100%;
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
    font-size: 12px;
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
    left: 75%;
    width: 25%;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en .dp-frequency-biannual {
    background: #dff5ea;
    left: 50%;
    width: 25%;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en .dp-frequency-quarterly {
    background: #dff5ea;
    left: 25%;
    width: 25%;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en .dp-frequency-monthly {
    background: #dff5ea;
    left: 0%;
    width: 25%;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency.dp-pf-disabled::before,
  .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en.dp-pf-disabled::before {
    border-color: #d5d5d5;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency.dp-pf-disabled button,
  .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en.dp-pf-disabled button {
    color: #8c8c8c;
    cursor: not-allowed;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency.dp-pf-disabled .dp-discount,
  .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en.dp-pf-disabled .dp-discount {
    background-color: #e3e3e3;
    color: #9a9a9a;
  }

  .dp-new-plan-selection-payment-frequency .dp-payment-frequency.dp-pf-disabled .animation,
  .dp-new-plan-selection-payment-frequency .dp-payment-frequency-en.dp-pf-disabled .animation {
    background: #ececec;
    border-color: #c9c9c9;
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

  .dp-new-plan-selection-more-than-message .dp-message-icon {
    flex: 0 0 auto;
    margin-top: 0;
  }

  .dp-new-plan-selection-more-than-message .dp-content-message {
    flex: 1 1 auto;
    min-width: 0;
  }

  .dp-new-plan-selection-more-than-link {
    color: #333;
    display: inline-block;
    font-size: 13px;
    font-weight: 400;
    margin-top: 12px;
    text-decoration: underline;
    text-transform: uppercase;
  }

  .dp-new-plan-selection-included-features {
    margin: 44px auto 30px;
    width: 100%;
  }

  .dp-new-plan-selection-included-features-title {
    font-size: 28px;
    line-height: 1.2;
    margin-bottom: 6px;
    text-align: center;
  }

  .dp-new-plan-selection-included-features-subtitle {
    color: #666;
    font-size: 13px;
    margin-bottom: 26px;
    text-align: center;
  }

  .dp-new-plan-selection-included-features-grid {
    display: grid;
    gap: 22px 26px;
    grid-template-columns: repeat(3, minmax(0, calc((100% - 52px) / 3)));
  }

  .dp-new-plan-selection-included-features-item {
    max-width: 245px;
  }

  .dp-new-plan-selection-included-features-item h4 {
    text-transform: none;
  }

  .dp-new-plan-selection-included-features .dp-accordion-panel {
    padding: 0;
  }

  .dp-new-plan-selection-feature-icon-wrap {
    align-items: center;
    border-radius: 3px;
    display: inline-flex;
    height: 40px;
    justify-content: center;
    margin-bottom: 8px;
    width: 40px;
  }

  .dp-new-plan-selection-feature-icon-wrap .dpicon {
    color: #fff;
    font-size: 22px;
  }

  .dp-new-plan-selection-feature-separator {
    background-color: #d7d7d7;
    display: block;
    height: 1px;
    margin-bottom: 8px;
    width: 100%;
  }

  .dp-feature-icon-1 {
    background-color: #e79433;
  }

  .dp-feature-icon-2 {
    background-color: #e34f45;
  }

  .dp-feature-icon-3 {
    background-color: #fcc338;
  }

  .dp-feature-icon-4 {
    background-color: #33ad73;
  }

  .dp-feature-icon-5 {
    background-color: #b48fc1;
  }

  .dp-feature-icon-6 {
    background-color: #2a75db;
  }

  .dp-new-plan-selection-see-more {
    display: flex;
    justify-content: center;
  }

  .dp-new-plan-selection-see-more button {
    align-items: center;
    background: none;
    border: 0;
    color: #33ad73;
    cursor: pointer;
    display: inline-flex;
    font-size: 12px;
    font-weight: 700;
    gap: 6px;
    margin-top: 22px;
    padding: 0;
    text-transform: uppercase;
  }

  .dp-new-plan-selection-see-more button .dpicon {
    font-size: 11px;
  }

  .dp-new-plan-selection-features-modal.modal-content--large {
    max-width: 740px;
    padding: 24px 20px 18px;
  }

  .dp-new-plan-selection-features-modal .close {
    right: 16px;
    top: 14px;
  }

  .dp-new-plan-selection-features-modal .modal-title {
    color: #333;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 16px;
    text-align: center;
  }

  .dp-new-plan-selection-features-accordion {
    border: 1px solid #eaeaea;
    border-radius: 3px;
    margin: 0;
    overflow: hidden;
    padding: 0;
    list-style: none;
  }

  .dp-new-plan-selection-features-accordion > li {
    border-bottom: 1px solid #eaeaea;
    overflow: visible;
    list-style: none;
    margin: 0;
    max-width: 100%;
    padding: 0;
    width: 100%;
  }

  .dp-new-plan-selection-features-accordion > li:last-child {
    border-bottom: 0;
  }

  .dp-new-plan-selection-features-accordion .dp-accordion-thumb::before {
    content: none;
  }

  .dp-new-plan-selection-features-accordion-thumb {
    align-items: center;
    background: transparent;
    border: 0;
    color: #333;
    cursor: pointer;
    display: flex;
    font-size: 12px;
    font-weight: 700;
    gap: 5px;
    justify-content: flex-start;
    line-height: 1;
    min-height: 0;
    padding: 8px 14px;
    text-align: left;
    width: 100%;
  }

  .dp-new-plan-selection-features-accordion-arrow span {
    border-bottom: 2px solid #666;
    border-right: 2px solid #666;
    display: block;
    height: 6px;
    transform: rotate(45deg);
    transition: transform 0.2s ease;
    width: 6px;
  }

  .dp-new-plan-selection-features-accordion-arrow span.is-active {
    transform: rotate(-135deg);
  }

  .dp-new-plan-selection-features-accordion .dp-accordion-panel .dp-table-plans {
    margin: 0;
    padding: 0;
  }

  .dp-new-plan-selection-features-accordion .dp-accordion-panel {
    display: block;
    height: auto;
    overflow: visible;
  }

  .dp-new-plan-selection-features-accordion .dp-accordion-panel .dp-table-responsive {
    overflow-x: auto;
    padding: 0px;
  }

  .dp-new-plan-selection-features-accordion .dp-accordion-panel .dp-c-table {
    margin-bottom: 0;
  }

  .dp-new-plan-selection-features-accordion .dp-accordion-panel td {
    border-top: 1px solid #eaeaea;
    color: #666;
    font-size: 11px;
    line-height: 1.35;
    padding: 10px 12px;
    vertical-align: middle;
  }

  .dp-new-plan-selection-features-accordion .dp-accordion-panel td .dp-icon-lock {
    align-items: center;
    display: flex;
    gap: 10px;
  }

  .dp-new-plan-selection-features-accordion .dp-accordion-panel td:first-child {
    width: 32%;
  }

  .dp-new-plan-selection-features-accordion .dp-accordion-panel td .dp-icon-lock > span:last-child {
    color: #212121;
    font-weight: 400;
  }

  .dp-new-plan-selection-features-accordion .dp-accordion-panel td .dp-icon-lock .dp-ico--ok {
    flex: 0 0 auto;
  }

  .dp-new-plan-selection-addons {
    margin: 34px auto 52px;
  }

  .dp-new-plan-selection-addons-header {
    margin-bottom: 22px;
    text-align: center;
  }

  .dp-new-plan-selection-addons-header h2 {
    text-transform: none;
  }

  .dp-new-plan-selection-addons-header p {
    color: #666;
    margin: 0;
  }

  .dp-new-plan-selection-addons-empty {
    color: #666;
    margin: 0;
    text-align: center;
  }

  .dp-new-plan-selection-addons-carousel {
    align-items: center;
    display: flex;
    gap: 16px;
  }

  .dp-new-plan-selection-addons-cards {
    display: flex;
    flex: 1 1 auto;
    gap: 18px;
    padding: 6px 8px 10px;
  }

  .dp-new-plan-selection-addon-card {
    display: flex;
    flex-direction: column;
    flex: 0 0 calc((100% - 36px) / 3);
    margin-bottom: 0;
    min-height: 100%;
    padding: 24px 24px 20px;
  }

  .dp-new-plan-selection-addon-card .card-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    margin-bottom: 6px;
    font-size: 22px;
  }

  .dp-new-plan-selection-addon-card .dp-description-legend {
    flex: 1 1 auto;
  }

  .dp-new-plan-selection-addon-card .card-title .icon-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 2px;
    color: #fff;

    span {
      font-size: 40px;
      line-height: 1;
    }
  }

  .dp-new-plan-selection-addon-card .dpicon {
    color: #fab221;
    flex: 0 0 auto;
  }

  .dp-new-plan-selection-addon-price {
    border-top: 1px solid #ccc;
    margin-top: 14px;
    padding-top: 12px;
  }

  .dp-new-plan-selection-addon-price .dp-legend-price {
    font-size: 14px;
    line-height: 24px;
  }

  .dp-new-plan-selection-addon-price h2 {
    padding-bottom: 0;
  }

  .dp-new-plan-selection-addons-arrow {
    align-items: center;
    background: transparent;
    border: 0;
    color: #333;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    min-height: 36px;
    min-width: 28px;
    padding: 0;
  }

  .dp-new-plan-selection-addons-arrow:disabled {
    cursor: default;
    opacity: 0.35;
  }

  .dp-new-plan-selection-faq {
    background-color: #f2f1e9;
    max-width: none;
  }

  .dp-new-plan-selection-faq section {
    padding-top: 0px;
  }

  .dp-new-plan-selection-faq .dp-title-faq {
    margin-top: 0;
  }

  .dp-new-plan-selection-faq .dp-accordion li .dp-accordion-thumb {
    color: #333;
    font-weight: 400;
  }

  @media (max-width: 991px) {
    .dp-new-plan-selection-sticky-summary-content {
      align-items: flex-start;
      display: block;
    }

    .dp-new-plan-selection-layout {
    }

    .dp-new-plan-selection-sticky-summary-title {
      font-size: 20px;
    }

    .dp-new-plan-selection-sticky-summary-price {
      font-size: 20px;
    }

    .dp-new-plan-selection-sticky-summary-subtitle {
      font-size: 15px;
      margin-bottom: 10px;
    }

    .dp-new-plan-selection-sticky-summary-discount {
      font-size: 14px;
      margin-bottom: 10px;
      text-align: left;
    }

    .dp-new-plan-selection-sticky-summary .dp-button {
      min-width: 0;
      width: 100%;
    }

    .dp-new-plan-selection-card {
      padding: 18px;
    }

    .dp-new-plan-selection-card-credits .dp-new-plan-selection-fields-credits {
      padding-right: 0;
    }

    .dp-new-plan-selection-card-credits .dp-new-plan-selection-select-wrap,
    .dp-new-plan-selection-card-credits .dp-new-plan-selection-promocode {
      max-width: none;
    }

    .dp-new-plan-selection-main {
      display: block;
    }

    .dp-new-plan-selection-price {
      border-left: 0;
      justify-content: flex-start;
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

    .dp-new-plan-selection-included-features-grid {
      grid-template-columns: repeat(2, minmax(0, calc((100% - 26px) / 2)));
    }

    .dp-new-plan-selection-included-features-item {
      max-width: none;
    }

    .dp-new-plan-selection-addon-card {
      flex-basis: calc((100% - 18px) / 2);
    }
  }

  @media (max-width: 767px) {
    .dp-new-plan-selection-sticky-summary {
      left: 0;
      right: 0;
    }

    .dp-new-plan-selection-sticky-summary-title {
      font-size: 18px;
      line-height: 1.2;
    }

    .dp-new-plan-selection-sticky-summary-price {
      display: block;
      font-size: 18px;
      margin-top: 4px;
    }

    .dp-new-plan-selection-sticky-summary-subtitle {
      font-size: 14px;
      line-height: 1.3;
      margin-bottom: 10px;
    }

    .dp-new-plan-selection-sticky-summary-discount {
      font-size: 13px;
      margin-bottom: 10px;
    }

    .dp-new-plan-selection-layout {
    }

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

    .dp-new-plan-selection-promocode .dp-form-promocode .field-group {
      display: block;
    }

    .dp-new-plan-selection-promocode .dp-form-promocode .field-item--30 {
      margin-top: 8px;
      width: 100%;
    }

    .dp-new-plan-selection-included-features-grid {
      gap: 16px;
      grid-template-columns: 100%;
    }

    .dp-new-plan-selection-features-modal.modal-content--large {
      max-height: 90vh;
      max-width: calc(100vw - 32px);
      overflow-y: auto;
      padding: 22px 16px 18px;
    }

    .dp-new-plan-selection-features-modal .modal-title {
      font-size: 20px;
    }

    .dp-new-plan-selection-addons-carousel {
      gap: 10px;
    }

    .dp-new-plan-selection-addon-card {
      flex-basis: 100%;
    }
  }
`;
