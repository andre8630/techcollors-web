import { GlobalStyle } from "../Styles/Global";
import { Div, P, Image, Link } from "./styles";

export default function Header({ children }) {
  return (
    <Div>
      <GlobalStyle />
      <div>
        <Image src="/images/logo.png" alt="Logo" />
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Link href="#">
          <P>Serviços</P>
        </Link>
        <Link href="#">
          <P>Contato</P>
        </Link>
      </div>
    </Div>
  );
}
