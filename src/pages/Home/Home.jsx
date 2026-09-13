import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import Projects from "../../components/Projects/Projects";

function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Projects />
      </main>
    </>
  );
}

export default Home;