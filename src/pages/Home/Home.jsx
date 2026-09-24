import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import Projects from "../../components/Projects/Projects";
import About from "../../components/About/About";
import Skills from "../../components/Skills/Skills";
import Contact from "../../components/Contact/Contact";
import AdminButton from "../../components/AdminButton/AdminButton";

function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Projects />
        <About />
        <Skills />
        <Contact />
      </main>

      <AdminButton />
    </>
  );
}

export default Home;