import { useState } from 'react';
import { useFloating, offset, flip, shift, autoUpdate, FloatingPortal } from '@floating-ui/react';

export function Tooltip({ text, children }) {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, update } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    placement: 'top',
  });

  return (
    <>
      <span
        ref={refs.setReference}
        className="inline-block"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </span>

      {open && (
        <FloatingPortal>
          <span
            ref={refs.setFloating}
            style={floatingStyles}
            className="z-[2147483647] px-2 py-1 rounded bg-black text-white text-xs whitespace-nowrap shadow-lg pointer-events-none"
          >
            {text}
          </span>
        </FloatingPortal>
      )}
    </>
  );
}