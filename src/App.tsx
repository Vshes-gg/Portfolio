import React, { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'motion/react';
import { Sun, Moon, Menu, X, ArrowUpRight, Github, Linkedin, Twitter, Mail } from 'lucide-react';

// --- Hooks ---
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    } catch (e) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // Ignore localStorage errors in restricted iframes
    }
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return { theme, toggleTheme };
};

// --- Components ---
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-indigo-500 rounded-full pointer-events-none z-50 hidden md:block"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50 hidden md:block border border-gray-300 dark:border-gray-700 transition-colors duration-300"
        animate={{
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          backgroundColor: isHovering ? 'rgba(99, 102, 241, 0.05)' : 'rgba(0,0,0,0)'
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ x: cursorXSpring, y: cursorYSpring, translateX: '-50%', translateY: '-50%' }}
      />
    </>
  );
};

const Typewriter = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.04,
            delayChildren: delay,
          }
        }
      }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string, key?: React.Key }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Navbar = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 w-full z-40 backdrop-blur-md bg-gray-50/80 dark:bg-[#0D0D0F]/80 border-b border-gray-200/50 dark:border-gray-800/50 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">Bishes Gurung</a>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
          <a href="#about" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">About</a>
          <a href="#skills" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Skills</a>
          <a href="#projects" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Projects</a>
          <a href="#contact" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Contact</a>
          
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        
        <button className="md:hidden p-2 text-gray-900 dark:text-gray-100" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-50 dark:bg-[#0D0D0F] border-b border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
              <a href="#about" onClick={() => setIsOpen(false)} className="hover:text-indigo-500 transition-colors">About</a>
              <a href="#skills" onClick={() => setIsOpen(false)} className="hover:text-indigo-500 transition-colors">Skills</a>
              <a href="#projects" onClick={() => setIsOpen(false)} className="hover:text-indigo-500 transition-colors">Projects</a>
              <a href="#contact" onClick={() => setIsOpen(false)} className="hover:text-indigo-500 transition-colors">Contact</a>
              <button onClick={() => { toggleTheme(); setIsOpen(false); }} className="flex items-center gap-2 py-2 hover:text-indigo-500 transition-colors">
                {theme === 'dark' ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center pt-16 px-6">
      <div className="max-w-5xl mx-auto w-full">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 leading-tight mb-6">
            <Typewriter text="Bishes Gurung." delay={0.2} />
            <br />
            <span className="text-gray-500 dark:text-gray-400">
              <Typewriter text="AI Engineer & Systems Architect." delay={1.2} />
            </span>
          </h1>
          <FadeIn delay={2.5}>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mb-10">
              I build intelligent, scalable machine learning models and precision-engineered software systems. Focused on deep neural networks, agentic workflows, and deploying AI to solve complex problems.
            </p>
            <a href="#projects" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-indigo-500 dark:hover:bg-indigo-500 hover:text-white transition-colors duration-300">
              View Projects <ArrowUpRight size={18} />
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-sm font-semibold tracking-widest text-indigo-500 uppercase mb-6">About</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <h3 className="text-2xl md:text-3xl font-medium leading-snug text-gray-900 dark:text-gray-100">
              Bridging the gap between cutting-edge research and production-ready systems.
            </h3>
            <div className="text-gray-600 dark:text-gray-400 space-y-6 leading-relaxed">
              <p>
                As an AI Engineer, my focus lies in translating complex machine learning concepts into robust, scalable applications. I believe that the best AI solutions are those that operate seamlessly in the background, empowering users without overwhelming them.
              </p>
              <p>
                My approach combines rigorous data science methodologies with modern software engineering practices, ensuring that every model deployed is not only accurate but also performant and maintainable.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const Skills = () => {
  const skills = [
    "Python", "PyTorch", "TensorFlow", "Large Language Models", 
    "RAG Architectures", "Computer Vision", "Data Engineering", 
    "TypeScript", "React", "Node.js", "Docker", "AWS / GCP"
  ];

  return (
    <section id="skills" className="py-24 px-6 bg-white dark:bg-[#121214] border-y border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-sm font-semibold tracking-widest text-indigo-500 uppercase mb-8">Technical Arsenal</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <span 
                key={index}
                className="skill-tag px-4 py-2 bg-gray-50 dark:bg-[#0D0D0F] border border-gray-200 dark:border-gray-800 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "Autonomous Research Agent",
      description: "A multi-agent system powered by LLMs that autonomously gathers, synthesizes, and formats research papers into comprehensive literature reviews.",
      tags: ["Python", "LangChain", "OpenAI API", "Vector DB"],
      link: "#"
    },
    {
      title: "Predictive Maintenance Engine",
      description: "End-to-end machine learning pipeline for predicting equipment failure in manufacturing, reducing downtime by 35%.",
      tags: ["PyTorch", "Time Series", "FastAPI", "Docker"],
      link: "#"
    },
    {
      title: "Semantic Search Platform",
      description: "High-performance enterprise search engine utilizing dense vector embeddings and hybrid search techniques.",
      tags: ["Elasticsearch", "Transformers", "React", "Node.js"],
      link: "#"
    },
    {
      title: "Vision-Language Interface",
      description: "Multimodal interface allowing users to query and analyze complex visual data using natural language commands.",
      tags: ["Computer Vision", "CLIP", "React", "WebSockets"],
      link: "#"
    }
  ];

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-sm font-semibold tracking-widest text-indigo-500 uppercase mb-12">Selected Works</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <a href={project.link} className="group block h-full">
                <div className="h-full p-8 bg-white dark:bg-[#121214] border border-gray-200 dark:border-gray-800 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-md dark:shadow-none">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-500 transition-colors">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="text-gray-400 group-hover:text-indigo-500 transition-colors" size={20} />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-32 px-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121214]">
      <div className="max-w-5xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
            Let's build the future.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto">
            Currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
          <a href="mailto:bishes16grg@gmail.com" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors duration-300">
            <Mail size={18} /> Say Hello
          </a>
          
          <div className="flex justify-center gap-6 mt-16">
            <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"><Github size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"><Linkedin size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"><Twitter size={24} /></a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0F] text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500/30">
      <CustomCursor />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
      </main>
      
      <Contact />
      
      <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-500 bg-white dark:bg-[#121214]">
        <p>© {new Date().getFullYear()} Bishes Gurung. All rights reserved.</p>
      </footer>
    </div>
  );
}
