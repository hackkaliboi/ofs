# SolmintX Design System

This document outlines the comprehensive design system for SolmintX, ensuring consistency across all pages and components.

## Color Palette

### Primary Colors
- **Primary Gold**: `hsl(45, 100%, 50%)` - Main brand color
- **Primary Foreground**: `hsl(0, 0%, 8%)` - Text on primary backgrounds
- **Custodia Brand**: `hsl(45, 100%, 50%)` - Same as primary, brand consistency

### Background Colors
- **Light Mode Background**: `hsl(0, 0%, 98%)` - Main background
- **Dark Mode Background**: `hsl(0, 0%, 8%)` - Main dark background
- **Card Light**: `hsl(0, 0%, 100%)` - Card backgrounds in light mode
- **Card Dark**: `hsl(0, 0%, 12%)` - Card backgrounds in dark mode

### Text Colors
- **Foreground Light**: `hsl(0, 0%, 8%)` - Primary text in light mode
- **Foreground Dark**: `hsl(45, 100%, 85%)` - Primary text in dark mode
- **Muted Light**: `hsl(0, 0%, 45%)` - Secondary text in light mode
- **Muted Dark**: `hsl(0, 0%, 65%)` - Secondary text in dark mode

### Semantic Colors
- **Success**: `hsl(142, 76%, 36%)` (light) / `hsl(142, 69%, 29%)` (dark)
- **Warning**: `hsl(38, 92%, 50%)` (light) / `hsl(38, 92%, 40%)` (dark)
- **Info**: `hsl(199, 89%, 48%)` (light) / `hsl(199, 89%, 38%)` (dark)
- **Destructive**: `hsl(0, 84.2%, 60.2%)` (light) / `hsl(0, 62.8%, 30.6%)` (dark)

### Border & Input Colors
- **Border Light**: `hsl(45, 30%, 85%)`
- **Border Dark**: `hsl(0, 0%, 20%)`
- **Input Light**: `hsl(45, 30%, 85%)`
- **Input Dark**: `hsl(0, 0%, 20%)`
- **Ring**: `hsl(45, 100%, 50%)` - Focus ring color

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Weights**: 100, 200, 300, 400, 500, 600, 700, 800, 900

### Text Sizes (Responsive)
- **Headings**: 
  - H1: `text-3xl md:text-4xl lg:text-5xl` (48px-60px)
  - H2: `text-2xl md:text-3xl` (32px-48px)
  - H3: `text-xl md:text-2xl` (24px-32px)
- **Body**: `text-base md:text-lg` (16px-18px)
- **Small**: `text-sm` (14px)
- **Extra Small**: `text-xs` (12px)

## Component Styles

### Buttons

#### Primary Button (Custodia)
```css
.custodia-btn-primary {
  @apply custodia-btn bg-yellow-600 text-black hover:bg-yellow-500;
}
```

#### Secondary Button (Glass Effect)
```css
.custodia-btn-secondary {
  background: hsla(0, 0%, 0%, 0.8);
  border: 1px solid hsla(45, 100%, 50%, 0.5);
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}
```

### Cards

#### Glass Card Effect
```css
.custodia-card {
  background: hsla(0, 0%, 0%, 0.95);
  border: 1px solid hsla(45, 100%, 50%, 0.3);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px hsla(45, 100%, 50%, 0.1);
  transition: all 0.3s ease;
  @apply rounded-2xl p-6;
}
```

#### Standard Card
- **Background**: Uses CSS variables `hsl(var(--card))`
- **Border**: `hsl(var(--border))`
- **Padding**: `p-4 md:p-6`
- **Border Radius**: `rounded-lg md:rounded-xl`

### Forms

#### Input Fields
- **Background**: `hsl(var(--input))`
- **Border**: `hsl(var(--border))`
- **Focus Ring**: `hsl(var(--ring))`
- **Padding**: `px-3 py-2 md:px-4 md:py-3`
- **Border Radius**: `rounded-md md:rounded-lg`

#### Labels
- **Color**: `hsl(var(--foreground))`
- **Font Weight**: `font-medium`
- **Size**: `text-sm`

## Layout Patterns

### Responsive Containers
- **Main Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Section Padding**: `py-12 md:py-16 lg:py-20`
- **Card Spacing**: `space-y-4 md:space-y-6`

### Grid Systems
- **Stats Cards**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- **Feature Cards**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Content Grid**: `grid-cols-1 lg:grid-cols-3`

### Flexbox Patterns
- **Header Layout**: `flex flex-col md:flex-row items-start md:items-center justify-between`
- **Button Groups**: `flex flex-col sm:flex-row gap-2 md:gap-4`
- **Icon + Text**: `flex items-center gap-2 md:gap-3`

## Animation & Transitions

### Reveal Animations
- **Base Reveal**: `opacity-0 transform translateY(60px) scale(0.95)`
- **Active State**: `opacity-1 transform translateY(0) scale(1)`
- **Transition**: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)`

### Hover Effects
- **Cards**: `hover:transform hover:scale-105 transition-all duration-300`
- **Buttons**: `hover:bg-opacity-90 transition-colors duration-200`
- **Links**: `hover:text-primary transition-colors duration-200`

## Gradient Patterns

### Background Gradients
- **Main Background**: `bg-gradient-to-br from-black via-gray-900 to-black`
- **Overlay**: `bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-600/5`
- **Text Gradient**: `bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent`

### Card Gradients
- **Glass Card**: `bg-gradient-to-r from-gray-900/50 to-gray-800/50`
- **Accent Card**: `bg-gradient-to-r from-yellow-500/10 to-yellow-600/10`

## Spacing System

### Responsive Spacing
- **Small**: `gap-2 md:gap-3`
- **Medium**: `gap-4 md:gap-6`
- **Large**: `gap-6 md:gap-8`
- **Extra Large**: `gap-8 md:gap-12`

### Padding/Margin
- **Component Padding**: `p-4 md:p-6 lg:p-8`
- **Section Margins**: `mb-8 md:mb-12 lg:mb-16`
- **Element Spacing**: `space-y-4 md:space-y-6`

## Icon Guidelines

### Sizes
- **Small**: `h-4 w-4` (16px)
- **Medium**: `h-5 w-5` (20px)
- **Large**: `h-6 w-6` (24px)
- **Extra Large**: `h-8 w-8` (32px)

### Colors
- **Primary Icons**: `text-yellow-400`
- **Secondary Icons**: `text-muted-foreground`
- **Success Icons**: `text-green-500`
- **Warning Icons**: `text-yellow-500`
- **Error Icons**: `text-red-500`

## Responsive Breakpoints

### Tailwind Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Usage Patterns
- **Mobile First**: Start with mobile styles, add larger breakpoints
- **Text Scaling**: `text-sm md:text-base lg:text-lg`
- **Spacing Scaling**: `p-4 md:p-6 lg:p-8`
- **Grid Scaling**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

## Implementation Guidelines

### CSS Variables Usage
- Always use CSS variables for colors: `hsl(var(--primary))`
- Maintain consistency between light and dark modes
- Use semantic color names for better maintainability

### Component Consistency
- Use established component classes (`.custodia-btn`, `.custodia-card`)
- Follow responsive patterns consistently
- Maintain proper spacing and typography hierarchy

### Accessibility
- Ensure sufficient color contrast ratios
- Use semantic HTML elements
- Provide focus indicators for interactive elements
- Support both light and dark mode preferences

This design system ensures visual consistency, accessibility, and maintainability across the entire OFS Ledger application.