import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/react-dom';
import { X } from 'lucide-react';

export function FloatingBox({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  showCloseButton = true,
  position = 'center', // 'center', 'top', 'bottom', 'left', 'right', 'custom'
  customPosition = null, // { x, y } for custom positioning
  size = 'md', // 'sm', 'md', 'lg', 'xl', 'full'
  overlay = false,
  overlayClickToClose = false,
  className = '',
  zIndex = 100,
  animation = true,
  ...props 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const floatingRef = useRef(null);

  const sizeClasses = {
    sm: 'w-80 h-64',
    md: 'w-96 h-80',
    lg: 'w-[500px] h-[400px]',
    xl: 'w-[600px] h-[500px]',
    full: 'w-[95vw] h-[90vh]'
  };

  const positionClasses = {
    center: 'fixed inset-0 flex items-center justify-center',
    top: 'fixed top-4 left-1/2 transform -translate-x-1/2',
    bottom: 'fixed bottom-4 left-1/2 transform -translate-x-1/2',
    left: 'fixed left-4 top-1/2 transform -translate-y-1/2',
    right: 'fixed right-4 top-1/2 transform -translate-y-1/2',
    custom: 'fixed'
  };

  // Handle open/close with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (animation) {
        setIsAnimating(true);
        // Small delay to ensure DOM is ready
        setTimeout(() => setIsAnimating(false), 50);
      }
    } else {
      if (animation) {
        setIsAnimating(true);
        setTimeout(() => {
          setIsVisible(false);
          setIsAnimating(false);
        }, 300);
      } else {
        setIsVisible(false);
      }
    }
  }, [isOpen, animation]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Handle overlay click (disabled)
  const handleOverlayClick = (e) => {
    // Overlay functionality disabled
  };

  // Handle custom positioning
  useEffect(() => {
    if (position === 'custom' && customPosition && floatingRef.current) {
      const element = floatingRef.current;
      
      // Use requestAnimationFrame to ensure the element is rendered before positioning
      requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        console.log('FloatingBox positioning:', { 
          customPosition, 
          rect, 
          viewportWidth, 
          viewportHeight 
        });
        
        // Calculate position with viewport bounds checking
        let x = customPosition.x;
        let y = customPosition.y;
        
        // Ensure minimum margins
        const margin = 10;
        const menuWidth = rect.width || 160; // fallback width
        const menuHeight = rect.height || 200; // fallback height
        
        // Adjust if menu would go off-screen horizontally
        if (x + menuWidth > viewportWidth - margin) {
          x = viewportWidth - menuWidth - margin;
        }
        if (x < margin) {
          x = margin;
        }
        
        // Adjust if menu would go off-screen vertically
        if (y + menuHeight > viewportHeight - margin) {
          y = customPosition.y - menuHeight - 10; // Show above the node instead
        }
        if (y < margin) {
          y = margin;
        }
        
        // Apply the position
        element.style.position = 'fixed';
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.zIndex = '10001';
        
        console.log('FloatingBox final position:', { x, y, applied: true });
      });
    }
  }, [position, customPosition]);

  if (!isVisible) return null;

  const content = (
    <div 
      className={`${positionClasses[position]} z-[${zIndex}]`}
      style={position === 'custom' && customPosition ? {
        position: 'fixed',
        left: `${customPosition.x}px`,
        top: `${customPosition.y}px`,
        zIndex: 10001
      } : {}}
    >

      {/* Floating Box */}
      <div
        ref={floatingRef}
        className={`
          relative bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden
          flex flex-col
          ${sizeClasses[size]}
          ${animation ? (isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100') : ''}
          transition-all duration-300 ease-out
          ${className}
        `}
        onMouseDown={(e) => e.stopPropagation()}
        {...props}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

// Preset components for common use cases
export function FloatingDialog({ isOpen, onClose, title, children, size = 'md', ...props }) {
  return (
    <FloatingBox
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      position="center"
      overlay={false}
      {...props}
    >
      {children}
    </FloatingBox>
  );
}

export function FloatingTooltip({ isOpen, onClose, children, position = 'top', size = 'sm', ...props }) {
  return (
    <FloatingBox
      isOpen={isOpen}
      onClose={onClose}
      position={position}
      size={size}
      overlay={false}
      showCloseButton={false}
      {...props}
    >
      {children}
    </FloatingBox>
  );
}

export function FloatingContextMenu({ isOpen, onClose, children, customPosition, ...props }) {
  return (
    <FloatingBox
      isOpen={isOpen}
      onClose={onClose}
      position="custom"
      customPosition={customPosition}
      size="sm"
      overlay={false}
      showCloseButton={false}
      animation={false}
      {...props}
    >
      {children}
    </FloatingBox>
  );
}
