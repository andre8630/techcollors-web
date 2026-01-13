import Header from "@/Components/Header";
import Hero from "@/Components/Hero";
import ComponentsServices from "@/Components/ComponentServices";
import Footer from "@/Components/Footer";

import { GlobalStyle } from "../Components/Styles/Global";

export default function Home() {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Hero />
      <ComponentsServices />
      <Footer />
    </>
  );
}
