import { ButtonStyled } from "./styles";

export default function Button({ children }) {
  return (
    <main>
      <ButtonStyled>{children}</ButtonStyled>
    </main>
  );
}
