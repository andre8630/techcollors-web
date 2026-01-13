import styled from "styled-components";

export const Div = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 500px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: #0b0b0cef;
  background-size: 100%;
`;

export const DivContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 600px;
  background: #549e99;
  justify-content: center;
  align-items: center;
`;

export const DivFooter = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 200px;
  justify-content: center;
  align-items: center;
  padding: -15px 0;
`;

export const P = styled.p`
  color: #ffffff;
  margin: 0 20px;
  font-size: 45px;
  font-weight: bold;
  margin: 40px 0;
  text-align: center;
`;

export const P2 = styled.p`
  color: #ffffff;
  margin: 0 20px;
  font-size: 25px;
  font-weight: normal;
  max-width: 600px;
  text-align: center;
`;

export const P3 = styled.p`
  color: #ffffffa8;
  margin: 0 20px;
  font-size: 18px;
  font-weight: normal;
  max-width: 600px;
  text-align: center;
`;
