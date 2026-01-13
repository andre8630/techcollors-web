import styled from "styled-components";

export const Div = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 600px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0 20px;

  background: #11151e;
  @media (max-width: 768px) {
    height: 100%;
  }
`;

export const DivContent = styled.div`
  margin: 80px 30px;
  max-width: 400px;
  background: #0d1117;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(108, 186, 164, 0.4); /* brilho na borda */
    box-shadow: 0 10px 25px rgba(108, 186, 164, 0.15); /* glow */
  }
`;

export const DivServices = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

export const P = styled.p`
  color: #ffffff;
  margin: 0 10px;
  font-size: 45px;
  font-weight: bold;
  margin: 40px 0;
  text-align: center;
`;

export const P2 = styled.p`
  color: #cac9c9ce;
  margin: 0 20px;
  font-size: 18;
  font-weight: normal;
  max-width: 600px;
  text-align: center;
`;

export const P3 = styled.p`
  color: #ffffff;
  margin: 0 20px;
  font-size: 22px;
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
