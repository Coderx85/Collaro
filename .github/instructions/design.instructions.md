# Design Engineering Patterns

A practical guide to the design patterns and principles used in this project. Based on craft-focused design engineering philosophy prioritizing feel, responsiveness, and invisible details that compound into great interfaces.

---

## 1) Core Philosophy

- **Taste is trained**: Study why great interfaces feel good. Reverse engineer animations. Be curious.
- **Unseen details compound**: Most details users never consciously notice—that's the point. The aggregate creates interfaces people love without knowing why.
- **Beauty is leverage**: Good defaults and animations are real differentiators.

---

## 2) Animation Principles

### When to Animate

| Frequency | Decision |
| --- | --- |
| 100+ times/day (keyboard shortcuts, toggles) | No animation |
| Tens of times/day (hover effects) | Minimal or none |
| Occasional (modals, drawers) | Standard animation |
| Rare/first-time (onboarding) | Can add delight |

**Rule**: Never animate keyboard-initiated actions.

### Easing Curves

Always use custom easing curves. Built-in CSS easings are too weak.

```css
/* Strong ease-out for UI interactions (entering/exiting) */
ease-[cubic-bezier(0.23,1,0.32,1)]

/* Strong ease-in-out for on-screen movement */
ease-[cubic-bezier(0.77,0,0.175,1)]

/* iOS-like drawer curve */
ease-[cubic-bezier(0.32,0.72,0,1)]
```

**Never use `ease-in`** for UI animations—it starts slow, making interfaces feel sluggish.

### Duration Guidelines

| Element | Duration |
| --- | --- |
| Button press feedback | 100-160ms |
| Tooltips, small popovers | 125-200ms |
| Dropdowns, selects | 150-250ms |
| Modals, drawers | 200-500ms |

**Rule**: UI animations should stay under 300ms.

---

## 3) Transition Patterns

### Specify Exact Properties

```tsx
// Bad - avoid 'all'
className="transition-all duration-300"

// Good - specify exact properties
className="transition-[transform,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
```

### Button Press Feedback

All pressable elements must have active states:

```tsx
className="transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
```

Scale should be subtle: 0.95-0.98.

### Hover Lift Effect

Use subtle transforms for interactive cards:

```tsx
className="transition-[transform,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98]"
```

### Icon Animations

```tsx
// Rotation on hover (plus icons, settings)
className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rotate-90"

// Translate on hover (arrows)
className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5"
```

---

## 4) Card Patterns

### Standard Card

```tsx
<Card className="group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98]">
  {/* content */}
</Card>
```

### Dashed/Empty State Card

```tsx
<Card className="group relative flex min-h-[180px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border/60 bg-muted/20 transition-[transform,border-color,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-primary/50 hover:bg-muted/30 active:scale-[0.98]">
  {/* content */}
</Card>
```

### Card Hierarchy

- `rounded-2xl` for cards (not `rounded-3xl`—too bulky)
- `border-border/50` for subtle borders
- `bg-card/60 backdrop-blur-sm` for depth
- Light shadows: `shadow-lg shadow-primary/5`

---

## 5) Button Patterns

### Primary Button

```tsx
<Button className="group rounded-full px-5 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]">
  Action
  <IconPlus className="ml-2 size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rotate-90" />
</Button>
```

### Secondary Button

```tsx
<Button variant="secondary" className="group shrink-0 rounded-full px-5 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]">
  Action
  <IconArrowRight className="ml-2 size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5" />
</Button>
```

---

## 6) Status Indicators

### Active/Online Badge

```tsx
<span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
  <span className="h-1 w-1 rounded-full bg-emerald-500" />
  Active
</span>
```

### Pulse Indicator

```tsx
<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
```

### Count Badge

```tsx
<span className="inline-flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 text-[11px] font-medium text-muted-foreground">
  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
  {count} {count === 1 ? "item" : "items"}
</span>
```

---

## 7) Layout Patterns

### Section Container

```tsx
<section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm md:p-8">
  {/* content */}
</section>
```

### Inline Action Section

```tsx
<section className="flex flex-col gap-5 rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
  <div className="space-y-1">
    <p className="text-base font-semibold text-foreground">Title</p>
    <p className="max-w-sm text-sm text-muted-foreground">Description</p>
  </div>
  <Button>Action</Button>
</section>
```

### Feature Cards Grid

```tsx
<div className="flex gap-3">
  <div className="flex-1 rounded-xl border border-border/50 bg-background/60 p-4">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="size-4" />
    </div>
    <p className="mt-2 text-sm font-medium text-foreground">Title</p>
    <p className="mt-0.5 text-xs text-muted-foreground">Description</p>
  </div>
</div>
```

---

## 8) Background Effects

### Subtle Gradient Blurs

```tsx
<div className="pointer-events-none absolute inset-0 -z-10">
  <div className="absolute -top-32 right-[-6rem] h-64 w-64 rounded-full bg-primary/8 blur-[120px]" />
  <div className="absolute bottom-[-6rem] left-0 h-64 w-64 rounded-full bg-secondary/8 blur-[120px]" />
</div>
```

Keep blur effects subtle (`/8` opacity) and use moderate blur values (`blur-[120px]`).

---

## 9) Typography Scale

| Element | Classes |
| --- | --- |
| Page title | `text-3xl md:text-4xl font-semibold tracking-tight` |
| Section title | `text-base font-semibold` |
| Card title | `text-base font-semibold` |
| Body text | `text-sm text-muted-foreground` |
| Small text | `text-xs text-muted-foreground` |
| Tiny labels | `text-[10px] or text-[11px] font-medium` |

---

## 10) Spacing Conventions

- Section gaps: `space-y-8`
- Card padding: `p-5` or `p-6`
- Card gaps: `gap-4` or `gap-5`
- Inline element gaps: `gap-2` or `gap-3`
- Icon margins: `ml-2`

---

## 11) Color Opacity Patterns

| Use Case | Pattern |
| --- | --- |
| Borders | `border-border/50` or `border-border/60` |
| Card backgrounds | `bg-card/40` or `bg-card/60` |
| Icon backgrounds | `bg-primary/10` or `bg-primary/15` |
| Hover states | `hover:border-primary/40` |
| Shadows | `shadow-primary/5` |
| Background blurs | `bg-primary/8` |

---

## 12) Performance Rules

### Only Animate Transform and Opacity

These properties skip layout and paint, running on the GPU:

```tsx
// Good - GPU accelerated
className="transition-[transform,opacity] duration-200"

// Avoid - triggers layout
className="transition-[padding,margin,height,width]"
```

### Specify Transition Properties

```tsx
// Bad - animates everything, expensive
className="transition-all"

// Good - only animates what changes
className="transition-[transform,border-color,box-shadow]"
```

---

## 13) Accessibility

### Reduced Motion

Respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .element {
    transition-duration: 0ms;
  }
}
```

### Touch Device Hover States

Gate hover animations for pointer devices:

```css
@media (hover: hover) and (pointer: fine) {
  .element:hover {
    transform: scale(1.05);
  }
}
```

---

## 14) Anti-Patterns to Avoid

| Don't | Do Instead |
| --- | --- |
| `transition-all` | Specify exact properties |
| `duration-300` or higher for UI | Keep under 200ms |
| `ease-in` for UI elements | Use `ease-out` or custom curve |
| `scale(0)` for entry animations | Start from `scale(0.95)` with `opacity: 0` |
| `rounded-3xl` for cards | Use `rounded-2xl` |
| Heavy shadows | Light shadows with `/5` opacity |
| `translate-y-1` for hover | Use `translate-y-0.5` |
| Redundant section headings | Let content hierarchy speak |

---

## 15) Checklist for New Components

- [ ] Uses custom easing `cubic-bezier(0.23,1,0.32,1)`
- [ ] Duration under 200ms for UI interactions
- [ ] Has `active:scale-[0.97]` or similar for pressable elements
- [ ] Specifies exact transition properties (not `all`)
- [ ] Uses `rounded-2xl` for cards
- [ ] Has subtle border (`border-border/50`)
- [ ] Includes hover state with lift effect
- [ ] Icons animate on hover (rotate or translate)
- [ ] Shadows use low opacity (`shadow-primary/5`)
