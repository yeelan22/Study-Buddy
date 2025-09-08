import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const COLOR_PALETTE = [
  '#1976d2', '#00bfae', '#ffb300', '#f06292',
  '#7e57c2', '#26a69a', '#ff7043', '#bdbdbd'
];

export function NodeContextMenu({
  isOpen,
  onClose,
  position,
  nodeId,
  onEdit,
  onDelete,
  onColorChange
}) {
  // Early bailout
  if (!isOpen || !position) return null;

  const menuRef = useRef(null);
  const firstBtnRef = useRef(null);
  const [coords, setCoords] = useState({ left: position.x, top: position.y });
  const [animateIn, setAnimateIn] = useState(false);

  // Smooth enter animation
  useEffect(() => {
    if (!isOpen) return;
    setAnimateIn(false);
    const raf = requestAnimationFrame(() => setAnimateIn(true));
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  // Reposition to keep inside viewport
  useLayoutEffect(() => {
    if (!isOpen || !position) return;
    const PADDING = 8;
    // Wait a frame so the element has dimensions
    const raf = requestAnimationFrame(() => {
      const el = menuRef.current;
      if (!el) return;

      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let left = position.x;
      let top = position.y;

      if (left + w + PADDING > vw) left = Math.max(PADDING, vw - w - PADDING);
      if (top + h + PADDING > vh) top = Math.max(PADDING, vh - h - PADDING);

      setCoords({ left, top });
    });
    return () => cancelAnimationFrame(raf);
  }, [isOpen, position]);

  // Focus first action on open
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => firstBtnRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Close on outside click and on Escape
  useEffect(() => {
    if (!isOpen) return;

    const onOutside = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) onClose();
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        rovingFocus(e.key);
      }
    };

    // small delay to avoid immediate close on open
    const id = setTimeout(() => {
      document.addEventListener('pointerdown', onOutside, true);
    }, 60);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      clearTimeout(id);
      document.removeEventListener('pointerdown', onOutside, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  // Simple roving focus between focusable controls
  const rovingFocus = (key) => {
    const root = menuRef.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll('[data-focusable="true"]'));
    if (!nodes.length) return;

    let index = nodes.indexOf(document.activeElement);
    if (index === -1) index = 0;

    const isNext = key === 'ArrowDown' || key === 'ArrowRight';
    const isPrev = key === 'ArrowUp' || key === 'ArrowLeft';

    if (isNext) index = (index + 1) % nodes.length;
    if (isPrev) index = (index - 1 + nodes.length) % nodes.length;

    nodes[index]?.focus();
  };

  const menu = (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Node menu"
      className={[
        'fixed z-[10001] min-w-[200px] p-2',
        // Card surface
        'rounded-2xl border border-black/5 dark:border-white/10',
        'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl',
        'shadow-xl shadow-black/10 dark:shadow-black/30',
        'ring-1 ring-black/5 dark:ring-white/10',
        // Text + selection
        'text-sm text-gray-800 dark:text-gray-100 select-none'
      ].join(' ')}
      style={{
        left: `${coords.left}px`,
        top: `${coords.top}px`,
        transformOrigin: 'top left',
        opacity: animateIn ? 1 : 0,
        transform: animateIn ? 'translateY(0) scale(1)' : 'translateY(4px) scale(0.98)',
        transition: 'opacity 120ms ease, transform 140ms cubic-bezier(.2,.8,.2,1)'
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <button
        ref={firstBtnRef}
        data-focusable="true"
        type="button"
        onClick={() => onEdit(nodeId)}
        className={[
          'w-full flex items-center gap-2 px-3 py-2 rounded-xl',
          'hover:bg-black/5 dark:hover:bg-white/10',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
        ].join(' ')}
      >
        <span aria-hidden>✏️</span>
        <span>Edit</span>
      </button>

      <div className="px-3 pt-2 pb-1 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Color
      </div>

      <div className="px-3 pb-2 grid grid-cols-8 gap-2">
        {COLOR_PALETTE.map((color) => (
          <button
            key={color}
            type="button"
            data-focusable="true"
            aria-label={`Change color to ${color}`}
            title={`Change to ${color}`}
            onClick={() => onColorChange(nodeId, color)}
            className={[
              'h-7 w-7 rounded-full',
              'ring-2 ring-transparent hover:ring-black/20 dark:hover:ring-white/30',
              'shadow-sm shadow-black/10',
              'transition-transform duration-150 ease-out hover:scale-110',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
            ].join(' ')}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <button
        data-focusable="true"
        type="button"
        onClick={() => onDelete(nodeId)}
        className={[
          'w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 dark:text-red-400',
          'hover:bg-red-50/80 dark:hover:bg-red-500/10',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500'
        ].join(' ')}
      >
        <span aria-hidden>🗑️</span>
        <span>Delete</span>
      </button>
    </div>
  );

  // Portal keeps it above everything and avoids clipping within containers
  return createPortal(menu, document.body);
}