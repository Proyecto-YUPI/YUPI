import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BatteryFull, CheckCheck, Mic, MoreHorizontal, Phone, Plus, Signal, Video, Wifi, Zap } from 'lucide-react';
import './hero-visual.css';
import OwlNotification from './OwlNotification';
import FlyingOwl from './FlyingOwl';

function OwlCharacter() { return <div className="owl"><div className="owl-ear left"/><div className="owl-ear right"/><div className="owl-body"><div className="owl-face"><div className="owl-eye"><i/></div><div className="owl-eye"><i/></div><div className="owl-cheek left"/><div className="owl-cheek right"/><div className="owl-beak"/><div className="owl-smile"/></div><div className="owl-chest"><span className="owl-name-badge">YUPPI</span><Zap size={23}/></div></div><div className="owl-wing left"/><div className="owl-wing right"/><div className="owl-foot left"/><div className="owl-foot right"/></div>; }
function WatchingOwl({ active }) {
  const [flying, setFlying] = useState(false);
  const owlRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const media = window.matchMedia('(pointer: coarse)');
    let frame = 0;
    let latest = null;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!owlRef.current) return;
      for (const property of ['--look-x', '--look-y', '--turn-x', '--turn-y']) owlRef.current.style.removeProperty(property);
    };
    const update = () => {
      frame = 0;
      if (!owlRef.current || !latest || media.matches) return;
      const rect = owlRef.current.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (latest.x - rect.left - rect.width / 2) / 280));
      const y = Math.max(-1, Math.min(1, (latest.y - rect.top - rect.height / 2) / 240));
      owlRef.current.style.setProperty('--look-x', `${x * 9}px`);
      owlRef.current.style.setProperty('--look-y', `${y * 7}px`);
      owlRef.current.style.setProperty('--turn-x', `${-y * 8}deg`);
      owlRef.current.style.setProperty('--turn-y', `${x * 12}deg`);
    };
    const move = event => {
      if (event.pointerType === 'touch' || media.matches) return;
      latest = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    media.addEventListener('change', reset);
    return () => {
      reset();
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
      media.removeEventListener('change', reset);
    };
  }, [active]);
  return <div className={`hero-owl-position ${flying ? "is-flying" : ""}`}><FlyingOwl active={active} homeRef={owlRef} onFlying={setFlying}><OwlCharacter/></FlyingOwl><div className="owl-follow" ref={owlRef} role="img" aria-label="YUPPI, búho robótico con volumen 3D cuya mirada sigue el cursor"><OwlCharacter/></div><div className="owl-introduction"><span>HOLA, SOY YUPPI</span><p>Tú creas. Yo te acompaño.</p></div></div>;
}

const conversation = [
  { from: 'customer', text: '¡Hola! ¿Tienen taladros inalámbricos?', time: '9:41' },
  { from: 'yupi', text: '¡Hola! 👋 Tenemos 8 disponibles a Bs 450 cada uno.', time: '9:41' },
  { from: 'customer', text: 'Perfecto, quiero uno 🙌', time: '9:42' },
  { from: 'yupi', text: '¡Listo! Preparé tu pedido:', time: '9:42', order: true },
];

export default function HeroVisual() {
  const [animated, setAnimated] = useState(true);
  return <div className="phone-scene" data-animated={animated}><div className="scene-glow"/><div className="scene-ring"/><div className="scene-ring outer"/><div className="iphone-mockup" role="group" aria-label="Celular estilo iPhone Pro Max con una conversación ficticia de WhatsApp"><span className="phone-side-button volume"/><span className="phone-side-button power"/><div className="phone-screen"><OwlNotification/><div className="phone-status"><strong>9:41</strong><div className="dynamic-island"><i/></div><span><Signal size={12}/><Wifi size={12}/><BatteryFull size={17}/></span></div><div className="phone-chat-heading"><ArrowLeft size={17}/><div className="phone-avatar">Y<Zap size={9}/></div><div className="phone-contact"><strong>YUPPI IA</strong><span>en línea</span></div><Video size={17}/><Phone size={15}/></div><div className="phone-conversation"><span className="phone-date">HOY</span><span className="phone-example">Conversación de ejemplo</span>{conversation.map((message, i) => <div className={`phone-message ${message.from}`} key={i}><p>{message.text}</p>{message.order && <div className="phone-order"><div><span>01</span><strong>Taladro inalámbrico</strong></div><div><span>Total</span><strong>Bs 450.00</strong></div><span className="phone-order-status"><CheckCheck size={12}/> Listo para confirmar</span></div>}<span className="phone-message-time">{message.time}{message.from === 'customer' && <CheckCheck size={12}/>}</span></div>)}</div><div className="phone-composer" aria-hidden="true"><Plus size={18}/><span>Mensaje<MoreHorizontal size={16}/></span><Mic size={18}/></div><div className="phone-home-bar"/></div></div><WatchingOwl active={animated}/><div className="mascot-controls"><button className="mascot-toggle" type="button" aria-pressed={animated} onClick={() => setAnimated(value => !value)}><span className="mascot-toggle-dot"/>{animated ? "Pausar movimiento" : "Activar movimiento"}</button><a href="#demo" className="phone-demo-link">Tu WhatsApp, con superpoderes <span>Prueba la demo →</span></a></div></div>;
}
