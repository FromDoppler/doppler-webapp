import styled from 'styled-components';

export const CheckoutSummaryLayout = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 24px;
  padding-bottom: 48px;

  .checkout-summary-main {
    flex: 5 1 0;
    min-width: 0;
  }

  .checkout-summary-main .dp-content-message p {
    text-wrap: pretty;
  }

  .checkout-summary-addons {
    flex: 1 1 280px;
    margin-top: -46px;
    min-width: 0;
    overflow: hidden;
  }

  .checkout-summary-addons > div {
    height: 100%;
  }

  @media (max-width: 991px) {
    display: block;

    .checkout-summary-addons {
      margin-top: 0;
    }

    .checkout-summary-addons > div {
      height: auto;
    }
  }
`;
