import styled from "styled-components";

export const Div = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 500px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px;

  background: #0b0b0cef;
  @media (max-width: 768px) {
    margin-top: 40px;
  }
`;

export const P = styled.p`
  color: #ffffff;
  margin: 0 20px;
  font-size: 50px;
  font-weight: bold;
  margin: 40px 0;
  text-align: center;
`;

export const P2 = styled.p`
  color: #9c9c9cdc;
  margin: 0 20px;
  font-size: 20px;
  font-weight: normal;
  max-width: 600px;
  text-align: center;
`;

export const Image = styled.img`
  max-width: 200px;
  margin-left: 50px;
`;

export const Link = styled.a`
  text-decoration: none;
`;
