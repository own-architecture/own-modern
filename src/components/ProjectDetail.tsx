import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { Project } from '../data/projects';
import Diagram from './Diagram';

export default function ProjectDetail({ project, next }: { project: Project; next: Project }) {
  const root = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<'photos' | 'text'>('photos');
  const touch = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(0);
  const activeSide = useRef<'photos' | 'text' | null>(null);
  const { contextSafe } = useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      root.current?.querySelectorAll<HTMLElement>('.photo-frame').forEach(el => {
        gsap.fromTo(el, { scale: .91 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'center center', scrub: .7 } });
      });
    });
    return () => mm.revert();
  }, { scope: root });
  const expand = contextSafe((side: 'photos' | 'text' | null) => {
    if (!matchMedia('(min-width: 768px) and (hover: hover)').matches) return;
    if (activeSide.current === side) return;
    activeSide.current = side;
    // Animate one unitless percentage, never computed pixel tracks into percent tracks.
    gsap.to('.detail-columns', { '--photo-share': side === 'photos' ? 62 : side === 'text' ? 42 : 55, duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1.1, ease: 'power2.inOut', overwrite: true });
  });
  const switchTab = (nextTab: 'photos' | 'text') => {
    if (nextTab === tab) return;
    setTab(nextTab);
  };
  return <div ref={root} className="project-detail" data-tab={tab} onClickCapture={e => {
    if (Date.now() < suppressClick.current) { e.preventDefault(); e.stopPropagation(); }
  }} onPointerDown={e => {
    if (e.pointerType !== 'touch' || !e.isPrimary) return;
    touch.current = { x: e.clientX, y: e.clientY };
  }} onPointerCancel={() => { touch.current = null; }} onPointerUp={e => {
    if (!touch.current || matchMedia('(min-width: 768px)').matches) return;
    const dx = e.clientX - touch.current.x;
    const dy = e.clientY - touch.current.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      suppressClick.current = Date.now() + 400;
      switchTab(tab === 'photos' ? 'text' : 'photos');
    }
    touch.current = null;
  }}>
    <div className="project-topbar"><a href="/proyectos/" className="inline-flex items-center gap-3"><ArrowLeft size={16}/> Todos los proyectos</a><span>{project.title}</span></div>
    <div className="mobile-notch" role="group" aria-label="Vista del proyecto">
      <button aria-pressed={tab === 'photos'} onClick={() => switchTab('photos')}><ArrowLeft size={14}/> Fotos</button>
      <button aria-pressed={tab === 'text'} onClick={() => switchTab('text')}>Proyecto <ArrowRight size={14}/></button>
    </div>
    <div className="detail-columns" onMouseLeave={() => expand(null)} onPointerMove={e => {
      // A moving column boundary must not trigger another resize under a still cursor.
      if (e.pointerType !== 'mouse' || (!e.movementX && !e.movementY)) return;
      const target = e.target as HTMLElement;
      expand(target.closest('.photo-column') ? 'photos' : 'text');
    }}>
      <section className="photo-column" aria-label="Fotografías">
        {project.photos.map((src, i) => <figure key={src} className="photo-outer"><div className="photo-frame"><img src={src} alt={`${project.title}, vista ${i + 1}`} width="1500" height="1000" loading={i ? 'lazy' : 'eager'} onLoad={() => ScrollTrigger.refresh()} /></div><figcaption>{String(i + 1).padStart(2, '0')} / {project.title}</figcaption></figure>)}
      </section>
      <section className="text-column" aria-label="Descripción del proyecto"><div className="text-column-inner">
        <div className="project-title"><span className="eyebrow">Residencial / {project.location}</span><h1>{project.title}</h1>{project.statement && <p className="project-statement">{project.statement}</p>}</div>
        {project.sections[0] && <section className="project-copy"><h2>{project.sections[0].title}</h2><p>{project.sections[0].text}</p></section>}
        <Diagram steps={project.steps}/>
        {project.sections.slice(1).map(section => <section className="project-copy" key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}
        <a href={`/proyectos/${next.slug}/`} className="next-project"><span className="eyebrow">Siguiente proyecto</span><span>{next.title}<ArrowRight size={25}/></span></a>
      </div></section>
    </div>
  </div>;
}
