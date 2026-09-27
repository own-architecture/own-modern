import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ArrowRight, Pause, Play } from 'lucide-react';

export default function Entrance({ selector = false }: { selector?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [entered, setEntered] = useState(selector);
  const [paused, setPaused] = useState(false);
  const { contextSafe } = useGSAP(() => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create('originalSplit', '0.16,1,0.3,1');
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: reduce)', () => { video.current?.pause(); setPaused(true); });
    return () => mm.revert();
  }, { scope: root });
  const enter = contextSafe(() => {
    setEntered(true);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.to('.intro-screen', { yPercent: -100, autoAlpha: 0, duration: reduce ? 0 : 1.25, ease: 'power2.inOut', onComplete: () => {
      video.current?.pause();
      root.current?.querySelector<HTMLAnchorElement>('.split-pane')?.focus({ preventScroll: true });
    } });
    gsap.fromTo('.entry-split', { scale: 1.035 }, { scale: 1, duration: reduce ? 0 : 1.1, ease: 'power3.out' });
  });
  const resize = contextSafe((side: 'studio' | 'projects' | null) => {
    if (!matchMedia('(min-width: 768px) and (hover: hover)').matches) return;
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : .9;
    gsap.to('.studio-pane', { flexGrow: side === 'studio' ? 1.22 : side === 'projects' ? .78 : 1, duration, ease: 'originalSplit', overwrite: true });
    gsap.to('.projects-pane', { flexGrow: side === 'projects' ? 1.22 : side === 'studio' ? .78 : 1, duration, ease: 'originalSplit', overwrite: true });
  });
  return <div ref={root} className="entrance">
    <section className="entry-split" aria-label="Explorar OWN" inert={!entered} onMouseLeave={() => resize(null)}>
      <a href="/estudio/" className="split-pane studio-pane" data-dark onMouseEnter={() => resize('studio')}>
        <img src="/media/image3.jpeg" alt="" className="pane-image" />
        <div className="pane-copy"><span className="eyebrow">01 / OWN</span><h1>ESTUDIO</h1><p>Filosofía, proceso y una forma de entender la arquitectura desde la luz, la materia, la proporción y el lugar.</p><span className="split-action">Descubrir estudio <ArrowRight size={22}/></span></div>
      </a>
      <a href="/proyectos/" className="split-pane projects-pane" onMouseEnter={() => resize('projects')}>
        <img src="/media/image2.jpeg" alt="" className="pane-image" />
        <div className="pane-copy"><span className="eyebrow">02 / ARCHITECTURE</span><h1>PROYECTOS</h1><p>Viviendas concebidas desde la relación entre paisaje, materia, luz y experiencia de habitar.</p><span className="split-action">Ver proyectos <ArrowRight size={22}/></span></div>
      </a>
      <a className="selector-home" href="/" aria-label="Volver al inicio">OWN</a>
    </section>
    {!selector && <section className="intro-screen" data-dark inert={entered} aria-label="OWN Architecture">
      <video ref={video} autoPlay muted loop playsInline poster="/media/inicio-poster.jpg"><source src="/media/inicio.mp4" type="video/mp4" /></video>
      <span className="intro-caption">OWN ARCHITECTURE</span>
      <button className="intro-own" onClick={enter} aria-label="Entrar en OWN Architecture">OWN</button>
      <div className="intro-bottom"><span>Arquitectura, materia y lugar.</span><button onClick={enter} className="inline-flex items-center gap-4">Entrar <ArrowRight size={22}/></button></div>
      <button className="video-control" aria-label={paused ? 'Reproducir vídeo' : 'Pausar vídeo'} onClick={() => { if (paused) { void video.current?.play().then(() => setPaused(false)).catch(() => setPaused(true)); } else { video.current?.pause(); setPaused(true); } }}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button>
    </section>}
  </div>;
}
