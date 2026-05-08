# Design System

## Fonts
- **Primary**: `Outfit` (Google Fonts) - body text, UI elements
- **Display**: `Bebas Neue` (Google Fonts) - headings, special elements

## Color Palette

### Primary Colors
- Green Primary: `#10b981` (emerald-500)
- Emerald Dark: `#059669` (emerald-600)

### Theme-Specific

**Light Mode**
- Background: `bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50`
- Card Background: `bg-white/80`
- Border: `border-green-200/50`

**Dark Mode**
- Background: `bg-black`
- Card Background: `bg-black/95`
- Border: `border-green-800/50`

### Sticker States
| State | Background Gradient | Border | Shadow | Text |
|-------|---------------------|--------|--------|------|
| Missing | `linear-gradient(145deg, #e8e8e8 0%, #d0d0d0 100%)` | `#bbb` | none | `#888` |
| Collected | `linear-gradient(145deg, #10b981 0%, #059669 100%)` | `#34d399` | `0 4px 20px rgba(16, 185, 129, 0.4)` | white |
| Repeated | `linear-gradient(145deg, #f59e0b 0%, #d97706 100%)` | `#fbbf24` | `0 4px 25px rgba(245, 158, 11, 0.4)` | white |

### Dark Mode Sticker States
| State | Background Gradient | Border | Shadow |
|-------|---------------------|--------|--------|
| Missing | `linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)` | `#2a2a2a` | none |
| Collected | `linear-gradient(145deg, #059669 0%, #047857 100%)` | `#10b981` | `0 4px 25px rgba(16, 185, 129, 0.5)` |
| Repeated | `linear-gradient(145deg, #fbbf24 0%, #d97706 100%)` | `#fbbf24` | `0 4px 30px rgba(251, 191, 36, 0.5)` |

## Component Styles

### Header
- Sticky positioning with `z-50`
- Blur backdrop: `backdrop-blur-lg`
- Gradient text for title: `bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500`

### Buttons
- Rounded corners: `rounded-xl`
- Active state: `bg-gradient-to-r from-green-500 to-emerald-500`
- Glow shadow: `shadow-lg shadow-green-500/40`
- Hover transitions: `transition-all duration-300`

### Search Input
- Semi-transparent background: `rgba(255, 255, 255, 0.7)` (light), `rgba(255, 255, 255, 0.05)` (dark)
- Focus glow: `box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3)`
- Transition: `all 0.3s ease`

### Cards
- Border radius: `rounded-xl` or `rounded-2xl`
- Touch-friendly padding: `p-3` minimum
- Tap highlight disabled: `-webkit-tap-highlight-color: transparent`

### Glass Effect
- Background: `rgba(255, 255, 255, 0.1)` (light), `rgba(0, 0, 0, 0.3)` (dark)
- Blur: `backdrop-filter: blur(20px)`

## Animations

### Keyframes
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 35px rgba(5, 150, 105, 0.5); }
}

@keyframes bounce-in {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
```

### Animation Classes
- `.animate-pulse-glow` - 2s infinite glow pulse
- `.animate-bounce-in` - 0.4s entry animation
- `.animate-float` - 3s infinite float effect

## Spacing System
- Mobile-first: small touch targets (`p-2`, `p-3`)
- Content padding: `px-4 sm:px-6`
- Section gaps: `gap-2`, `gap-3`

## Interactive Behaviors
- Sticker tap: `transform: scale(0.95)` on active
- Touch action: `touch-action: manipulation`
- User select: `user-select: none`

## Team Colors (TEAM_COLORS object)
Each country code maps to a hex color matching the nation's flag for visual identification.

## Tailwind Configuration Notes
- Dark mode: `class` strategy
- Custom colors: `wc` namespace (not actively used)
- Custom fonts: `display` (Russo One), `body` (Poppins) - defined but Outfit used instead

## Usage Patterns
1. Always use `transition-colors duration-500` for theme changes
2. Use gradient backgrounds for primary interactive elements
3. Apply `backdrop-blur` for floating/header elements
4. Use specific green palette (`green-500`, `emerald-500`, `teal-500`) for consistency