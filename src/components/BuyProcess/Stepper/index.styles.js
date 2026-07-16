import styled from 'styled-components';

export const StepperStyled = styled.div`
  .dp-stepper-mobile {
    display: none;
  }

  @media (max-width: 767px) {
    .dp-container-steper.hero-banner {
      margin: 0;
      padding: 0;
    }

    .dp-stepper-desktop {
      display: none;
    }

    .dp-stepper-mobile {
      align-items: center;
      background: #fff;
      border: 0;
      border-radius: 0;
      box-shadow: none;
      display: flex;
      gap: 8px;
      justify-content: flex-start;
      margin: 0;
      min-height: 0;
      padding: 14px 16px 14px 12px;
      position: relative;
      width: 100%;
    }

    .dp-stepper-mobile::before {
      color: #666;
      content: '<';
      font-family:
        Proxima Nova,
        sans-serif;
      font-size: 16px;
      left: 12px;
      line-height: 1;
      pointer-events: none;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
    }

    .dp-stepper-mobile-back-icon {
      display: none;
    }

    .dp-stepper-mobile-copy {
      flex: 1 1 auto;
      min-width: 0;
      padding-top: 0;
      padding-left: 20px;
    }

    .dp-stepper-mobile-title {
      color: #333;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.15;
      margin: 0 0 4px;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .dp-stepper-mobile-subtitle {
      color: #999;
      font-size: 12px;
      line-height: 1.2;
      margin: 0;
    }

    .dp-stepper-mobile-progress {
      align-items: center;
      background: conic-gradient(
        #33ad73 0deg,
        #33ad73 var(--step-progress-angle),
        #d9d9d9 var(--step-progress-angle),
        #d9d9d9 360deg
      );
      border-radius: 50%;
      box-sizing: border-box;
      color: #333;
      display: inline-flex;
      flex: 0 0 auto;
      height: 60px;
      justify-content: center;
      margin-left: auto;
      margin-top: 0;
      min-width: 60px;
      overflow: hidden;
      padding: 0;
      position: relative;
      isolation: isolate;
      text-align: center;
      width: 60px;
    }

    .dp-stepper-mobile-progress::before {
      background: #fff;
      border-radius: 50%;
      content: '';
      bottom: 5px;
      left: 5px;
      position: absolute;
      right: 5px;
      top: 5px;
      z-index: 0;
    }

    .dp-stepper-mobile-progress::after {
      color: #333;
      content: attr(data-progress);
      display: block;
      font-size: 14px;
      font-weight: 700;
      left: 50%;
      line-height: 1;
      pointer-events: none;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      white-space: nowrap;
      width: max-content;
      z-index: 1;
    }

    .dp-stepper-mobile-progress-sr-only {
      border: 0;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }
  }
`;
