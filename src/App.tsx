import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles, Heart, Download } from 'lucide-react';

const spots = [
  { id: 'leaf', label: 'folha', emoji: '🍃', className: 'spot-leaf' },
  { id: 'flower', label: 'flor', emoji: '🌼', className: 'spot-flower' },
  { id: 'rock', label: 'pedra', emoji: '🪨', className: 'spot-rock' },
  { id: 'mushroom', label: 'cogumelo', emoji: '🍄', className: 'spot-mushroom' },
  { id: 'bush', label: 'arbusto', emoji: '🌿', className: 'spot-bush' },
  { id: 'log', label: 'tronco', emoji: '🪵', className: 'spot-log' }
];

export default function App() {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * spots.length));
  const [found, setFound] = useState(false);
  const [taps, setTaps] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [message, setMessage] = useState('A aranha está escondida… consegues encontrá-la?');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const handlePrompt = (event: Event) => { event.preventDefault(); setInstallPrompt(event); };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const tone = (frequency: number, duration = 0.12) => {
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
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      oscillator.connect(gain); gain.connect(ctx.destination);
      oscillator.start(); oscillator.stop(ctx.currentTime + duration + 0.02);
    } catch { /* Sound is optional; the game remains playable without it. */ }
  };

  const speak = (text: string) => {
    if (!soundOn || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const voice = new SpeechSynthesisUtterance(text);
      voice.lang = 'pt-PT';
      voice.rate = 0.82;
      voice.pitch = 1.12;
      voice.volume = 0.85;
      window.speechSynthesis.speak(voice);
    } catch { /* Voice is optional and depends on the device. */ }
  };

  const celebrate = () => {
    tone(523); window.setTimeout(() => tone(659), 100); window.setTimeout(() => tone(784, 0.22), 210);
    window.setTimeout(() => speak('Encontraste a aranha! Muito bem!'), 250);
  };

  const tapSpot = (index: number) => {
    if (found) return;
    setTaps(v => v + 1);
    if (index === target) {
      setFound(true); setMessage('Encontraste a aranha! Muito bem! 🎉'); celebrate();
    } else {
      setMessage(taps >= 2 ? 'Olha com atenção… vê a pista a brilhar!' : 'Boa tentativa! Vamos procurar noutro sítio!');
      tone(taps >= 2 ? 392 : 330, 0.12);
      setShowHint(taps >= 1);
      if (taps === 1) speak('Continua a procurar!');
      if (taps >= 2) speak('Está a brilhar! Toca aí!');
    }
  };

  const newRound = () => {
    let next = Math.floor(Math.random() * spots.length);
    if (spots.length > 1 && next === target) next = (next + 1) % spots.length;
    setTarget(next); setFound(false); setTaps(0); setShowHint(false);
    setMessage('A aranha está escondida… consegues encontrá-la?'); tone(440, 0.1);
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
      <button className="icon-button" aria-label={soundOn ? 'Desligar som' : 'Ligar som'} onClick={() => setSoundOn(v => !v)}>{soundOn ? <Volume2 /> : <VolumeX />}</button>
    </header>
    <section className="game-card" aria-label="Jogo de procurar a aranha">
      <div className="game-intro"><div className="sun" aria-hidden="true">☀️</div><div>
        <span className="level-label"><Sparkles size={15} /> A FLORESTA AMIGA</span>
        <h2>{found ? 'Apanhaste-me!' : 'Vamos encontrar a aranha!'}</h2><p aria-live="polite">{message}</p>
      </div></div>
      <div className={`forest ${found ? 'forest-found' : ''}`}>
        <div className="cloud cloud-one" aria-hidden="true"/><div className="cloud cloud-two" aria-hidden="true"/>
        <div className="hill hill-back" aria-hidden="true"/><div className="hill hill-front" aria-hidden="true"/>
        <div className="tree tree-left" aria-hidden="true">🌳</div><div className="tree tree-right" aria-hidden="true">🌴</div>
        <div className="butterfly" aria-hidden="true">🦋</div>
        {spots.map((spot, index) => <button key={spot.id} className={`hide-spot ${spot.className} ${found && index === target ? 'revealed' : ''} ${showHint && index === target ? 'hinted' : ''}`} onClick={() => tapSpot(index)} aria-label={`Procurar atrás de: ${spot.label}`} disabled={found}>
          <span className="spot-emoji" aria-hidden="true">{spot.emoji}</span>
          {found && index === target && <span className="spider-reveal" aria-label="Aranha">🕷️</span>}
          {!found && showHint && index === target && <span className="hint-sparkle" aria-hidden="true">✨</span>}
        </button>)}
        {found && <div className="spider-hero spider-dancing" aria-hidden="true">
          <span className="spider-thread"/>
          <div className="spider-body"><span className="spider-eye eye-left"><i/></span><span className="spider-eye eye-right"><i/></span><span className="spider-smile"/><span className="spider-blush blush-left"/><span className="spider-blush blush-right"/></div>
          <span className="spider-leg leg-1"/><span className="spider-leg leg-2"/><span className="spider-leg leg-3"/><span className="spider-leg leg-4"/><span className="spider-leg leg-5"/><span className="spider-leg leg-6"/>
        </div>}
        {found && <div className="celebration" aria-hidden="true"><span>✨</span><span>💖</span><span>⭐</span><span>🎉</span><span>✨</span></div>}
        <div className="ground" aria-hidden="true"><span>🌱</span><span>🌼</span><span>🍀</span><span>🌷</span><span>🌱</span><span>🌸</span></div>
      </div>
      <div className="game-footer"><div className="progress-copy"><span className="tiny-heart"><Heart size={16} fill="currentColor"/></span><span>{found ? 'Que boa descoberta!' : 'Toca nos objetos para os espreitar'}</span></div>
        <div className="round-actions">{found && <span className="found-pill"><Sparkles size={14}/> Muito bem!</span>}<button className="primary-button" onClick={newRound}><RotateCcw size={18}/>{found ? 'Outra vez!' : 'Novo esconderijo'}</button></div>
      </div>
    </section>
    <footer className="bottom-bar"><p>Um pequeno jogo para brincar em conjunto 💚</p><button className="install-button" onClick={install}><Download size={16}/> Instalar</button></footer>
  </main>;
}