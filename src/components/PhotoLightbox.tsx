import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import type { PreparedProject } from '../data/projects';

export default function PhotoLightbox({ photo, title, index, onClose }: {
  photo: PreparedProject['photos'][number];
  title: string;
  index: number;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const element = dialog.current!;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    element.showModal();
    return () => {
      element.close();
      document.documentElement.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const element = stage.current!;
    element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
    element.scrollTop = (element.scrollHeight - element.clientHeight) / 2;
  }, [zoomed]);

  const { label, ...image } = photo;
  return createPortal(<dialog ref={dialog} className="photo-lightbox" aria-label={`Fotografía ${index + 1} de ${title}`} onCancel={e => {
    e.preventDefault();
    onClose();
  }} onClick={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()} onPointerUp={e => e.stopPropagation()}>
    <div ref={stage} className="photo-lightbox-stage">
      <div className="photo-lightbox-canvas" style={{ '--image-ratio': image.width / image.height, '--photo-zoom': zoomed ? 2.5 : 1 } as CSSProperties} onPointerDown={e => {
        pointer.current = e.isPrimary && e.target === e.currentTarget ? { x: e.clientX, y: e.clientY } : null;
      }} onPointerCancel={() => { pointer.current = null; }} onPointerUp={e => {
        const start = pointer.current;
        pointer.current = null;
        if (start && e.target === e.currentTarget && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 10) onClose();
      }}>
        <img {...image} sizes={zoomed ? '250vw' : '100vw'} alt={`${title}, vista ${index + 1}${label ? `, ${label}` : ''}`} draggable={false} onDoubleClick={() => setZoomed(value => !value)} />
      </div>
    </div>
    <div className="photo-lightbox-controls">
      <button type="button" aria-label={zoomed ? 'Reducir imagen' : 'Ampliar imagen'} aria-pressed={zoomed} onClick={() => setZoomed(value => !value)}>{zoomed ? <ZoomOut size={22} /> : <ZoomIn size={22} />}</button>
      <button type="button" aria-label="Cerrar fotografía" autoFocus onClick={onClose}><X size={24} /></button>
    </div>
    <p className="photo-lightbox-caption">{String(index + 1).padStart(2, '0')} / {title}{label && ` / ${label}`}</p>
  </dialog>, document.body);
}
