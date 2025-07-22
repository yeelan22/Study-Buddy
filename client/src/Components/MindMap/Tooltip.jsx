import React, { useState, useEffect, useRef } from 'react';

export function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setShow(false);
    }
    if (show) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [show]);

  return (
    <span
      className="relative inline-block"
      ref={ref}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="absolute z-50 left-1/2 -translate-x-1/2 -top-8 px-2 py-1 rounded bg-black text-white text-xs whitespace-nowrap shadow-lg pointer-events-none">
          {text}
        </span>
      )}
    </span>
  );
}