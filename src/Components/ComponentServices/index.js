import { GlobalStyle } from "../Styles/Global";
import { Div, DivContent, DivServices, P, P2, P3 } from "./styles";

import { Laptop, Smartphone, Wrench } from "lucide-react";

export default function ComponentsServices({ children }) {
  return (
    <Div>
      <GlobalStyle />
      <P>Nossos Principais Serviços</P>
      <P2>
        Qualquer que seja o problema, nós temos a solução especializada que você
        precisa.
      </P2>
      <DivServices>
        <DivContent>
          <div style={{ margin: "0 0 20px 0" }}>
            <Laptop size={40} color="#549E99" alignItems="center" />
          </div>

          <P3>Reparo de Computadores</P3>
          <P2 style={{ margin: "20px 0" }}>
            De troca de telas a remoção de vírus, consertamos todas as marcas e
            modelos de notebooks e desktops.
          </P2>
        </DivContent>
        <DivContent>
          <div style={{ margin: "0 0 20px 0" }}>
            <Smartphone size={40} color="#549E99" alignItems="center" />
          </div>

          <P3>Reparo de Celulares</P3>
          <P2 style={{ margin: "20px 0" }}>
            Telas rachadas, problemas de bateria ou danos por água? Deixaremos
            seu celular funcionando como novo.
          </P2>
        </DivContent>
        <DivContent>
          <div style={{ margin: "0 0 20px 0" }}>
            <Wrench size={40} color="#549E99" alignItems="center" />
          </div>

          <P3>Serviços Gerais de PC</P3>
          <P2 style={{ margin: "20px 0" }}>
            Upgrades, montagem personalizada e otimização de desempenho para
            tornar seu PC mais rápido e potente.
          </P2>
        </DivContent>
      </DivServices>
    </Div>
  );
}
