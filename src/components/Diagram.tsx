import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { DiagramStep } from '../data/projects';

export default function Diagram({ steps }: { steps: DiagramStep[] }) {
  const [step, setStep] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.from('.diagram-image', { autoAlpha: 0, duration: .45, ease: 'power2.out' });
  }, { scope: root, dependencies: [step], revertOnUpdate: true });
  if (!steps.length) return null;
  const current = Math.min(step, steps.length - 1);
  const change = (offset: number) => setStep((current + offset + steps.length) % steps.length);
  return <div ref={root} className="diagram" aria-label="Esquemas del proyecto" onKeyDown={e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); change(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); change(-1); }
  }}>
    <button className="diagram-stage" onClick={() => change(1)} aria-label="Ver siguiente esquema">
      <img className="diagram-image" src={steps[current].src} alt={steps[current].label} width="1344" height="768" />
    </button>
    <div className="diagram-controls">
      <button className="icon-button" title="Esquema anterior" aria-label="Esquema anterior" onClick={() => change(-1)}><ArrowLeft size={18}/></button>
      <div className="diagram-dots">{steps.map((s, i) => <button key={`${s.src}-${i}`} aria-label={`Etapa ${i + 1}: ${s.label}`} aria-current={i === current ? 'step' : undefined} onClick={() => setStep(i)}><span /></button>)}</div>
      <button className="icon-button" title="Siguiente esquema" aria-label="Siguiente esquema" onClick={() => change(1)}><ArrowRight size={18}/></button>
    </div>
    <p className="diagram-caption" aria-live="polite">{String(current + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')} — {steps[current].label}</p>
  </div>;
}
