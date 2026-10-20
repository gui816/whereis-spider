import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles, Heart, Download } from 'lucide-react';

type Spot = { id: string; label: string; emoji: string };
const spots: Spot[] = [
  { id: 'leaf', label: 'folha', emoji: '🍃' },
  { id: 'flower', label: 'flor', emoji: '🌼' },
  { id: 'rock', label: 'pedra', emoji: '🪨' },
  { id: 'mushroom', label: 'cogumelo', emoji: '🍄' },
  { id: 'bush', label: 'arbusto', emoji: '🌿' },
  { id: 'log', label: 'tronco', emoji: '🪵' },
  { id: 'acorn', label: 'bolota', emoji: '🌰' },
  { id: 'cactus', label: 'cato', emoji: '🌵' },
  { id: 'apple', label: 'maçã', emoji: '🍎' },
  { id: 'tulip', label: 'tulipa', emoji: '🌷' },
  { id: 'moss', label: 'trevo', emoji: '☘️' },
  { id: 'berry', label: 'frutos', emoji: '🫐' },
  { id: 'pine', label: 'pinheiro', emoji: '🌲' },
  { id: 'puddle', label: 'poça', emoji: '💧' },
  { id: 'nest', label: 'ninho', emoji: '🪺' },
  { id: 'sunflower', label: 'girassol', emoji: '🌻' }
];
const positions = [
  { left: 14, top: 34 }, { left: 38, top: 34 }, { left: 62, top: 34 }, { left: 86, top: 34 },
  { left: 14, top: 50 }, { left: 38, top: 50 }, { left: 62, top: 50 }, { left: 86, top: 50 },
  { left: 14, top: 66 }, { left: 38, top: 66 }, { left: 62, top: 66 }, { left: 86, top: 66 },
  { left: 14, top: 82 }, { left: 38, top: 82 }, { left: 62, top: 82 }, { left: 86, top: 82 }
];
const levelSettings = [
  { count: 6, visibleMs: 3000 },
  { count: 8, visibleMs: 2500 },
  { count: 10, visibleMs: 2000 },
  { count: 12, visibleMs: 1500 },
  { count: 14, visibleMs: 1200 },
  { count: 16, visibleMs: 1000 }
];
const getLevelSettings = (level: number) => levelSettings[Math.min(level - 1, levelSettings.length - 1)] ?? { count: 16, visibleMs: Math.max(450, 1000 - (level - 6) * 100) };

function SpiderArt() {
  return <div className="spider-body"><span className="spider-eye eye-left"><i /></span><span className="spider-eye eye-right"><i /></span><span className="spider-smile" /><span className="spider-blush blush-left" /><span className="spider-blush blush-right" /></div>;
}

export default function App() {
  const [level, setLevel] = useState(1);
  const [roundId, setRoundId] = useState(0);
  const [target, setTarget] = useState(() => Math.floor(Math.random() * getLevelSettings(1).count));
  const [previewing, setPreviewing] = useState(true);
  const [found, setFound] = useState(false);
  const [taps, setTaps] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [message, setMessage] = useState('A aranha está escondida. Vamos procurá-la!');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const handlePrompt = (event: Event) => { event.preventDefault(); setInstallPrompt(event); };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  useEffect(() => {
    if (!previewing || found) return;
    const timer = window.setTimeout(() => {
      setPreviewing(false);
      setMessage('Onde se escondeu? Toca no objeto certo!');
      tone(660, 0.12);
    }, getLevelSettings(level).visibleMs);
    return () => window.clearTimeout(timer);
  }, [roundId, level, previewing, found]);

  const tone = (frequency: number, duration = 0.13, wave: OscillatorType = 'sine', volume = 0.075) => {
    if (!soundOn) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      audioRef.current ??= new AudioCtx();
      const ctx = audioRef.current;
      if (ctx.state === 'suspended') void ctx.resume();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = wave;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      oscillator.connect(gain); gain.connect(ctx.destination);
      oscillator.start(); oscillator.stop(ctx.currentTime + duration + 0.025);
    } catch { /* Sound is optional; the game remains playable without it. */ }
  };

  const speak = (text: string) => {
    if (!soundOn || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const voice = new SpeechSynthesisUtterance(text);
      voice.lang = 'pt-PT'; voice.rate = 0.82; voice.pitch = 1.16; voice.volume = 0.85;
      window.speechSynthesis.speak(voice);
    } catch { /* Voice depends on browser/device support. */ }
  };

  const celebrate = () => {
    tone(523, 0.15); window.setTimeout(() => tone(659, 0.15), 120); window.setTimeout(() => tone(784, 0.24), 240);
    window.setTimeout(() => speak('Encontraste a aranha! Muito bem!'), 350);
  };

  const tapSpot = (index: number) => {
    if (found || previewing) return;
    const attempt = taps + 1;
    setTaps(attempt);
    if (index === target) {
      setFound(true); setShowHint(false); setMessage('Encontraste a aranha! Muito bem!'); celebrate();
    } else {
      tone(360 + (attempt % 2) * 55, 0.11, 'sine', 0.045);
      if (attempt === 1) {
        setMessage('Boa tentativa! Procura mais um bocadinho.');
        speak('Boa tentativa! Continua a procurar.');
      } else {
        setMessage('A patinha está a dar-te uma pista!');
        setShowHint(true);
        speak('Olha para a patinha!');
      }
    }
  };

  const newRound = () => {
    const nextLevel = found ? level + 1 : level;
    const settings = getLevelSettings(nextLevel);
    let next = Math.floor(Math.random() * settings.count);
    if (settings.count > 1 && next === target) next = (next + 1) % settings.count;
    setLevel(nextLevel);
    setTarget(next);
    setFound(false);
    setPreviewing(true);
    setRoundId(id => id + 1);
    setTaps(0);
    setShowHint(false);
    setMessage('Olha bem! A aranha vai esconder-se…');
    tone(440, 0.12);
  };

  const toggleSound = () => {
    setSoundOn(value => {
      if (value && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      return !value;
    });
  };

  const install = async () => {
    if (!installPrompt) {
      setMessage('Para instalar, abre o menu do navegador e escolhe “Adicionar ao ecrã principal”.');
      return;
    }
    await installPrompt.prompt(); setInstallPrompt(null);
  };

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand-mark" aria-hidden="true">🕷️</div>
      <div className="brand-copy"><span className="eyebrow">PEQUENAS DESCOBERTAS</span><h1>Onde está a aranha?</h1></div>
      <button className="icon-button" aria-label={soundOn ? 'Desligar som' : 'Ligar som'} onClick={toggleSound}>{soundOn ? <Volume2 /> : <VolumeX />}</button>
    </header>
    <section className="game-card" aria-label="Jogo de procurar a aranha">
      <div className="game-intro"><div className="sun" aria-hidden="true">☀️</div><div>
        <span className="level-label"><Sparkles size={15} /> A FLORESTA AMIGA · NÍVEL {level}</span>
        <h2>{found ? 'Apanhaste-me!' : previewing ? 'Olha bem para a aranha!' : 'Onde se escondeu?'}</h2><p aria-live="polite">{message}</p>
        <div className="level-meta"><span>{getLevelSettings(level).count} objetos</span><span>Aranha visível: {(getLevelSettings(level).visibleMs / 1000).toLocaleString('pt-PT')} s</span></div>
      </div></div>
      <div className={`forest ${found ? 'forest-found' : ''}`}>
        <div className="cloud cloud-one" aria-hidden="true" /><div className="cloud cloud-two" aria-hidden="true" />
        <div className="hill hill-back" aria-hidden="true" /><div className="hill hill-front" aria-hidden="true" />
        <div className="tree tree-left" aria-hidden="true">🌳</div><div className="tree tree-right" aria-hidden="true">🌴</div>
        <div className="butterfly" aria-hidden="true">🦋</div>
        {spots.slice(0, getLevelSettings(level).count).map((spot, index) => <button key={spot.id} style={{ left: `${positions[index].left}%`, top: `${positions[index].top}%` }} className={`hide-spot ${previewing && index === target ? 'preview-target' : ''} ${found && index === target ? 'revealed' : ''} ${showHint && index === target ? 'hinted' : ''}`} onClick={() => tapSpot(index)} aria-label={`Procurar atrás de: ${spot.label}`} disabled={found || previewing}>
          {showHint && !found && index === target && <span className="peek-paw" aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M35 60C31 49 33 40 40 32L49 22Q54 17 58 22Q62 27 56 33L49 42Q45 49 48 60Z" fill="#9C7AF0" stroke="#6748C4" strokeWidth="3" strokeLinejoin="round"/><ellipse cx="44" cy="21" rx="8" ry="10" transform="rotate(-20 44 21)" fill="#B9A4FF" stroke="#6748C4" strokeWidth="2.5"/><ellipse cx="54" cy="17" rx="7" ry="9" transform="rotate(4 54 17)" fill="#B9A4FF" stroke="#6748C4" strokeWidth="2.5"/><ellipse cx="61" cy="23" rx="5" ry="7" fill="#B9A4FF" stroke="#6748C4" strokeWidth="2.5"/><path d="M39 43q7 4 10 0" fill="none" stroke="#DCCFFF" strokeWidth="3" strokeLinecap="round"/></svg></span>}
          <span className="spot-emoji" aria-hidden="true">{spot.emoji}</span>
          {previewing && index === target && <span className="peek-spider spider-preview" aria-label="Aranha"><SpiderArt /></span>
          }
          {showHint && !found && index === target && <span className="peek-spider" aria-hidden="true"><SpiderArt /></span>}
          {found && index === target && <span className="spider-reveal" aria-label="Aranha"><SpiderArt /></span>}
        </button>)}
        {found && <div className="spider-hero spider-dancing" aria-hidden="true">
          <span className="spider-thread" /><SpiderArt />
          <span className="spider-leg leg-1" /><span className="spider-leg leg-2" /><span className="spider-leg leg-3" /><span className="spider-leg leg-4" /><span className="spider-leg leg-5" /><span className="spider-leg leg-6" />
        </div>}
        {found && <div className="celebration" aria-hidden="true"><span>✨</span><span>💖</span><span>⭐</span><span>🎉</span><span>✨</span></div>}
        <div className="ground" aria-hidden="true"><span>🌱</span><span>🌼</span><span>🍀</span><span>🌷</span><span>🌱</span><span>🌸</span></div>
      </div>
      <div className="game-footer"><div className="progress-copy"><span className="tiny-heart"><Heart size={16} fill="currentColor" /></span><span>{found ? 'Que boa descoberta!' : 'Toca nos objetos. Vês uma patinha?'}</span></div>
        <div className="round-actions">{found && <span className="found-pill"><Sparkles size={14} /> Muito bem!</span>}<button className="primary-button" onClick={newRound}><RotateCcw size={18} />{found ? 'Próximo nível!' : 'Repetir nível'}</button></div>
      </div>
    </section>
    <footer className="bottom-bar"><p>Um pequeno jogo para brincar em conjunto 💚</p><button className="install-button" onClick={install}><Download size={16} /> Instalar</button></footer>
  </main>;
}
