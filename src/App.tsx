/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, 
  Wind, 
  Eye, 
  Scissors, 
  RefreshCw, 
  Ghost,
  Skull,
  Zap,
  Hammer,
  Bomb,
  CloudRain,
  FileText,
  Type,
  ArrowLeft,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Dadaist Fragment Pool (Portuguese)
const DADA_FRAGMENTS = [
  "O sol é uma gema de ovo frita no asfalto quente.",
  "A batata melancólica dança sob o submarino elétrico.",
  "Guarda-chuvas metafísicos protegem os pássaros de ferro.",
  "O grito do silêncio ecoa na máquina do tempo vazia.",
  "Peixes de vidro nadam em nuvens de pedra e fogo.",
  "A revolução do tédio começa com uma colher de sopa.",
  "Linhas de sombra cortam o volume do doce amargo.",
  "O relógio de pulso de Deus está quebrado e cheio de areia.",
  "Cuspa na lógica e coma o jornal de ontem com sal.",
  "A poesia é um par de sapatos velhos cheios de nada.",
  "Dada não significa nada mas explica tudo o que é falso.",
  "A arte é um vício farmacêutico para mentes quadradas.",
  "O pensamento é feito na boca enquanto o corpo dorme.",
  "A liberdade é o uivo das cores encrespadas no vácuo.",
  "Abolição da lógica na dança dos impotentes criativos.",
  "Tudo o que se olha é um erro de tradução do caos.",
  "Compre um piano e toque com os cotovelos sujos.",
  "A vida é uma farsa de mau gosto encenada por sombras.",
  "O vácuo tem fome de batatas e triângulos azuis.",
  "Máquinas de costura costuram o horizonte no mar.",
  "O alfabeto fugiu para a floresta de metal.",
  "Gritos de papel rasgam o céu de plástico.",
  "A lua é um queijo podre servido em prato de prata.",
  "Caminhe para trás para chegar ao amanhã de ontem."
];

const MANIFESTO_FRAGMENTS = [
  "Dada não significa nada.",
  "A arte é um vício farmacêutico.",
  "A lógica é sempre falsa.",
  "O pensamento é feito na boca.",
  "A liberdade: DADA DADA DADA!",
  "Abolição da lógica, dança dos impotentes.",
  "Tudo o que se olha é falso.",
  "Dada é a nossa intensidade.",
  "O novo artista protesta.",
  "A vida é uma farsa.",
  "O sol é uma gema de ovo.",
  "Cuspa na lógica."
];

const DADA_CLASSES = [
  "ruido-1", "ruido-2", "gritado", "fonemas", "esponja", 
  "palhaco", "navio", "rrrr", "nbaze", "coroa-alga", 
  "tesoura-efeito", "hiperbole"
];

interface FloatingFragment {
  id: string;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
  font: string;
  color: string;
}

interface StyledWord {
  text: string;
  className?: string;
}

const FONTS = ["font-sans", "font-serif", "font-mono", "font-black"];
const COLORS = ["bg-white", "bg-yellow-200", "bg-gray-200", "bg-red-100"];

export default function App() {
  const [view, setView] = useState<'editor' | 'result'>('editor');
  const [fragments, setFragments] = useState<FloatingFragment[]>([]);
  const [collectedFragments, setCollectedFragments] = useState<string[]>([]);
  const [poemVerses, setPoemVerses] = useState<StyledWord[][]>([]);
  const [chaosLevel, setChaosLevel] = useState(0);
  const [manifesto, setManifesto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [collageElements, setCollageElements] = useState<{id: number, type: string, x: number, y: number, r: number}[]>([]);

  // Initialize fragments and collage
  useEffect(() => {
    if (view === 'editor') {
      const initialFragments = Array.from({ length: 12 }).map(() => createFragment());
      setFragments(initialFragments);
      
      const initialCollage = Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        type: ["circle", "square", "line", "image"][Math.floor(Math.random() * 4)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: Math.random() * 360
      }));
      setCollageElements(initialCollage);
    }
  }, [view]);

  // Animation Loop
  useEffect(() => {
    if (view === 'editor') {
      const interval = setInterval(() => {
        setFragments(prev => prev.map(f => {
          let nx = f.x + f.vx;
          let ny = f.y + f.vy;
          let nvx = f.vx;
          let nvy = f.vy;

          if (nx < 0 || nx > 100) nvx *= -1;
          if (ny < 0 || ny > 100) nvy *= -1;

          return { ...f, x: nx, y: ny, vx: nvx, vy: nvy };
        }));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [chaosLevel, view]);

  function createFragment(text?: string): FloatingFragment {
    return {
      id: Math.random().toString(36).substr(2, 9),
      text: text || DADA_FRAGMENTS[Math.floor(Math.random() * DADA_FRAGMENTS.length)],
      x: Math.random() * 70 + 15,
      y: Math.random() * 70 + 15,
      vx: (Math.random() - 0.5) * (0.15 + chaosLevel / 300),
      vy: (Math.random() - 0.5) * (0.15 + chaosLevel / 300),
      rotation: (Math.random() - 0.5) * 20,
      scale: 0.8 + Math.random() * 0.4,
      font: FONTS[Math.floor(Math.random() * FONTS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
  }

  const collectFragment = (fragment: FloatingFragment) => {
    const newCollected = [...collectedFragments, fragment.text];
    setCollectedFragments(newCollected);
    setFragments(prev => prev.filter(f => f.id !== fragment.id));
    setChaosLevel(prev => Math.min(prev + 8, 100));
    
    generatePoem(newCollected);

    setTimeout(() => {
      setFragments(prev => [...prev, createFragment()]);
    }, 1000);

    if (Math.random() > 0.6) {
      confetti({
        particleCount: 20,
        spread: 80,
        origin: { x: Math.random(), y: Math.random() },
        colors: ['#000000', '#FF0000', '#FFFFFF']
      });
    }
  };

  const generatePoem = (allFragments: string[]) => {
    // Get ALL words from ALL fragments
    const wordPool = allFragments.flatMap(f => f.split(/\s+/).map(w => w.replace(/[.,]/g, "")));
    
    // Shuffle the pool to ensure randomness but keep all words
    const shuffledPool = [...wordPool].sort(() => Math.random() - 0.5);
    
    // Group into verses (paragraphs)
    const verses: StyledWord[][] = [];
    let currentVerse: StyledWord[] = [];
    
    shuffledPool.forEach((word, index) => {
      const shouldStyle = Math.random() > 0.7;
      const styledWord: StyledWord = {
        text: word,
        className: shouldStyle ? DADA_CLASSES[Math.floor(Math.random() * DADA_CLASSES.length)] : undefined
      };
      
      currentVerse.push(styledWord);
      
      // Randomly end verse or end at certain length
      if (currentVerse.length > 5 && (Math.random() > 0.7 || index === shuffledPool.length - 1)) {
        verses.push(currentVerse);
        currentVerse = [];
      }
    });

    if (currentVerse.length > 0) verses.push(currentVerse);
    setPoemVerses(verses);
  };

  const shakeBag = () => {
    setFragments(prev => [...prev, ...Array.from({ length: 5 }).map(() => createFragment())]);
    setChaosLevel(prev => Math.min(prev + 10, 100));
    setGlitch(true);
    setTimeout(() => setGlitch(false), 200);
    
    setCollageElements(prev => prev.map(el => ({
      ...el,
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 360
    })));
  };

  const clearAll = () => {
    setCollectedFragments([]);
    setPoemVerses([]);
    setChaosLevel(0);
    setManifesto(null);
  };

  const proclaim = () => {
    if (poemVerses.length === 0) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      const f1 = MANIFESTO_FRAGMENTS[Math.floor(Math.random() * MANIFESTO_FRAGMENTS.length)];
      const f2 = MANIFESTO_FRAGMENTS[Math.floor(Math.random() * MANIFESTO_FRAGMENTS.length)];
      setManifesto(`${f1} ${f2}`);
      setIsProcessing(false);
      setView('result');
      confetti({
        particleCount: 150,
        spread: 180,
        origin: { y: 0.5 },
        colors: ['#000000', '#FF0000', '#FFFFFF', '#FFFF00']
      });
    }, 1200);
  };

  const createAnother = () => {
    clearAll();
    setView('editor');
  };

  return (
    <div className={cn(
      "min-h-screen bg-[#f7f2e6] text-[#1a1a1a] font-sans selection:bg-black selection:text-white transition-all duration-1000 overflow-x-hidden",
      chaosLevel > 95 && view === 'editor' && "bg-[#000] text-white",
      glitch && "translate-x-4 -translate-y-4 scale-105 blur-[2px] invert"
    )}>
      {/* Background Collage Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-50" />
        {collageElements.map(el => (
          <div 
            key={el.id}
            className={cn(
              "absolute border-4 border-black mix-blend-multiply",
              el.type === "circle" && "rounded-full w-24 h-24 md:w-48 md:h-48 border-dotted",
              el.type === "square" && "w-32 h-32 md:w-64 md:h-64 border-double",
              el.type === "line" && "w-1 md:w-2 h-[120vh] bg-black/20",
              el.type === "image" && "w-36 h-48 md:w-72 md:h-96 bg-gray-300 grayscale border-none"
            )}
            style={{ 
              left: `${el.x}%`, 
              top: `${el.y}%`, 
              transform: `rotate(${el.r}deg)` 
            }}
          >
            {el.type === "image" && (
              <img 
                src={`https://picsum.photos/seed/${el.id + 100}/400/600?grayscale`} 
                className="w-full h-full object-cover opacity-40"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {view === 'editor' ? (
          <motion.div 
            key="editor"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="relative z-10"
          >
            {/* Header */}
            <header className="border-b-4 md:border-b-8 border-black p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none flex items-center gap-2 md:gap-4">
                  <Type className="w-8 h-8 md:w-12 md:h-12" />
                  DADA <span className="bg-red-600 text-white px-2 md:px-4 transform rotate-3">CLIP</span>
                </h1>
                <p className="text-xs sm:text-sm md:text-lg font-bold mt-2 md:mt-4 uppercase tracking-[0.2em] md:tracking-[0.4em] bg-black text-white px-2 inline-block">
                  Laboratório de Recortes Aleatórios // 1916
                </p>
              </div>
              
              <div className="mt-6 md:mt-0 flex flex-wrap gap-4 md:gap-8 items-center w-full md:w-auto">
                <div className="text-left md:text-right flex-1 md:flex-none">
                  <div className="text-[10px] md:text-xs font-black uppercase mb-1">Entropia do Sistema</div>
                  <div className="w-full md:w-64 h-6 md:h-8 border-2 md:border-4 border-black p-1 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <motion.div 
                      className="h-full bg-red-600" 
                      animate={{ width: `${chaosLevel}%` }}
                    />
                  </div>
                </div>
                <button 
                  onClick={shakeBag}
                  className="bg-white border-2 md:border-4 border-black p-2 md:p-4 hover:bg-black hover:text-white transition-all transform hover:-rotate-12 active:scale-75 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  <RefreshCw className="w-6 h-6 md:w-10 md:h-10" />
                </button>
              </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-200px)]">
              {/* The Fragment Field */}
              <section className="lg:col-span-8 border-b-4 lg:border-b-0 lg:border-r-8 border-black relative overflow-hidden bg-white/20 min-h-[400px] lg:min-h-0">
                <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 bg-black text-white px-2 md:px-4 py-1 font-black uppercase text-[10px] md:text-sm italic">
                  Campo de Recortes: Clique para coletar fragmentos
                </div>

                <AnimatePresence>
                  {fragments.map((frag) => (
                    <motion.button
                      key={frag.id}
                      initial={{ opacity: 0, y: 100, rotate: 45 }}
                      animate={{ 
                        opacity: 1, 
                        scale: frag.scale,
                        left: `${frag.x}%`,
                        top: `${frag.y}%`,
                        rotate: frag.rotation,
                      }}
                      exit={{ opacity: 0, scale: 0, rotate: 360, filter: "brightness(2)" }}
                      whileHover={{ 
                        scale: frag.scale * 1.1, 
                        zIndex: 100,
                        rotate: 0,
                        boxShadow: "10px 10px 0px 0px rgba(255,0,0,1)"
                      }}
                      onClick={() => collectFragment(frag)}
                      className={cn(
                        "absolute p-2 md:p-6 border-2 md:border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer max-w-[150px] md:max-w-xs text-left",
                        frag.color,
                        frag.font,
                        "before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] before:opacity-20"
                      )}
                    >
                      <div className="flex items-start gap-1 md:gap-2">
                        <FileText className="w-3 h-3 md:w-5 md:h-5 mt-1 flex-shrink-0 opacity-50" />
                        <span className="text-xs md:text-xl font-black leading-tight uppercase">{frag.text}</span>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>

                <div className="absolute top-1/4 right-10 opacity-5 md:opacity-10"><Zap className="w-24 h-24 md:w-48 md:h-48" /></div>
                <div className="absolute bottom-1/4 left-10 opacity-5 md:opacity-10"><Hammer className="w-24 h-24 md:w-48 md:h-48" /></div>
                <div className="absolute bottom-10 right-1/4 opacity-5 md:opacity-10"><Bomb className="w-24 h-24 md:w-48 md:h-48" /></div>
              </section>

              {/* The Poem Assembler (Preview) */}
              <section className="lg:col-span-4 flex flex-col bg-white lg:border-l-8 border-black">
                <div className="p-6 md:p-10 bg-red-600 text-white border-b-4 md:border-b-8 border-black">
                  <h2 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-4 md:gap-6 italic">
                    <Scissors className="w-6 h-6 md:w-10 md:h-10" />
                    PREVISÃO
                  </h2>
                </div>

                <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#F0F0F0] relative min-h-[200px]">
                  {poemVerses.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4 md:space-y-6">
                      <CloudRain className="w-16 h-16 md:w-32 md:h-32" />
                      <p className="text-xl md:text-3xl font-black uppercase leading-none tracking-tighter">
                        A MÁQUINA <br/> AGUARDA <br/> MATÉRIA-PRIMA
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 opacity-60">
                      {poemVerses.map((verse, i) => (
                        <p key={i} className="flex flex-wrap gap-1">
                          {verse.map((word, j) => (
                            <span key={j} className={cn("text-[10px] md:text-xs font-black uppercase", word.className)}>
                              {word.text}
                            </span>
                          ))}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="p-6 md:p-10 border-t-4 md:border-t-8 border-black bg-white space-y-4 md:space-y-6">
                  <button
                    onClick={proclaim}
                    disabled={poemVerses.length === 0 || isProcessing}
                    className="w-full flex items-center justify-center gap-4 md:gap-6 border-4 md:border-8 border-black bg-black text-white p-4 md:p-8 text-xl md:text-3xl font-black uppercase hover:bg-red-600 hover:scale-105 transition-all disabled:opacity-20 active:translate-y-2 md:active:translate-y-4 shadow-[6px_6px_0px_0px_rgba(255,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(255,0,0,1)]"
                  >
                    {isProcessing ? <RefreshCw className="w-6 h-6 md:w-10 md:h-10 animate-spin" /> : <Zap className="w-6 h-6 md:w-10 md:h-10 text-yellow-400" />}
                    PROCLAMAR
                  </button>
                  
                  <button
                    onClick={clearAll}
                    disabled={collectedFragments.length === 0}
                    className="w-full flex items-center justify-center gap-2 md:gap-4 border-2 md:border-4 border-black p-2 md:p-4 text-sm md:text-xl font-black uppercase hover:bg-white hover:text-red-600 transition-all disabled:opacity-20"
                  >
                    <Trash2 className="w-4 h-4 md:w-6 md:h-6" />
                    ANIQUILAR
                  </button>
                </div>
              </section>
            </main>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="relative z-50 min-h-screen flex flex-col items-center py-10 md:py-20 px-4 md:px-10 overflow-y-auto"
          >
            {/* Controls Overlay */}
            <div className="fixed top-4 right-4 md:top-10 md:right-10 flex flex-col sm:flex-row gap-2 md:gap-4 z-[100]">
              <button 
                onClick={createAnother}
                className="flex items-center justify-center gap-2 md:gap-4 border-2 md:border-4 border-black bg-black text-white px-4 py-2 md:px-6 md:py-3 text-xs md:text-base font-black uppercase hover:bg-red-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <Plus className="w-4 h-4 md:w-6 md:h-6" />
                CRIAR NOVO
              </button>
              <button 
                onClick={() => setView('editor')}
                className="flex items-center justify-center gap-2 md:gap-4 border-2 md:border-4 border-black bg-white text-black px-4 py-2 md:px-6 md:py-3 text-xs md:text-base font-black uppercase hover:bg-gray-200 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <ArrowLeft className="w-4 h-4 md:w-6 md:h-6" />
                VOLTAR
              </button>
            </div>

            {/* The Dadaist Poem Container */}
            <div className="poema-container mt-20 md:mt-0">
              <h1 className="transform -rotate-1">
                MANIFESTO DO <br/> ACASO TROPICAL
              </h1>

              {poemVerses.map((verse, i) => (
                <p key={i}>
                  {verse.map((word, j) => (
                    <React.Fragment key={j}>
                      {word.className ? (
                        <span className={word.className}>{word.text}</span>
                      ) : (
                        word.text
                      )}
                      {" "}
                    </React.Fragment>
                  ))}
                </p>
              ))}

              <hr />

              <div className="grito-leitor">
                {manifesto}
              </div>

              <div className="assinatura-visual">
                <span>⚡ DADA ⚡</span> {new Date().getFullYear()} … <span style={{background:'#c09c7a'}}>TZANTZANTZA</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticker */}
      <footer className="fixed bottom-0 left-0 right-0 h-12 md:h-16 border-t-4 md:border-t-8 border-black bg-black text-white flex items-center overflow-hidden z-[60]">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="mx-8 md:mx-16 font-black text-lg md:text-2xl uppercase italic tracking-tighter">
              DADA NÃO É ARTE // DADA É TUDO // DADA É NADA // MORTE À LÓGICA // VIVA O ACASO // 
            </span>
          ))}
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        
        /* Dadaist Styles from Example */
        .poema-container {
            max-width: 780px;
            width: 100%;
            background: rgba(250, 245, 235, 0.85);
            backdrop-filter: blur(1px);
            border: 4px solid #2b2b2b;
            box-shadow: 15px 15px 0 rgba(0,0,0,0.15), inset 0 0 0 2px #e4d5c0;
            padding: 1.5rem 1rem;
            position: relative;
            transition: all 0.2s ease;
            word-wrap: break-word;
            margin: 0 auto;
        }
        @media (min-width: 768px) {
            .poema-container {
                padding: 3rem 2.5rem;
            }
        }

        .poema-container::before {
            content: "";
            position: absolute;
            top: -10px; left: -10px;
            width: 60px; height: 60px;
            background: radial-gradient(circle, rgba(220,190,160,0.4) 0%, transparent 70%);
            mix-blend-mode: multiply;
            pointer-events: none;
            z-index: 1;
        }
        @media (min-width: 768px) {
            .poema-container::before {
                width: 120px; height: 120px;
            }
        }

        .poema-container::after {
            content: "⚡⚡⚡";
            position: absolute;
            bottom: 10px; right: 15px;
            font-size: 1.2rem;
            color: #b34141;
            opacity: 0.2;
            font-family: 'Impact', fantasy;
            transform: rotate(8deg);
            letter-spacing: -2px;
        }
        @media (min-width: 768px) {
            .poema-container::after {
                bottom: 20px; right: 25px;
                font-size: 2.2rem;
                letter-spacing: -4px;
            }
        }

        .poema-container h1 {
            font-size: 1.8rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: -0.02em;
            line-height: 1;
            color: #e0dcd0;
            background-color: #3d2e22;
            display: inline-block;
            padding: 0.4rem 1rem 0.6rem 0.6rem;
            margin: 0 0 2rem -1rem;
            border: 3px solid #1e1a16;
            box-shadow: 6px 6px 0 #aa9f91;
            text-shadow: 1px 1px 0 #734c3b, 2px 2px 0 #a77b5f;
            word-break: break-word;
            font-family: 'Arial Black', 'Franklin Gothic Heavy', sans-serif;
        }
        @media (min-width: 768px) {
            .poema-container h1 {
                font-size: 3.2rem;
                padding: 0.5rem 1.8rem 0.8rem 0.8rem;
                margin: 0 0 3rem -2rem;
                border: 5px solid #1e1a16;
                box-shadow: 12px 12px 0 #aa9f91;
                text-shadow: 2px 2px 0 #734c3b, 4px 4px 0 #a77b5f;
            }
        }

        .poema-container p {
            font-size: 1rem;
            margin-bottom: 1.5rem;
            position: relative;
            z-index: 5;
            font-family: 'Courier New', monospace;
            background: rgba(255, 255, 240, 0.3);
            padding: 0.4rem 0.2rem 0.4rem 0.8rem;
            border-left: 8px solid #6b4f3a;
            border-bottom: 1px dashed #bbaa99;
            transition: 0.1s linear;
            text-transform: lowercase;
        }
        @media (min-width: 768px) {
            .poema-container p {
                font-size: 1.3rem;
                margin-bottom: 2.2rem;
                padding: 0.6rem 0.2rem 0.6rem 1.2rem;
                border-left: 12px solid #6b4f3a;
                border-bottom: 2px dashed #bbaa99;
            }
        }

        .ruido-1 {
            font-family: 'Impact', 'Arial Black', sans-serif;
            font-size: 1.2rem;
            color: #b64545;
            text-transform: uppercase;
            display: inline-block;
            background: #c8c8a0;
            padding: 0 0.3rem;
            border: 2px dotted #2c2c2c;
            transform: scale(1.02) rotate(-1deg);
            margin: 0 0.1rem;
        }
        @media (min-width: 768px) {
            .ruido-1 {
                font-size: 2rem;
                padding: 0 0.5rem;
                border: 4px dotted #2c2c2c;
                margin: 0 0.2rem;
            }
        }

        .ruido-2 {
            font-family: 'Georgia', serif;
            font-size: 1rem;
            font-style: italic;
            background: #d1c7b3;
            padding: 0.1rem 0.4rem;
            border: 2px solid #987b5b;
            box-shadow: inset 0 0 0 1px #efefd0;
            color: #2e1f15;
        }
        @media (min-width: 768px) {
            .ruido-2 {
                font-size: 1.5rem;
                padding: 0.2rem 0.6rem;
                border: 3px solid #987b5b;
                box-shadow: inset 0 0 0 2px #efefd0;
            }
        }

        .gritado {
            font-weight: 900;
            font-size: 1.4rem;
            letter-spacing: 0.1rem;
            background: #fde9c9;
            color: #b32e2e;
            text-decoration: wavy underline #a55 1px;
            text-transform: uppercase;
            display: inline-block;
            transform: rotate(0.5deg);
            padding: 0 0.2rem;
            border-radius: 30% 10% 30% 10%;
        }
        @media (min-width: 768px) {
            .gritado {
                font-size: 2.4rem;
                letter-spacing: 0.2rem;
                text-decoration: wavy underline #a55 2px;
                padding: 0 0.3rem;
            }
        }

        .fonemas {
            font-family: 'Brush Script MT', cursive, sans-serif;
            font-size: 1.6rem;
            font-weight: 100;
            background: #eddbbf;
            display: inline-block;
            padding: 0 0.5rem;
            border: 3px double #401010;
            color: #1d0f0f;
            word-break: break-all;
            box-shadow: -4px 4px 0 #aaaaaa;
            margin: 0.3rem 0;
            line-height: 1.2;
        }
        @media (min-width: 768px) {
            .fonemas {
                font-size: 2.8rem;
                padding: 0 1rem;
                border: 6px double #401010;
                box-shadow: -7px 7px 0 #aaaaaa;
                margin: 0.5rem 0;
                line-height: 1.3;
            }
        }

        .esponja {
            background: #2d2d2d;
            color: #faf2cf;
            font-family: 'Stencil Two', fantasy;
            font-size: 1.4rem;
            padding: 0.2rem 0.6rem;
            border-radius: 100px 10px 100px 10px;
            border: 2px solid #bc8f4b;
            display: inline-block;
            transform: skewX(-5deg);
        }
        @media (min-width: 768px) {
            .esponja {
                font-size: 2.3rem;
                padding: 0.3rem 1rem;
                border-radius: 200px 20px 200px 20px;
                border: 3px solid #bc8f4b;
            }
        }

        .palhaco {
            background: repeating-linear-gradient(45deg, #f0d0a0, #f0d0a0 5px, #c0b090 5px, #c0b090 10px);
            color: #101418;
            font-size: 1.2rem;
            font-weight: bold;
            padding: 0.1rem 0.6rem;
            border: 3px dashed #c24f4f;
            font-family: 'Comic Sans MS', cursive, sans-serif;
            text-shadow: 1px 1px 0 #b5b5b5;
        }
        @media (min-width: 768px) {
            .palhaco {
                background: repeating-linear-gradient(45deg, #f0d0a0, #f0d0a0 10px, #c0b090 10px, #c0b090 20px);
                font-size: 1.9rem;
                padding: 0.2rem 1rem;
                border: 5px dashed #c24f4f;
                text-shadow: 2px 2px 0 #b5b5b5;
            }
        }

        .navio {
            font-size: 1.5rem;
            background: #596673;
            color: #f4e9d2;
            padding: 0 0.5rem;
            border: 3px ridge #121212;
            font-family: 'Arial Narrow', sans-serif;
            text-transform: lowercase;
        }
        @media (min-width: 768px) {
            .navio {
                font-size: 2.5rem;
                padding: 0 0.8rem;
                border: 6px ridge #121212;
            }
        }

        .rrrr {
            font-size: 2rem;
            font-weight: 900;
            color: #6e2323;
            background: #c2b59b;
            display: inline-block;
            padding: 0.2rem 0.5rem 0rem 0.5rem;
            letter-spacing: 10px;
            border: 5px double #402020;
            line-height: 1;
            margin: 0.2rem 0;
            word-break: break-all;
        }
        @media (min-width: 768px) {
            .rrrr {
                font-size: 4rem;
                padding: 0.4rem 1rem 0rem 1rem;
                letter-spacing: 25px;
                border: 10px double #402020;
                margin: 0.3rem 0;
            }
        }

        .nbaze {
            font-family: 'Courier New', monospace;
            font-size: 1.8rem;
            background: #3e3229;
            color: #f1e1b0;
            padding: 0.1rem 0.6rem;
            border-left: 10px solid #b5835a;
            border-right: 10px solid #b5835a;
            display: inline-block;
            transform: rotate(0.7deg);
        }
        @media (min-width: 768px) {
            .nbaze {
                font-size: 3.5rem;
                padding: 0.2rem 1.2rem;
                border-left: 20px solid #b5835a;
                border-right: 20px solid #b5835a;
            }
        }

        .coroa-alga {
            background: radial-gradient(circle at 30% 30%, #e2c87b, #26735c);
            color: #ffefc0;
            font-size: 1.4rem;
            font-style: oblique;
            padding: 0 1rem;
            border: 2px dotted #d4d49b;
            text-shadow: -1px -1px 0 #2f543b;
            display: inline-block;
        }
        @media (min-width: 768px) {
            .coroa-alga {
                font-size: 2.2rem;
                padding: 0 2rem;
                border: 3px dotted #d4d49b;
                text-shadow: -2px -2px 0 #2f543b;
            }
        }

        .grito-leitor {
            background: #300;
            color: #fdb;
            font-size: 1.2rem;
            font-family: 'Verdana', sans-serif;
            font-weight: 900;
            padding: 0.4rem 0.6rem;
            border: 4px solid #a55;
            outline: 2px solid #daa;
            transform: rotate(-2deg) scale(1.02);
            box-shadow: 0 0 0 3px #fcd492;
            margin: 0.8rem 0;
            text-transform: uppercase;
        }
        @media (min-width: 768px) {
            .grito-leitor {
                font-size: 2.2rem;
                padding: 0.6rem 1rem;
                border: 8px solid #a55;
                outline: 4px solid #daa;
                box-shadow: 0 0 0 6px #fcd492;
                margin: 1rem 0;
            }
        }

        .tesoura-efeito {
            font-size: 1.5rem;
            background: #ae7f6b;
            color: #ebdbca;
            padding: 0.2rem 0.6rem;
            border: 3px solid #a53a3a;
            border-style: groove dashed dashed groove;
            font-family: 'Impact', fantasy;
            text-decoration: line-through double #fa0;
            word-break: break-all;
        }
        @media (min-width: 768px) {
            .tesoura-efeito {
                font-size: 2.7rem;
                padding: 0.3rem 1rem;
                border: 5px solid #a53a3a;
            }
        }

        .hiperbole {
            background: #e1d9c0;
            color: #041f33;
            font-size: 1.2rem;
            border: 4px solid #384e4e;
            border-top: 10px solid #545454;
            padding: 0.6rem;
            font-family: 'Times', serif;
            transform: skewX(3deg);
        }
        @media (min-width: 768px) {
            .hiperbole {
                font-size: 1.9rem;
                border: 8px solid #384e4e;
                border-top: 20px solid #545454;
                padding: 1rem;
            }
        }

        .assinatura-visual {
            margin-top: 2rem;
            text-align: right;
            font-size: 1rem;
            border-top: 4px double #6b4f3a;
            padding-top: 1rem;
            font-family: 'Courier New', monospace;
            background: #fffbe6;
            color: #2d2d2d;
            padding: 0.8rem;
            border-right: 8px solid #ab8b71;
            transform: rotate(-0.3deg);
        }
        @media (min-width: 768px) {
            .assinatura-visual {
                margin-top: 4rem;
                font-size: 1.5rem;
                border-top: 7px double #6b4f3a;
                padding-top: 2rem;
                padding: 1.2rem;
                border-right: 12px solid #ab8b71;
            }
        }
        .assinatura-visual span {
            background: black;
            color: white;
            padding: 0.1rem 0.4rem;
            font-size: 1.4rem;
        }
        @media (min-width: 768px) {
            .assinatura-visual span {
                padding: 0.2rem 0.8rem;
                font-size: 2.8rem;
            }
        }

        hr {
            border: none;
            border-top: 6px dotted #9a897a;
            margin: 1.5rem 0;
        }
        @media (min-width: 768px) {
            hr {
                border-top: 12px dotted #9a897a;
                margin: 2rem 0;
            }
        }
      `}} />
    </div>
  );
}
