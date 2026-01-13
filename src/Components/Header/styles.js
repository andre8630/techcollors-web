import styled from "styled-components";

export const Div = styled.div`
  display: flex;
  flex: 1;
  position: fixed;
  top: 0;

  width: 100%;
  height: 80px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  background: #0b0b0c;
`;

export const P = styled.p`
  color: #ffffff;
  margin: 0 20px;
  text-align: center;
`;

export const Image = styled.img`
  max-width: 200px;
  max-height: 80px;
`;

export const Link = styled.a`
  text-decoration: none;
`;
