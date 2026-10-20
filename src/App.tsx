import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles, Heart, Download } from 'lucide-react';

type Spot = { id: string; label: string; className: string };
const spots: Spot[] = [
  { id: 'leaf', label: 'folha', className: 'spot-leaf' },
  { id: 'flower', label: 'flor', className: 'spot-flower' },
  { id: 'rock', label: 'pedra', className: 'spot-rock' },
  { id: 'mushroom', label: 'cogumelo', className: 'spot-mushroom' },
  { id: 'bush', label: 'arbusto', className: 'spot-bush' },
  { id: 'log', label: 'tronco', className: 'spot-log' }
];

function SpotArt({ id }: { id: string }) {
  switch (id) {
    case 'leaf': return <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M15 76C10 35 40 8 84 14 88 52 64 84 15 76Z" fill="#55C985" stroke="#278D5A" strokeWidth="4" strokeLinejoin="round"/><path d="M17 78 70 28M40 56 37 34M53 44 73 45M29 67 25 51" fill="none" stroke="#278D5A" strokeWidth="4" strokeLinecap="round"/><path d="M19 73 12 88" stroke="#278D5A" strokeWidth="5" strokeLinecap="round"/></svg>;
    case 'flower': return <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 53Q46 70 50 91" fill="none" stroke="#32985E" strokeWidth="7" strokeLinecap="round"/><ellipse cx="39" cy="78" rx="14" ry="7" transform="rotate(25 39 78)" fill="#66D68A"/>{[[50,25],[68,38],[62,58],[38,58],[31,38]].map(([x,y],i)=><ellipse key={i} cx={x} cy={y} rx="15" ry="18" fill={i%2?'#FF9BC0':'#FFC1D7'} stroke="#F17EA7" strokeWidth="2"/>)}<circle cx="50" cy="42" r="14" fill="#FFD75E" stroke="#F5B83D" strokeWidth="3"/><circle cx="45" cy="40" r="2" fill="#8B6130"/><circle cx="55" cy="40" r="2" fill="#8B6130"/><path d="M46 46Q50 51 54 46" fill="none" stroke="#8B6130" strokeWidth="2.5" strokeLinecap="round"/></svg>;
    case 'rock': return <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 72 19 44 40 26 67 32 87 54 82 78 60 87 29 83Z" fill="#A8B8C4" stroke="#748B9A" strokeWidth="4" strokeLinejoin="round"/><path d="m23 48 19-14 12 4M35 68l10 4M65 49l9 9" fill="none" stroke="#DDE6EA" strokeWidth="5" strokeLinecap="round"/><circle cx="43" cy="61" r="3" fill="#526C7B"/><circle cx="60" cy="61" r="3" fill="#526C7B"/><path d="M45 69q7 7 14 0" fill="none" stroke="#526C7B" strokeWidth="3" strokeLinecap="round"/></svg>;
    case 'mushroom': return <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M36 49Q29 63 36 84Q50 93 65 83L63 49Z" fill="#FFF1CF" stroke="#D7B77D" strokeWidth="3"/><path d="M12 51Q13 19 48 15Q83 18 89 51Q65 61 50 51Q32 61 12 51Z" fill="#FF777D" stroke="#E95362" strokeWidth="4" strokeLinejoin="round"/><circle cx="36" cy="34" r="6" fill="#FFF1CF"/><circle cx="61" cy="28" r="7" fill="#FFF1CF"/><circle cx="69" cy="45" r="4" fill="#FFF1CF"/><circle cx="46" cy="64" r="3" fill="#8B6244"/><circle cx="57" cy="64" r="3" fill="#8B6244"/><path d="M46 71q5 5 10 0" fill="none" stroke="#8B6244" strokeWidth="2.5" strokeLinecap="round"/></svg>;
    case 'bush': return <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M13 78Q3 59 22 47Q15 25 37 26Q51 8 65 29Q89 23 85 48Q103 62 85 79Z" fill="#55C985" stroke="#278D5A" strokeWidth="4"/><path d="M22 57q10-10 19 0M59 42q9-8 17 1" fill="none" stroke="#8AE4A5" strokeWidth="5" strokeLinecap="round"/><circle cx="42" cy="61" r="3" fill="#216B4A"/><circle cx="62" cy="61" r="3" fill="#216B4A"/><path d="M45 68q7 7 14 0" fill="none" stroke="#216B4A" strokeWidth="3" strokeLinecap="round"/></svg>;
    default: return <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M8 45Q8 30 24 30H79Q91 31 91 47V72Q90 85 76 85H22Q8 84 8 70Z" fill="#B77B4F" stroke="#855132" strokeWidth="4"/><path d="M18 41Q49 48 80 40M18 58Q49 65 82 57M20 75Q48 81 80 73" fill="none" stroke="#D9A071" strokeWidth="5" strokeLinecap="round"/><circle cx="43" cy="57" r="3" fill="#643C2B"/><circle cx="58" cy="57" r="3" fill="#643C2B"/><path d="M45 64q5 5 10 0" fill="none" stroke="#643C2B" strokeWidth="2.5" strokeLinecap="round"/></svg>;
  }
}

function SpiderArt() {
  return <div className="spider-body"><span className="spider-eye eye-left"><i /></span><span className="spider-eye eye-right"><i /></span><span className="spider-smile" /><span className="spider-blush blush-left" /><span className="spider-blush blush-right" /></div>;
}

export default function App() {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * spots.length));
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
    if (found) return;
    const attempt = taps + 1;
    setTaps(attempt);
    if (index === target) {
      setFound(true); setShowHint(false); setMessage('Encontraste a aranha! Muito bem!'); celebrate();
    } else {
      tone(360 + (attempt % 2) * 55, 0.11, 'sine', 0.045);
      if (attempt === 1) {
        setMessage('Boa tentativa! Espreita com atenção…');
        setShowHint(true);
        speak('Espreita com atenção!');
      } else {
        setMessage('Está ali pertinho! Toca onde está a brilhar!');
        setShowHint(true);
        speak('Está ali pertinho! Toca onde está a brilhar!');
      }
    }
  };

  const newRound = () => {
    let next = Math.floor(Math.random() * spots.length);
    if (spots.length > 1 && next === target) next = (next + 1) % spots.length;
    setTarget(next); setFound(false); setTaps(0); setShowHint(false);
    setMessage('A aranha está escondida. Vamos procurá-la!');
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
        <span className="level-label"><Sparkles size={15} /> A FLORESTA AMIGA</span>
        <h2>{found ? 'Apanhaste-me!' : 'Vamos encontrar a aranha!'}</h2><p aria-live="polite">{message}</p>
      </div></div>
      <div className={`forest ${found ? 'forest-found' : ''}`}>
        <div className="cloud cloud-one" aria-hidden="true" /><div className="cloud cloud-two" aria-hidden="true" />
        <div className="hill hill-back" aria-hidden="true" /><div className="hill hill-front" aria-hidden="true" />
        <div className="tree tree-left" aria-hidden="true">🌳</div><div className="tree tree-right" aria-hidden="true">🌴</div>
        <div className="butterfly" aria-hidden="true">🦋</div>
        {spots.map((spot, index) => <button key={spot.id} className={`hide-spot ${spot.className} ${found && index === target ? 'revealed' : ''} ${showHint && index === target ? 'hinted' : ''}`} onClick={() => tapSpot(index)} aria-label={`Procurar atrás de: ${spot.label}`} disabled={found}>
          <span className="spot-art"><SpotArt id={spot.id} /></span>
          {showHint && !found && index === target && <span className="peek-spider" aria-hidden="true"><SpiderArt /></span>}
          {found && index === target && <span className="spider-reveal" aria-label="Aranha">🕷️</span>}
        </button>)}
        {found && <div className="spider-hero spider-dancing" aria-hidden="true">
          <span className="spider-thread" /><SpiderArt />
          <span className="spider-leg leg-1" /><span className="spider-leg leg-2" /><span className="spider-leg leg-3" /><span className="spider-leg leg-4" /><span className="spider-leg leg-5" /><span className="spider-leg leg-6" />
        </div>}
        {found && <div className="celebration" aria-hidden="true"><span>✨</span><span>💖</span><span>⭐</span><span>🎉</span><span>✨</span></div>}
        <div className="ground" aria-hidden="true"><span>🌱</span><span>🌼</span><span>🍀</span><span>🌷</span><span>🌱</span><span>🌸</span></div>
      </div>
      <div className="game-footer"><div className="progress-copy"><span className="tiny-heart"><Heart size={16} fill="currentColor" /></span><span>{found ? 'Que boa descoberta!' : 'Toca nos objetos para espreitar'}</span></div>
        <div className="round-actions">{found && <span className="found-pill"><Sparkles size={14} /> Muito bem!</span>}<button className="primary-button" onClick={newRound}><RotateCcw size={18} />{found ? 'Outra vez!' : 'Novo esconderijo'}</button></div>
      </div>
    </section>
    <footer className="bottom-bar"><p>Um pequeno jogo para brincar em conjunto 💚</p><button className="install-button" onClick={install}><Download size={16} /> Instalar</button></footer>
  </main>;
}
