export function OwlLogo() {
  return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="owl-logo"><path d="M8 20 6 6l14 9h8L42 6l-2 14v14c0 7-7 11-16 11S8 41 8 34Z" fill="url(#owlLogoShell)"/><rect x="9" y="16" width="30" height="20" rx="10" fill="#08162D"/><circle cx="17" cy="25" r="6" fill="#00D6CC"/><circle cx="31" cy="25" r="6" fill="#00D6CC"/><circle cx="18" cy="25" r="3" fill="#08162D"/><circle cx="30" cy="25" r="3" fill="#08162D"/><circle cx="19" cy="23" r="1.3" fill="white"/><circle cx="31" cy="23" r="1.3" fill="white"/><path d="m21 31 3 4 3-4" fill="#FFD47B"/><path d="M20 38q4 3 8 0" stroke="#1677FF" strokeWidth="2" strokeLinecap="round"/><defs><linearGradient id="owlLogoShell" x1="8" y1="10" x2="40" y2="45" gradientUnits="userSpaceOnUse"><stop stopColor="white"/><stop offset="1" stopColor="#94B6D3"/></linearGradient></defs></svg>;
}

export default function OwlNotification() {
  return <div className="yupi-notification" aria-hidden="true"><span className="notification-logo"><OwlLogo/></span><div className="notification-content"><div><strong>YUPI IA</strong><span>ahora · demo</span></div><p>¡Nuevo pedido preparado! 🙌</p><small>Yo me encargo. Tú sigue creando.</small></div></div>;
}
