// Aide visuelle : les 8 angles à photographier, comme à l'état des lieux d'une location de véhicule.
// Vue du dessus : l'avant de la voiture est en haut ; le point orange indique d'où prendre la photo.
const VUES = [
  { label: "Avant", cam: [30, 4], dir: [30, 14] },
  { label: "Avant droit", cam: [54, 8], dir: [43, 18] },
  { label: "Côté droit", cam: [56, 40], dir: [44, 40] },
  { label: "Arrière droit", cam: [54, 72], dir: [43, 62] },
  { label: "Arrière", cam: [30, 76], dir: [30, 66] },
  { label: "Arrière gauche", cam: [6, 72], dir: [17, 62] },
  { label: "Côté gauche", cam: [4, 40], dir: [16, 40] },
  { label: "Avant gauche", cam: [6, 8], dir: [17, 18] },
];

function Voiture({ cam, dir }) {
  return (
    <svg viewBox="0 0 60 80" className="w-full h-auto" aria-hidden="true">
      {/* roues */}
      <rect x="14" y="18" width="4" height="12" rx="1.5" fill="#fff" fillOpacity="0.55" />
      <rect x="42" y="18" width="4" height="12" rx="1.5" fill="#fff" fillOpacity="0.55" />
      <rect x="14" y="50" width="4" height="12" rx="1.5" fill="#fff" fillOpacity="0.55" />
      <rect x="42" y="50" width="4" height="12" rx="1.5" fill="#fff" fillOpacity="0.55" />
      {/* carrosserie */}
      <rect x="17" y="10" width="26" height="60" rx="10" fill="#fff" fillOpacity="0.9" />
      {/* pare-brise / lunette */}
      <path d="M21 26 Q30 22 39 26 L38 34 L22 34 Z" fill="#9a4510" fillOpacity="0.75" />
      <path d="M22 52 L38 52 L39 58 Q30 62 21 58 Z" fill="#9a4510" fillOpacity="0.75" />
      {/* direction de la prise de vue */}
      <line x1={cam[0]} y1={cam[1]} x2={dir[0]} y2={dir[1]} stroke="#211C17" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx={cam[0]} cy={cam[1]} r="3.6" fill="#211C17" />
      <circle cx={cam[0]} cy={cam[1]} r="1.4" fill="#fff" />
    </svg>
  );
}

export default function CarSidesGuide() {
  return (
    <div className="mb-4">
      <p className="text-white/80 text-xs mb-2">Prenez la voiture sous ces angles, puis les détails (rayures, jantes, intérieur) :</p>
      <div className="grid grid-cols-4 gap-2">
        {VUES.map((v) => (
          <div key={v.label} className="bg-white/15 rounded-lg px-1 pt-1.5 pb-1 text-center">
            <div className="w-10 mx-auto">
              <Voiture cam={v.cam} dir={v.dir} />
            </div>
            <div className="text-[10px] leading-tight text-white mt-0.5">{v.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
