import React, { useState, useRef, useEffect } from 'react';
import CVTemplateRenderer from './templates/CVTemplates';
import { CricketCVFull } from './CVTypes';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface CVLivePreviewProps {
  cv: CricketCVFull;
  isPreview?: boolean;
}

const A4_W = 794;
const A4_H = 1123;

export default function CVLivePreview({ cv, isPreview = true }: CVLivePreviewProps) {
  const [zoom, setZoom] = useState(0.6);
  const [isManualZoom, setIsManualZoom] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePageCount = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail === 'number' && detail > 0) {
        setPageCount(detail);
      }
    };
    window.addEventListener('cv-page-count', handlePageCount);
    return () => window.removeEventListener('cv-page-count', handlePageCount);
  }, []);

  const unscaledH = A4_H * pageCount + (pageCount - 1) * 24;

  const computeFit = () => {
    if (!outerRef.current) return;
    const rect = outerRef.current.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return;
    const zoomX = (rect.width - 32) / A4_W;
    const zoomY = (rect.height - 32) / A4_H;
    setZoom(Math.max(Math.min(zoomX, zoomY, 1.0), 0.25));
  };

  useEffect(() => {
    computeFit();
    const t = setTimeout(computeFit, 200);
    const onResize = () => { if (!isManualZoom) computeFit(); };
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCount]);

  useEffect(() => {
    if (!isManualZoom) computeFit();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isManualZoom]);

  const scaledW = Math.round(A4_W * zoom);
  const scaledH = Math.round(unscaledH * zoom);

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

      {/* Top bar */}
      <div className="shrink-0 bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold text-slate-200 uppercase tracking-wide text-[10px]">
          {cv.templateId} · live preview
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => { setIsManualZoom(true); setZoom(z => Math.max(z - 0.05, 0.25)); }} className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition" title="Zoom out"><ZoomOut className="w-3.5 h-3.5" /></button>
          <span className="font-mono text-[10px] w-9 text-center bg-slate-800 rounded py-0.5">{Math.round(zoom * 100)}%</span>
          <button onClick={() => { setIsManualZoom(true); setZoom(z => Math.min(z + 0.05, 1.5)); }} className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition" title="Zoom in"><ZoomIn className="w-3.5 h-3.5" /></button>
          <button onClick={() => setIsManualZoom(false)} className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition ml-1" title="Fit page"><Maximize2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* A4 viewport — scrolls vertically if multi-page */}
      <div
        ref={outerRef}
        className="flex-1 overflow-y-auto flex items-start justify-center p-4"
        style={{ background: '#0a0d1a', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
      >
        {/* Wrapper exactly the scaled A4 size — prevents any browser overflow/clip */}
        <div style={{ width: scaledW, height: scaledH, position: 'relative', flexShrink: 0 }} className="shadow-2xl">
          <div
            style={{
              width: A4_W,
              height: unscaledH,
              transform: `scale(${zoom}) translateZ(0)`,
              WebkitTransform: `scale(${zoom}) translateZ(0)`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
              transition: 'opacity 0.25s ease',
              willChange: 'transform',
            }}
          >
            <CVTemplateRenderer
              cv={cv}
              accentColour={cv.accentColour}
              font={cv.font}
              isPreview={isPreview}
            />
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="shrink-0 bg-slate-950 px-4 py-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
        <span>A4 · 210 × 297 mm</span>
        <span style={{ color: '#D4AF37' }} className="font-semibold uppercase">{pageCount > 1 ? `${pageCount} PAGES` : '1 PAGE'}</span>
      </div>

    </div>
  );
}
