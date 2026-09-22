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
import Marquee from "@/components/motion/Marquee";
import VelocityMarquee from "@/components/motion/VelocityMarquee";

const MARQUEE_TOPICS = [
  "Kubernetes",
  "Terraform",
  "Azure",
  "CI/CD",
  "Docker",
  "Ansible",
  "GitHub Actions",
  "Monitoring",
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Stats />
        <Marquee items={MARQUEE_TOPICS} className="my-6" />
        <Skills />
        <Experience />
        <VelocityMarquee
          items={MARQUEE_TOPICS}
          className="my-6"
          baseDuration={30}
        />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
