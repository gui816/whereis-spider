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
type Language = 'pt' | 'en' | 'es' | 'fr';
const translations: Record<Language, Record<string,string>> = {
pt:{brand:'PEQUENAS DESCOBERTAS',title:'Onde está a aranha?',forest:'Floresta encantada',garden:'Jardim mágico',underwater:'Fundo do mar',playroom:'Quarto dos brinquedos',level:'NÍVEL',look:'Olha bem para a aranha!',hidden:'Onde se escondeu?',foundTitle:'Apanhaste-me!',freeTitle:'Vamos brincar!',starting:'Olha bem! A aranha vai esconder-se…',searching:'Onde se escondeu? Toca num objeto!',found:'Encontraste a aranha! Muito bem!',tryAgain:'Boa tentativa! Vamos espreitar mais.',hintMessage:'A aranha está a dar-te uma pista!',paw:'Olha para a patinha!',continue:'Boa tentativa! Continua a procurar.',objects:'objetos',visible:'Aranha visível:',free:'Modo livre',freeMessage:'Modo livre: explora tudo!',freePrompt:'Toca e descobre os objetos!',prompt:'Toca nos objetos para procurar',hintPrompt:'Segue a patinha!',goodFind:'Que boa descoberta!',playTogether:'Brincar, descobrir e aprender 💚',freeButton:'Modo livre',challenge:'Desafio',next:'Próximo nível!',repeat:'Repetir',install:'Instalar',installHelp:'Para instalar, abre o menu do navegador e escolhe “Adicionar ao ecrã principal”.',peek:'Espreitar',soundOff:'Desligar som',soundOn:'Ligar som',labels:'folha,flor,pedra,cogumelo,arbusto,tronco,bolota,cato,maçã,tulipa,trevo,frutos,pinheiro,poça,ninho,girassol,concha,peixe,coral,bolha,almofada,ursinho,brinquedo,caixa'},
en:{brand:'LITTLE DISCOVERIES',title:'Where is the spider?',forest:'Enchanted forest',garden:'Magic garden',underwater:'Under the sea',playroom:'Toy room',level:'LEVEL',look:'Look closely at the spider!',hidden:'Where did it hide?',foundTitle:'You found me!',freeTitle:'Let’s play!',starting:'Look carefully! The spider is going to hide…',searching:'Where did it hide? Tap an object!',found:'You found the spider! Great job!',tryAgain:'Good try! Let’s peek a little more.',hintMessage:'The spider is giving you a clue!',paw:'Look at the little paw!',continue:'Good try! Keep looking.',objects:'objects',visible:'Spider visible:',free:'Free play',freeMessage:'Free play: explore everything!',freePrompt:'Tap and discover the objects!',prompt:'Tap objects to search',hintPrompt:'Follow the little paw!',goodFind:'What a lovely discovery!',playTogether:'Play, discover and learn 💚',freeButton:'Free play',challenge:'Challenge',next:'Next level!',repeat:'Again',install:'Install',installHelp:'To install, open your browser menu and choose “Add to Home Screen”.',peek:'Peek at',soundOff:'Turn sound off',soundOn:'Turn sound on',labels:'leaf,flower,rock,mushroom,bush,log,acorn,cactus,apple,tulip,clover,berries,pine tree,puddle,nest,sunflower,shell,fish,coral,bubble,pillow,teddy,toy,box'},
es:{brand:'PEQUEÑOS DESCUBRIMIENTOS',title:'¿Dónde está la araña?',forest:'Bosque encantado',garden:'Jardín mágico',underwater:'Bajo el mar',playroom:'Cuarto de juguetes',level:'NIVEL',look:'¡Mira bien a la araña!',hidden:'¿Dónde se escondió?',foundTitle:'¡Me encontraste!',freeTitle:'¡Vamos a jugar!',starting:'¡Mira bien! La araña se va a esconder…',searching:'¿Dónde se escondió? ¡Toca un objeto!',found:'¡Encontraste la araña! ¡Muy bien!',tryAgain:'¡Buen intento! Vamos a mirar un poco más.',hintMessage:'¡La araña te está dando una pista!',paw:'¡Mira la patita!',continue:'¡Buen intento! Sigue buscando.',objects:'objetos',visible:'Araña visible:',free:'Juego libre',freeMessage:'¡Juego libre: explóralo todo!',freePrompt:'¡Toca y descubre los objetos!',prompt:'Toca los objetos para buscar',hintPrompt:'¡Sigue la patita!',goodFind:'¡Qué gran descubrimiento!',playTogether:'Jugar, descubrir y aprender 💚',freeButton:'Juego libre',challenge:'Desafío',next:'¡Siguiente nivel!',repeat:'Repetir',install:'Instalar',installHelp:'Para instalar, abre el menú del navegador y elige “Añadir a pantalla de inicio”.',peek:'Mirar',soundOff:'Apagar sonido',soundOn:'Activar sonido',labels:'hoja,flor,piedra,seta,arbusto,tronco,bellota,cactus,manzana,tulipán,trébol,bayas,pino,charco,nido,girasol,concha,pez,coral,burbuja,almohada,osito,juguete,caja'},
fr:{brand:'PETITES DÉCOUVERTES',title:'Où est l’araignée ?',forest:'Forêt enchantée',garden:'Jardin magique',underwater:'Sous la mer',playroom:'Salle de jeux',level:'NIVEAU',look:'Regarde bien l’araignée !',hidden:'Où s’est-elle cachée ?',foundTitle:'Tu m’as trouvée !',freeTitle:'Jouons !',starting:'Regarde bien ! L’araignée va se cacher…',searching:'Où s’est-elle cachée ? Touche un objet !',found:'Tu as trouvé l’araignée ! Bravo !',tryAgain:'Bien essayé ! Regardons encore.',hintMessage:'L’araignée te donne un indice !',paw:'Regarde la petite patte !',continue:'Bien essayé ! Continue à chercher.',objects:'objets',visible:'Araignée visible :',free:'Jeu libre',freeMessage:'Jeu libre : explore tout !',freePrompt:'Touche et découvre les objets !',prompt:'Touche les objets pour chercher',hintPrompt:'Suis la petite patte !',goodFind:'Quelle belle découverte !',playTogether:'Jouer, découvrir et apprendre 💚',freeButton:'Jeu libre',challenge:'Défi',next:'Niveau suivant !',repeat:'Rejouer',install:'Installer',installHelp:'Pour installer, ouvre le menu du navigateur et choisis « Ajouter à l’écran d’accueil ».',peek:'Regarder',soundOff:'Couper le son',soundOn:'Activer le son',labels:'feuille,fleur,pierre,champignon,buisson,bûche,gland,cactus,pomme,tulipe,trèfle,baies,pin,flaque,nid,tournesol,coquillage,poisson,corail,bulle,oreiller,ours en peluche,jouet,boîte'}
};
const detectLanguage = (): Language => {
 const langs = (navigator.languages?.length ? navigator.languages : [navigator.language]).map(v => v.toLowerCase());
 for (const lang of langs) if (lang.startsWith('pt')) return 'pt';
 for (const lang of langs) if (lang.startsWith('es')) return 'es';
 for (const lang of langs) if (lang.startsWith('fr')) return 'fr';
 return 'en';
};

const levels = [
  { count: 4, visibleMs: 4000 }, { count: 5, visibleMs: 3500 }, { count: 6, visibleMs: 3000 },
  { count: 8, visibleMs: 2700 }, { count: 10, visibleMs: 2300 }, { count: 12, visibleMs: 1900 },
  { count: 14, visibleMs: 1600 }, { count: 16, visibleMs: 1300 }, { count: 18, visibleMs: 1100 },
  { count: 20, visibleMs: 900 }, { count: 22, visibleMs: 800 }, { count: 24, visibleMs: 700 }
];
const settingsFor = (level: number) => levels[Math.min(level - 1, levels.length - 1)] ?? { count: 24, visibleMs: Math.max(500, 700 - (level - levels.length) * 40) };
const worldFor = (level: number) => level < 4 ? 'forest' : level < 7 ? 'garden' : level < 10 ? 'underwater' : 'playroom';
const worldNames: Record<string, string> = { forest: 'forest', garden: 'garden', underwater: 'underwater', playroom: 'playroom' };
const worldEmojis: Record<string, string> = { forest: '🌳', garden: '🌷', underwater: '🐠', playroom: '🧸' };

function SpiderArt() {
  return <span className="spider-character" aria-hidden="true">
    <span className="spider-leg spider-leg-a" /><span className="spider-leg spider-leg-b" /><span className="spider-leg spider-leg-c" /><span className="spider-leg spider-leg-d" />
    <span className="spider-face"><i className="spider-eye left" /><i className="spider-eye right" /><i className="spider-smile" /><i className="spider-cheek left" /><i className="spider-cheek right" /></span>
  </span>;
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => detectLanguage());
  const t = (key: string) => translations[language][key] ?? key;
  useEffect(() => { document.documentElement.lang = language === 'pt' ? 'pt-PT' : language; }, [language]);
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
  const pools: Record<string, string[]> = {
    forest:['leaf','rock','mushroom','bush','log','acorn','pine','nest','puddle','sunflower','flower','moss'],
    garden:['flower','tulip','apple','moss','berry','leaf','sunflower','bush','puddle','nest','rock','mushroom'],
    underwater:['shell','fish','coral','bubble','rock','berry','puddle','flower','mushroom','leaf','bush','nest'],
    playroom:['pillow','teddy','toy','box','apple','flower','shell','berry','rock','log','mushroom','leaf']
  };
  const labels = translations[language].labels.split(',');
  const translatedSpots = spots.map((spot, i) => ({ ...spot, label: labels[i] ?? spot.label }));
  const pool = (pools[world] ?? pools.forest).map(id => translatedSpots.find(spot => spot.id === id)!).filter(Boolean);
  const visibleObjects = Array.from({ length: Math.min(settings.count, spots.length) }, (_, i) => pool[i % pool.length]);

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
      voice.lang = language === 'pt' ? 'pt-PT' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-US'; voice.rate = 0.82; voice.pitch = 1.12; voice.volume = 0.85;
      window.speechSynthesis.speak(voice);
    } catch { /* Voice depends on browser/device support. */ }
  };

  useEffect(() => {
    if (!previewing || found || freeMode) return;
    const timer = window.setTimeout(() => {
      setPreviewing(false);
      setMessage(t('searching'));
      tone(580, 0.12);
    }, settings.visibleMs);
    return () => window.clearTimeout(timer);
  }, [roundId, level, previewing, found, freeMode, language]);

  const celebrate = () => {
    const melodies = [[523,659,784],[784,659,880],[587,740,880],[523,784,659],[659,784,988]];
    const melody = melodies[Math.floor(Math.random() * melodies.length)];
    melody.forEach((note, i) => window.setTimeout(() => tone(note, i === 2 ? 0.28 : 0.13, 0.065), i * 115));
    const praise = {
      pt:['Encontraste a aranha! Muito bem!','Bravo! Que grande descoberta!','A aranha ficou feliz! Boa!','Conseguiste! Vamos brincar mais!'],
      en:['You found the spider! Great job!','Bravo! What a lovely discovery!','The spider is so happy!','You did it! Let’s play again!'],
      es:['¡Encontraste la araña! ¡Muy bien!','¡Bravo! ¡Qué gran descubrimiento!','¡La araña está feliz!','¡Lo lograste! ¡Vamos a jugar!'],
      fr:['Tu as trouvé l’araignée ! Bravo !','Bravo ! Quelle belle découverte !','L’araignée est heureuse !','Tu as réussi ! Jouons encore !']
    }[language];
    window.setTimeout(() => speak(praise[Math.floor(Math.random() * praise.length)]), 330);
  };

  const tapSpot = (index: number) => {
    if (found || previewing && !freeMode) return;
    const spot = visibleObjects[index];
    if (!spot) return;
    tone(spot.sound, 0.1, 0.045);
    const attempt = taps + 1;
    setTaps(attempt);
    if (index === target) {
      setFound(true); setShowHint(false); setMessage(t('found'));
      celebrate();
    } else {
      setMessage(attempt === 1 ? t('tryAgain') : t('hintMessage'));
      if (attempt >= 2) { setShowHint(true); speak(t('paw')); }
      else speak(t('continue'));
    }
  };

  const startRound = (nextLevel: number) => {
    const nextSettings = settingsFor(nextLevel);
    let nextTarget = Math.floor(Math.random() * Math.min(nextSettings.count, spots.length));
    if (visibleObjects.length > 1 && nextTarget === target) nextTarget = (nextTarget + 1) % Math.min(nextSettings.count, spots.length);
    setLevel(nextLevel); setTarget(nextTarget); setFound(false); setPreviewing(!freeMode);
    setRoundId(id => id + 1); setTaps(0); setShowHint(false);
    setMessage(freeMode ? t('freeMessage') : t('starting'));
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
    if (!installPrompt) { setMessage(t('installHelp')); return; }
    await installPrompt.prompt(); setInstallPrompt(null);
  };

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand-mark" aria-hidden="true">🕷️</div>
      <div className="brand-copy"><span className="eyebrow">{t('brand')}</span><h1>{t('title')}</h1></div>
      <select className="language-select" aria-label="Language" value={language} onChange={e => setLanguage(e.target.value as Language)}><option value="pt">PT</option><option value="en">EN</option><option value="es">ES</option><option value="fr">FR</option></select><button className="icon-button" aria-label={soundOn ? t('soundOff') : t('soundOn')} onClick={toggleSound}>{soundOn ? <Volume2 /> : <VolumeX />}</button>
    </header>
    <section className="game-card" aria-label={t('title')}>
      <div className="game-intro">
        <div className="sun" aria-hidden="true">{worldEmojis[world]}</div>
        <div className="intro-copy">
          <span className="level-label"><Sparkles size={15} /> {t(worldNames[world])} · {t('level')} {level}</span>
          <h2>{found ? t('foundTitle') : freeMode ? t('freeTitle') : previewing ? t('look') : t('hidden')}</h2>
          <p aria-live="polite">{message}</p>
          <div className="level-meta"><span>{settings.count} {t('objects')}</span><span>{freeMode ? t('free') : t('visible') + ' ' + (settings.visibleMs / 1000).toLocaleString(language === 'pt' ? 'pt-PT' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-US') + ' s'}</span></div>
        </div>
      </div>
      <div className={`scene scene-${world} ${found ? 'scene-found' : ''}`} aria-label={t(worldNames[world])}>
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
        <div className="progress-copy"><span className="tiny-heart"><Heart size={16} fill="currentColor" /></span><span>{found ? t('goodFind') : freeMode ? t('freePrompt') : showHint ? t('hintPrompt') : previewing ? t('look') : t('prompt')}</span></div>
        <div className="round-actions">
          <button className={`mode-button ${freeMode ? 'mode-active' : ''}`} onClick={() => { const next = !freeMode; setFreeMode(next); setFound(false); setShowHint(false); setPreviewing(!next); setMessage(next ? 'Modo livre: explora tudo!' : 'Olha bem! A aranha vai esconder-se…'); setRoundId(id => id + 1); }} aria-pressed={freeMode}>{freeMode ? <Waves size={16} /> : <Leaf size={16} />}{freeMode ? t('freeButton') : t('challenge')}</button>
          <button className="primary-button" onClick={nextRound}><RotateCcw size={18} />{found && !freeMode ? t('next') : t('repeat')}</button>
        </div>
      </div>
    </section>
    <footer className="bottom-bar"><p>{t('playTogether')}</p><button className="install-button" onClick={install}><Download size={16} /> {t('install')}</button></footer>
  </main>;
}
