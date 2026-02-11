# Responsive Design Guide

## 📱 Breakpoint System

HOME PPK uses a comprehensive breakpoint system for optimal display across all devices.

### Standard Breakpoints

```
xs: 320px   - Extra small devices (iPhone SE, small phones)
sm: 640px   - Small devices (iPhone 12)
md: 768px   - Medium devices (iPad, tablets)
lg: 1024px  - Large devices (iPad Pro)
xl: 1280px  - Extra large (Desktop)
2xl: 1536px - 2X large (4K)
```

### Custom Breakpoints

```
full-hd: 1920px  - Full HD monitors
2k: 2560px       - 2K monitors  
4k: 3840px       - 4K monitors
portrait: (orientation: portrait)
landscape: (orientation: landscape)
touch: (hover: none) - Touch devices
no-touch: (hover: hover) - Mouse/trackpad
retina: 192dpi or 2x DPI - High DPI screens
```

---

## 🎯 Mobile-First Approach

All styles start mobile-first and scale up:

```typescript
// Default (mobile - 320px+)
<div className="text-sm p-2 w-full">

// Tablet and up (640px+)
<div className="sm:text-base sm:p-4 sm:w-1/2">

// Tablet (768px+)
<div className="md:grid md:grid-cols-2">

// Desktop (1024px+)
<div className="lg:grid lg:grid-cols-4 lg:gap-6">

// 4K (3840px+)
<div className="4k:grid 4k:grid-cols-6">
```

---

## 💻 Responsive Patterns

### 1️⃣ Flexible Columns

**Mobile**: 1 column  
**Tablet**: 2 columns  
**Desktop**: 3 columns

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

---

### 2️⃣ Navigation

**Mobile**: Hamburger menu  
**Tablet & Desktop**: Horizontal menu

```typescript
<nav className="hidden lg:flex">
  {/* Desktop menu */}
</nav>

<button className="lg:hidden">
  {/* Mobile hamburger */}
</button>
```

---

### 3️⃣ Padding & Margins

```typescript
// 2px on mobile, 4px on tablet, 6px on desktop
<div className="p-2 sm:p-4 lg:p-6">
```

---

### 4️⃣ Font Sizes

```typescript
// Responsive font sizing
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Heading
</h1>
```

---

### 5️⃣ Image Responsive

```typescript
<img 
  src="image.jpg" 
  className="w-full h-auto max-w-full object-cover"
  alt="Description"
/>
```

---

## 📊 Device-Specific Styling

### Touch Devices (Mobile & Tablet)

```typescript
// Larger tap targets for touch
<button className="touch:p-4 touch:text-lg">
  Tap me
</button>
```

### Desktop Only

```typescript
<div className="desktop-only">
  {/* Shows only on desktop */}
</div>

// Equivalent to:
<div className="hidden lg:block">
  {/* Shows only on desktop */}
</div>
```

### Print Styles

```typescript
<div className="print:bg-white print:text-black">
  {/* Custom print styles */}
</div>
```

---

## 🎨 Grid Layouts

### Simple Grid

```typescript
// 1 col on mobile, 2 on tablet, 3 on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Flexible Grid

```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* Auto-responsive items */}
</div>
```

### Sidebar Layout

```typescript
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <aside className="lg:col-span-1">Sidebar</aside>
  <main className="lg:col-span-3">Content</main>
</div>
```

---

## 📏 Container Sizes

| Breakpoint | Max Width |
|-----------|-----------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

```typescript
<div className="container mx-auto px-4">
  {/* Auto width with max-width at each breakpoint */}
</div>
```

---

## 🔲 Display Properties

### Hide/Show by Device

```typescript
// Hide on mobile, show on tablet+
<div className="hidden sm:block">Tablet+</div>

// Show on mobile, hide on tablet+
<div className="sm:hidden">Mobile only</div>

// Show only on desktop
<div className="desktop-only">Desktop only</div>

// Show only on mobile
<div className="mobile-only">Mobile only</div>
```

---

## 🎯 Spacing Responsive

```typescript
// Different spacing per breakpoint
<div className="p-2 sm:p-4 md:p-6 lg:p-8">
  {/* 2px on mobile, 4px on sm, 6px on md, 8px on lg */}
</div>

<div className="m-2 sm:m-4 lg:m-6">
  {/* Responsive margins */}
</div>

<div className="gap-2 sm:gap-4 md:gap-6">
  {/* Responsive gap in flex/grid */}
</div>
```

---

## 📱 Common Viewport Sizes

### Mobile
```
- iPhone SE: 375×667px
- iPhone 12: 390×844px
- Samsung A12: 412×915px
- Small Android: 360×640px
Large Android: 480×800px
```

### Tablet
```
- iPad: 768×1024px
- iPad Pro 11": 834×1194px
- iPad Pro 12.9": 1024×1366px
- Android Tablet: 600×800px
```

### Desktop
```
- Laptop 13": 1280×800px
- Laptop 15": 1440×900px
- Desktop 24": 1920×1080px (Full HD)
- Desktop 27": 2560×1440px (2K)
- 4K Monitor: 3840×2160px
```

---

## ⚡ Performance Tips

1. **Min media query breakpoint**: Use semantic breakpoints
2. **Mobile first**: Build for mobile, enhance for larger screens
3. **Avoid nesting**: Keep utility classes simple
4. **Use container queries**: For component-level responsive design
5. **Test on real devices**: Emulation is not always accurate

---

## 🔍 Testing Responsive Design

### Browser DevTools
1. Open DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select device or custom size
4. Test at different zoom levels

### Online Tools
- [ResponsiveDesignChecker](https://responsivedesignchecker.com/)
- [BrowserStack](https://www.browserstack.com/)
- [Lambdatest](https://www.lambdatest.com/)

### Physical Testing
- Test on actual iOS devices
- Test on actual Android devices
- Test on tablets
- Test on different desktop monitors

---

## 📊 Grid Usage Examples

### 2 Column (Tablet) to 4 Column (Desktop)

```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <Card />
  <Card />
  <Card />
  <Card />
</div>
```

### Dashboard Layout

```typescript
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <div className="lg:col-span-3">Main Content</div>
  <div className="lg:col-span-1">Sidebar</div>
</div>
```

### Hero Section

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
  <div>Text Content</div>
  <img className="w-full" alt="Hero" />
</div>
```

---

## ✅ Responsive Checklist

- [ ] ✅ Tested on 320px (mobile minimum)
- [ ] ✅ Tested on 768px (tablet)
- [ ] ✅ Tested on 1024px (desktop)
- [ ] ✅ Tested on 1920px (desktop large)
- [ ] ✅ Tested on touch devices
- [ ] ✅ Tested portrait orientation
- [ ] ✅ Tested landscape orientation
- [ ] ✅ No horizontal scroll
- [ ] ✅ Text readable on all sizes
- [ ] ✅ Touch targets 44x44px minimum
- [ ] ✅ Images scale properly
- [ ] ✅ Forms work on mobile

---

**Updated**: February 2026  
**Version**: 1.0.0  
**Status**: Fully Responsive ✅
