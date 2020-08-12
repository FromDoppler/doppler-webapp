import styled, { createGlobalStyle } from 'styled-components';

export const CenterContent = styled.div`
  display: flex;
  justify-content: center;
`;

export const CenterColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 710px;
  margin-top: 200px;
`;

export const MaintenanceImage = styled.img.attrs({
  src: './maintenance.gif',
})`
  width: 385px;
  align-self: center;
  margin: 30px 0 40px 0;
`;

export const AccentText = styled.p`
  font-size: 18px !important;
`;

export const HideChat = createGlobalStyle`
  div.zsiq_floatmain.zsiq_theme1.siq_bR {
    display: none !important;
  }
`;
