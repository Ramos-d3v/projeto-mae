import { useState, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// --- Constants & Assets ---
const IMAGES = import.meta.glob('./assets/*.{png,jpg,jpeg,svg}', { eager: true });
const IMAGE_PATHS = Object.values(IMAGES).map((mod) => mod.default || mod);

// Reduce hearts for mobile performance
const HEARTS = [...Array(12)].map((_, i) => ({
  id: i,
  x: Math.random() * 100 + "%",
  scale: Math.random() * 0.4 + 0.4,
  rotate: Math.random() * 360,
  duration: Math.random() * 4 + 4,
  delay: Math.random() * 8
}));

// --- Sub-Components ---

const Background = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
  </div>
);

const Hero = ({ scrollYProgress }) => {
  const opacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.12], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.12], [0, -50]);
  
  // Use a transform to completely hide the element when it's not needed
  const pointerEvents = useTransform(scrollYProgress, p => p > 0.1 ? 'none' : 'auto');
  const zIndex = useTransform(scrollYProgress, p => p > 0.1 ? -1 : 10);

  return (
    <motion.section 
      style={{ opacity, scale, y, pointerEvents, zIndex }}
      className="fixed inset-0 flex flex-col items-center justify-center text-center px-4"
    >
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 pb-4"
      >
        Feliz Dia das Mães
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-slate-400 text-lg md:text-xl max-w-lg"
      >
        Uma homenagem especial para a pessoa mais importante da minha vida.
      </motion.p>
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10"
      >
        <div className="w-6 h-10 border-2 border-slate-700 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-pink-500 rounded-full" />
        </div>
      </motion.div>
    </motion.section>
  );
};

const ScrollingMessages = ({ scrollYProgress }) => {
  const t1Opacity = useTransform(scrollYProgress, [0.15, 0.22, 0.30], [0, 1, 0]);
  const t1Y = useTransform(scrollYProgress, [0.15, 0.22, 0.30], [40, 0, -40]);

  const t2Opacity = useTransform(scrollYProgress, [0.35, 0.42, 0.50], [0, 1, 0]);
  const t2Y = useTransform(scrollYProgress, [0.35, 0.42, 0.50], [40, 0, -40]);

  const t3Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.75], [0, 1, 0]);
  const t3Scale = useTransform(scrollYProgress, [0.55, 0.65], [0.8, 1]);

  return (
    <div className="relative h-[250vh]">
      <motion.div style={{ opacity: t1Opacity, y: t1Y }} className="fixed inset-0 flex items-center justify-center pointer-events-none z-20">
        <h2 className="text-4xl md:text-7xl font-bold text-pink-200 text-center px-6">Você é a base da nossa família.</h2>
      </motion.div>
      <motion.div style={{ opacity: t2Opacity, y: t2Y }} className="fixed inset-0 flex items-center justify-center pointer-events-none z-20">
        <h2 className="text-4xl md:text-7xl font-bold text-indigo-200 text-center px-6">A minha base.</h2>
      </motion.div>
      <motion.div style={{ opacity: t3Opacity, scale: t3Scale }} className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
        <h2 className="text-5xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 text-center px-6">O meu maior exemplo.</h2>
        <p className="mt-8 text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto italic text-center px-8">"Obrigado por ser tudo o que eu precisava, mesmo quando eu não sabia que precisava."</p>
      </motion.div>
    </div>
  );
};

const PhotoGallery = () => {
  const memoizedImages = useMemo(() => IMAGE_PATHS, []);
  
  return (
    <section className="py-24 px-4 md:px-20 bg-slate-900/30 relative z-30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-indigo-200">Nossos Momentos</h2>
        <div className="columns-2 lg:columns-3 gap-4 space-y-4">
          {memoizedImages.map((path, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              transition={{ duration: 0.5, delay: (index % 3) * 0.05 }} 
              viewport={{ once: true, margin: "100px" }} 
              className="break-inside-avoid rounded-2xl overflow-hidden border border-white/5 bg-slate-800/50 group"
            >
              <img 
                src={path} 
                alt={`Momento ${index + 1}`} 
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" 
                loading="lazy" 
                decoding="async"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LoveLetter = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section className="py-32 flex flex-col items-center justify-center bg-slate-950 px-4 relative z-30">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-pink-200">Uma surpresa para você...</h2>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsOpen(!isOpen)} className="cursor-pointer relative z-40">
        <div className="w-64 h-44 bg-pink-100 rounded-lg shadow-2xl flex items-center justify-center border-b-4 border-pink-200 relative overflow-hidden">
          <span className="text-pink-500 text-6xl drop-shadow-md">💌</span>
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-4 text-pink-400 text-xs font-bold">CLIQUE PARA ABRIR</motion.div>
        </div>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 50 }} className="mt-12 p-10 bg-white text-slate-800 rounded-2xl shadow-2xl max-w-lg font-serif text-xl leading-relaxed relative z-40 border-t-8 border-pink-400">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl">💝</div>
            <p className="mb-6 italic text-pink-600 font-bold">Querida Mãe,</p>
            <p className="mb-6">Neste dia tão especial, as palavras parecem poucas para expressar tudo o que sinto. Você não é apenas minha mãe; você é meu porto seguro, minha maior inspiração e o coração que mantém nossa família unida.</p>
            <p className="mb-6">Obrigado por cada sacrifício, por cada palavra de incentivo e por me ensinar que o amor é a base de tudo.</p>
            <p>Com todo o meu amor,</p>
            <p className="font-bold text-pink-600 mt-4 text-2xl">Para sempre, seu maior fã.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const FinalSection = () => (
  <section className="h-[100vh] flex items-center justify-center relative overflow-hidden z-30">
    <div className="text-center z-10">
      <h3 className="text-4xl md:text-6xl font-light text-pink-100 mb-8 tracking-widest uppercase">Te amo, Mãe!</h3>
      <div className="w-48 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent mx-auto" />
    </div>
    <div className="absolute inset-0 pointer-events-none">
      {HEARTS.map((heart) => (
        <motion.div key={heart.id} initial={{ x: heart.x, y: "110%", opacity: 0, scale: heart.scale }} animate={{ y: "-10%", opacity: [0, 0.7, 0], rotate: heart.rotate }} transition={{ duration: heart.duration, repeat: Infinity, delay: heart.delay }} className="absolute text-pink-500/20 text-3xl">❤️</motion.div>
      ))}
    </div>
  </section>
);

// --- Main App ---

export default function App() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-[300vh] bg-slate-950 text-white selection:bg-pink-500/30 font-sans antialiased overflow-x-hidden">
      <Background />
      <Hero scrollYProgress={scrollYProgress} />
      <ScrollingMessages scrollYProgress={scrollYProgress} />
      <PhotoGallery />
      <LoveLetter />
      <FinalSection />
    </div>
  );
}
