import styled from "styled-components";

export const ButtonStyled = styled.button`
  background-color: #37c572;
  width: 400px;
  height: 60px;
  color: white;
  padding: 10px 18px;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  font-size: 22px;
  margin: 50px 0 0 0;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    border: 2px solid rgba(255, 255, 255, 1);
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;
