import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles, Heart, Download, Leaf, Waves } from 'lucide-react';

type Spot = { id: string; label: string; emoji: string; sound: number };
const spots: Spot[] = [
  { id: 'leaf', label: 'folha', emoji: '🍃', sound: 660 },
  { id: 'flower', label: 'flor', emoji: '🌼', sound: 740 },
  { id: 'rock', label: 'pedra', emoji: '🪨', sound: 260 },
  { id: 'mushroom', label: 'cogumelo', emoji: '🍄', sound: 520 },
  { id: 'bush', label: 'arbusto', emoji: '🌿', sound: 620 },
  { id: 'log', label: 'tronco', emoji: '🪵', sound: 320 },
  { id: 'acorn', label: 'bolota', emoji: '🌰', sound: 400 },
  { id: 'cactus', label: 'cato', emoji: '🌵', sound: 560 },
  { id: 'apple', label: 'maçã', emoji: '🍎', sound: 700 },
  { id: 'tulip', label: 'tulipa', emoji: '🌷', sound: 780 },
  { id: 'moss', label: 'trevo', emoji: '☘️', sound: 580 },
  { id: 'berry', label: 'frutos', emoji: '🫐', sound: 820 },
  { id: 'pine', label: 'pinheiro', emoji: '🌲', sound: 490 },
  { id: 'puddle', label: 'poça', emoji: '💧', sound: 880 },
  { id: 'nest', label: 'ninho', emoji: '🪺', sound: 450 },
  { id: 'sunflower', label: 'girassol', emoji: '🌻', sound: 760 },
  { id: 'shell', label: 'concha', emoji: '🐚', sound: 690 },
  { id: 'fish', label: 'peixe', emoji: '🐠', sound: 630 },
  { id: 'coral', label: 'coral', emoji: '🪸', sound: 570 },
  { id: 'bubble', label: 'bolha', emoji: '🫧', sound: 900 },
  { id: 'pillow', label: 'almofada', emoji: '🛏️', sound: 390 },
  { id: 'teddy', label: 'ursinho', emoji: '🧸', sound: 500 },
  { id: 'toy', label: 'brinquedo', emoji: '🧸', sound: 610 },
  { id: 'box', label: 'caixa', emoji: '📦', sound: 300 }
];
const levels = [
  { count: 4, visibleMs: 4000 }, { count: 5, visibleMs: 3500 }, { count: 6, visibleMs: 3000 },
  { count: 8, visibleMs: 2700 }, { count: 10, visibleMs: 2300 }, { count: 12, visibleMs: 1900 },
  { count: 14, visibleMs: 1600 }, { count: 16, visibleMs: 1300 }, { count: 18, visibleMs: 1100 },
  { count: 20, visibleMs: 900 }, { count: 22, visibleMs: 800 }, { count: 24, visibleMs: 700 }
];
const settingsFor = (level: number) => levels[Math.min(level - 1, levels.length - 1)] ?? { count: 24, visibleMs: Math.max(500, 700 - (level - levels.length) * 40) };
const worldFor = (level: number) => level < 4 ? 'forest' : level < 7 ? 'garden' : level < 10 ? 'underwater' : 'playroom';
const worldNames: Record<string, string> = { forest: 'Floresta encantada', garden: 'Jardim mágico', underwater: 'Fundo do mar', playroom: 'Quarto dos brinquedos' };
const worldEmojis: Record<string, string> = { forest: '🌳', garden: '🌷', underwater: '🐠', playroom: '🧸' };

function SpiderArt() {
  return <span className="spider-character" aria-hidden="true">
    <span className="spider-leg spider-leg-a" /><span className="spider-leg spider-leg-b" /><span className="spider-leg spider-leg-c" /><span className="spider-leg spider-leg-d" />
    <span className="spider-face"><i className="spider-eye left" /><i className="spider-eye right" /><i className="spider-smile" /><i className="spider-cheek left" /><i className="spider-cheek right" /></span>
  </span>;
}

export default function App() {
  const [level, setLevel] = useState(1);
  const [roundId, setRoundId] = useState(0);
  const [target, setTarget] = useState(() => Math.floor(Math.random() * settingsFor(1).count));
  const [previewing, setPreviewing] = useState(true);
  const [found, setFound] = useState(false);
  const [taps, setTaps] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [message, setMessage] = useState('Olha bem! A aranha vai esconder-se…');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);
  const [freeMode, setFreeMode] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const settings = settingsFor(level);
  const world = worldFor(level);
  const visibleObjects = spots.slice(0, Math.min(settings.count, spots.length));

  useEffect(() => {
    const handlePrompt = (event: Event) => { event.preventDefault(); setInstallPrompt(event); };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const tone = (frequency: number, duration = 0.13, volume = 0.06) => {
    if (!soundOn) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      audioRef.current ??= new AudioCtx();
      const ctx = audioRef.current;
      if (ctx.state === 'suspended') void ctx.resume();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      oscillator.connect(gain); gain.connect(ctx.destination);
      oscillator.start(); oscillator.stop(ctx.currentTime + duration + 0.025);
    } catch { /* Audio is optional. */ }
  };

  const speak = (text: string) => {
    if (!soundOn || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const voice = new SpeechSynthesisUtterance(text);
      voice.lang = 'pt-PT'; voice.rate = 0.82; voice.pitch = 1.12; voice.volume = 0.85;
      window.speechSynthesis.speak(voice);
    } catch { /* Voice depends on browser/device support. */ }
  };

  useEffect(() => {
    if (!previewing || found || freeMode) return;
    const timer = window.setTimeout(() => {
      setPreviewing(false);
      setMessage('Onde se escondeu? Toca num objeto!');
      tone(580, 0.12);
    }, settings.visibleMs);
    return () => window.clearTimeout(timer);
  }, [roundId, level, previewing, found, freeMode]);

  const celebrate = () => {
    tone(523, 0.15); window.setTimeout(() => tone(659, 0.15), 120); window.setTimeout(() => tone(784, 0.24), 240);
    window.setTimeout(() => speak('Encontraste a aranha! Muito bem!'), 300);
  };

  const tapSpot = (index: number) => {
    if (found || previewing && !freeMode) return;
    const spot = visibleObjects[index];
    if (!spot) return;
    tone(spot.sound, 0.1, 0.045);
    const attempt = taps + 1;
    setTaps(attempt);
    if (index === target) {
      setFound(true); setShowHint(false); setMessage('Encontraste a aranha! Muito bem!');
      celebrate();
    } else {
      setMessage(attempt === 1 ? 'Boa tentativa! Vamos espreitar mais.' : 'A aranha está a dar-te uma pista!');
      if (attempt >= 2) { setShowHint(true); speak('Olha para a patinha!'); }
      else speak('Boa tentativa! Continua a procurar.');
    }
  };

  const startRound = (nextLevel: number) => {
    const nextSettings = settingsFor(nextLevel);
    let nextTarget = Math.floor(Math.random() * Math.min(nextSettings.count, spots.length));
    if (visibleObjects.length > 1 && nextTarget === target) nextTarget = (nextTarget + 1) % Math.min(nextSettings.count, spots.length);
    setLevel(nextLevel); setTarget(nextTarget); setFound(false); setPreviewing(!freeMode);
    setRoundId(id => id + 1); setTaps(0); setShowHint(false);
    setMessage(freeMode ? 'Vamos brincar! Toca nos objetos.' : 'Olha bem! A aranha vai esconder-se…');
    tone(440, 0.12);
  };

  const nextRound = () => startRound(found && !freeMode ? level + 1 : level);
  const toggleSound = () => {
    setSoundOn(value => {
      if (value && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      return !value;
    });
  };
  const install = async () => {
    if (!installPrompt) { setMessage('Para instalar, abre o menu do navegador e escolhe “Adicionar ao ecrã principal”.'); return; }
    await installPrompt.prompt(); setInstallPrompt(null);
  };

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand-mark" aria-hidden="true">🕷️</div>
      <div className="brand-copy"><span className="eyebrow">PEQUENAS DESCOBERTAS</span><h1>Onde está a aranha?</h1></div>
      <button className="icon-button" aria-label={soundOn ? 'Desligar som' : 'Ligar som'} onClick={toggleSound}>{soundOn ? <Volume2 /> : <VolumeX />}</button>
    </header>
    <section className="game-card" aria-label="Jogo de procurar a aranha">
      <div className="game-intro">
        <div className="sun" aria-hidden="true">{worldEmojis[world]}</div>
        <div className="intro-copy">
          <span className="level-label"><Sparkles size={15} /> {worldNames[world]} · NÍVEL {level}</span>
          <h2>{found ? 'Apanhaste-me!' : freeMode ? 'Vamos brincar!' : previewing ? 'Olha bem para a aranha!' : 'Onde se escondeu?'}</h2>
          <p aria-live="polite">{message}</p>
          <div className="level-meta"><span>{settings.count} objetos</span><span>{freeMode ? 'Modo livre' : 'Aranha visível: ' + (settings.visibleMs / 1000).toLocaleString('pt-PT') + ' s'}</span></div>
        </div>
      </div>
      <div className={`scene scene-${world} ${found ? 'scene-found' : ''}`} aria-label={worldNames[world]}>
        <div className="scene-sky" aria-hidden="true" />
        <div className="scene-cloud cloud-one" aria-hidden="true" /><div className="scene-cloud cloud-two" aria-hidden="true" />
        <div className="scene-backdrop" aria-hidden="true"><span className="scene-decoration deco-one">{world === 'underwater' ? '🪸' : world === 'playroom' ? '🧸' : '🌳'}</span><span className="scene-decoration deco-two">{world === 'underwater' ? '🐠' : world === 'playroom' ? '🪁' : '🌴'}</span></div>
        <div className="scene-ground" aria-hidden="true" />
        <div className="scene-sparkle" aria-hidden="true">✦</div>
        <div className={`object-grid object-count-${visibleObjects.length}`}>
          {visibleObjects.map((spot, index) => <button key={spot.id} className={`object-button ${previewing && index === target && !freeMode ? 'object-preview' : ''} ${showHint && !found && index === target ? 'object-hinted' : ''} ${found && index === target ? 'object-found' : ''}`} onClick={() => tapSpot(index)} aria-label={`Espreitar ${spot.label}`} disabled={found || previewing && !freeMode}>
            <span className="object-shadow" aria-hidden="true" />
            <span className="object-emoji" aria-hidden="true">{spot.emoji}</span>
            {previewing && index === target && !freeMode && <span className="spider-peek"><SpiderArt /></span>}
            {showHint && !found && index === target && <span className="paw-hint" aria-hidden="true">🐾</span>}
            {found && index === target && <span className="spider-discovery"><SpiderArt /></span>}
          </button>)}
        </div>
        {found && <div className="celebration" aria-hidden="true"><span>✨</span><span>💖</span><span>⭐</span><span>🎉</span><span>✨</span></div>}
        <div className="scene-foreground" aria-hidden="true">{world === 'underwater' ? '🫧 🐚 🫧' : world === 'playroom' ? '🧸 🧩 🚂' : '🌼 🍀 🌷 🍀 🌼'}</div>
      </div>
      <div className="game-footer">
        <div className="progress-copy"><span className="tiny-heart"><Heart size={16} fill="currentColor" /></span><span>{found ? 'Que boa descoberta!' : freeMode ? 'Toca e descobre os objetos!' : showHint ? 'Segue a patinha!' : previewing ? 'Olha bem para a aranha!' : 'Toca nos objetos para procurar'}</span></div>
        <div className="round-actions">
          <button className={`mode-button ${freeMode ? 'mode-active' : ''}`} onClick={() => { const next = !freeMode; setFreeMode(next); setFound(false); setShowHint(false); setPreviewing(!next); setMessage(next ? 'Modo livre: explora tudo!' : 'Olha bem! A aranha vai esconder-se…'); setRoundId(id => id + 1); }} aria-pressed={freeMode}>{freeMode ? <Waves size={16} /> : <Leaf size={16} />}{freeMode ? 'Modo livre' : 'Desafio'}</button>
          <button className="primary-button" onClick={nextRound}><RotateCcw size={18} />{found && !freeMode ? 'Próximo nível!' : 'Repetir'}</button>
        </div>
      </div>
    </section>
    <footer className="bottom-bar"><p>Brincar, descobrir e aprender 💚</p><button className="install-button" onClick={install}><Download size={16} /> Instalar</button></footer>
  </main>;
}
