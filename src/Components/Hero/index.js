import { GlobalStyle } from "../Styles/Global";
import { Div, P, P2, Image, Link } from "./styles";
import Button from "../Button";

export default function Hero({ children }) {
  return (
    <Div>
      <GlobalStyle />
      <P>Assistência técnica especializada</P>
      <P2>
        Serviço rápido, confiável e profissional para seus computadores e
        celulares. Trazemos sua tecnologia de volta à vida.
      </P2>
      <Button>Fale Conosco Pelo WhatsApp</Button>
    </Div>
  );
}
