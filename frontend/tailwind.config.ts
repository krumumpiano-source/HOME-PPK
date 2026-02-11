/**
 * Tailwind CSS Configuration - Responsive Design
 * Optimized for mobile-first approach with full device support
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      // Screens for responsive design
      screens: {
        'xs': '320px',    // Extra small (iPhone SE)
        'sm': '640px',    // Small (iPhone 12)
        'md': '768px',    // Medium (iPad)
        'lg': '1024px',   // Large (iPad Pro)
        'xl': '1280px',   // Extra large (Desktop)
        '2xl': '1536px',  // 2X large (4K)
        'full-hd': '1920px', // Full HD
        '2k': '2560px',   // 2K Resolution
        '4k': '3840px',   // 4K Resolution
        
        // Portrait/Landscape
        'portrait': { 'raw': '(orientation: portrait)' },
        'landscape': { 'raw': '(orientation: landscape)' },
        
        // Touch devices
        'touch': { 'raw': '(hover: none) and (pointer: coarse)' },
        'no-touch': { 'raw': '(hover: hover) and (pointer: fine)' },
        
        // Retina/High DPI
        'retina': { 'raw': '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)' },
        
        // Print
        'print': { 'raw': 'print' },
      },
      
      // Colors
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      
      // Font sizes with responsive scaling
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      
      // Font families
      fontFamily: {
        thai: ['IBM Plex Sans Thai', 'Sarabun', 'Tahoma', 'sans-serif'],
        english: ['Inter', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        mono: ['Courier New', 'IBM Plex Mono', 'monospace'],
      },
      
      // Spacing
      spacing: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '192': '48rem',
      },
      
      // Breakpoint-specific spacing
      margin: {
        'auto': 'auto',
      },
      
      // Border radius
      borderRadius: {
        'none': '0px',
        'sm': '0.25rem',
        'base': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        'full': '9999px',
      },
      
      // Shadow
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'dark': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      
      // Transitions
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms',
      },
      
      // Z-index for element layering
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
    },
  },
  
  plugins: [
    // Responsive variants
    function ({ addVariant }) {
      // Add custom variants for better responsive control
      addVariant('mobile-only', '@media (max-width: 639px)')
      addVariant('tablet-only', '@media (min-width: 640px) and (max-width: 1023px)')
      addVariant('desktop-only', '@media (min-width: 1024px)')
    },
  ],
  
  // Safelist for dynamic classes (if using CSS-in-JS)
  safelist: [
    // Colors
    'bg-primary-50', 'bg-primary-500', 'text-primary-600',
    'border-primary-200', 'ring-primary-500',
    // Sizes
    'w-full', 'h-full', 'w-1/2', 'h-auto',
    // Display
    'flex', 'grid', 'hidden', 'block', 'inline-block',
  ],
  
  corePlugins: {
    // Don't disable any core plugins
  },
  
  // Important flag for utility classes
  important: false,
}
