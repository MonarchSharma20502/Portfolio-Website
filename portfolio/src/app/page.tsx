import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CurtainReveal from "@/components/motion/CurtainReveal";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <CurtainReveal>
          <About />
        </CurtainReveal>
        <Stats />
        <CurtainReveal>
          <Skills />
        </CurtainReveal>
        <CurtainReveal>
          <Experience />
        </CurtainReveal>
        <CurtainReveal>
          <Projects />
        </CurtainReveal>
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
