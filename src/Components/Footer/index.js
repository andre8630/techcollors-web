import { GlobalStyle } from "../Styles/Global";
import { Div, P, P2, P3, DivContent, DivFooter } from "./styles";
import Button from "../Button";

export default function Footer({ children }) {
  return (
    <Div>
      <GlobalStyle />
      <DivContent>
        <P>Tem Alguma Dúvida?</P>
        <P2 style={{ fontSize: "25px" }}>
          Estamos aqui para ajudar. Envie-nos uma mensagem para um diagnóstico
          rápido e um orçamento gratuito e sem compromisso.
        </P2>
        <Button>Fale Conosco Pelo WhatsApp</Button>
      </DivContent>
      <DivFooter>
        <P3>© 2025 Techcollors. Todos os Direitos Reservados.</P3>
      </DivFooter>
    </Div>
  );
}
