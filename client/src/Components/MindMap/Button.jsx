// src/components/ui/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';

export function Button({ children, className = '', variant = 'primary', onClick, ...props }) {
  const baseStyles = 'px-4 py-2 rounded text-sm font-medium transition';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-gray-400 text-gray-800 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger']),
  onClick: PropTypes.func,
};
