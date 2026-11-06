import { MotionConfig } from 'framer-motion';
import { Mascot } from './components/layout/Mascot';
import { BackToTop } from './components/layout/BackToTop';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { useTheme } from './hooks/useTheme';
import { About } from './sections/About';
import { Achievements } from './sections/Achievements';
import { Contact } from './sections/Contact';
import { Education } from './sections/Education';
import { Experience } from './sections/Experience';
import { Hero } from './sections/Hero';
import { Leadership } from './sections/Leadership';
import { Photography } from './sections/Photography';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';
import { Sports } from './sections/Sports';
import { TravelMap } from './sections/TravelMap';

export default function App() {
  const { theme, toggle } = useTheme();
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain" aria-hidden />
      <Navbar theme={theme} onToggleTheme={toggle} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Education />
        <Skills />
        <Projects />
        <TravelMap />
        <Experience />
        <Leadership />
        <Photography />
        <Achievements />
        <Sports />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <Mascot />
    </MotionConfig>
  );
}
