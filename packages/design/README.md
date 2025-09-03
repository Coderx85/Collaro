# @repo/design

Design system package for the Collaro monorepo. Provides a comprehensive set of UI components built with Radix UI and styled with Tailwind CSS.

## Overview

This package contains:
- Reusable UI components
- Design tokens and theme configuration
- Tailwind CSS configuration
- Component library built on Radix UI primitives
- Accessibility-first components

## Tech Stack

- **Component Library**: Radix UI
- **Styling**: Tailwind CSS
- **Icons**: Radix Icons
- **TypeScript**: Full type safety
- **PostCSS**: CSS processing

## Installation

This package is part of the monorepo and is automatically linked via pnpm workspaces. No manual installation required.

## Usage

### Importing Components

```typescript
import { Button } from '@repo/design/components/ui/button';
import { Card, CardContent, CardHeader } from '@repo/design/components/ui/card';
import { Input } from '@repo/design/components/ui/input';
```

### Using Components

```tsx
import { Button } from '@repo/design/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/design/components/ui/card';

export function UserCard({ user }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{user.email}</p>
        <Button>Edit Profile</Button>
      </CardContent>
    </Card>
  );
}
```

## Available Components

### Layout Components
- `Accordion` - Collapsible content sections
- `Card` - Content containers
- `Separator` - Visual dividers
- `Sheet` - Slide-out panels
- `Tabs` - Tabbed interfaces

### Form Components
- `Button` - Interactive buttons
- `Input` - Text input fields
- `Textarea` - Multi-line text input
- `Select` - Dropdown selections
- `Checkbox` - Boolean inputs
- `RadioGroup` - Single selection from options
- `Switch` - Toggle switches

### Feedback Components
- `Alert` - Status messages
- `Dialog` - Modal dialogs
- `Toast` - Notification messages
- `Progress` - Progress indicators
- `Skeleton` - Loading placeholders

### Navigation Components
- `NavigationMenu` - Site navigation
- `Breadcrumb` - Navigation breadcrumbs
- `Pagination` - Page navigation

### Data Display
- `Table` - Data tables
- `Badge` - Status indicators
- `Avatar` - User avatars

## Theming

The design system uses a consistent theme with:
- Color palette
- Typography scale
- Spacing scale
- Border radius
- Shadows

### Customizing Theme

```css
/* In your app's global styles */
:root {
  --primary: 220 70% 50%;
  --primary-foreground: 210 40% 98%;
}
```

## Accessibility

All components are built with accessibility in mind:
- ARIA attributes
- Keyboard navigation
- Screen reader support
- Focus management
- Color contrast compliance

## Best Practices

1. **Consistent Usage**: Use components from this library instead of creating custom ones
2. **Composition**: Combine components to build complex UIs
3. **Theming**: Respect the design tokens for consistency
4. **Accessibility**: Always test with screen readers and keyboard navigation
5. **Performance**: Components are optimized for performance

## Development

### Adding New Components

1. Create the component in `components/ui/`
2. Export it from the appropriate index file
3. Add TypeScript types
4. Include accessibility features
5. Add documentation and examples

### Component Structure

```
components/ui/
├── button.tsx
├── input.tsx
├── card.tsx
├── dialog.tsx
└── ...
```

## Customization

### Extending Components

```tsx
import { Button } from '@repo/design/components/ui/button';
import { cn } from '@repo/design/lib/utils';

const CustomButton = ({ className, ...props }) => (
  <Button
    className={cn('custom-button', className)}
    {...props}
  />
);
```

### Custom Variants

```tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-500 text-white',
    },
  },
});
```

## Testing

Components should be tested for:
- Visual appearance
- Accessibility
- Keyboard interaction
- Screen reader compatibility
- Different viewport sizes

## Learn More

- [Radix UI Documentation](https://www.radix-ui.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Class Variance Authority](https://cva.style)
