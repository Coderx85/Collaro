# @repo/typescript-config

Shared TypeScript configuration package for the Collaro monorepo. Provides consistent TypeScript settings across all packages and applications.

## Overview

This package contains:
- Base TypeScript configuration
- Next.js specific configuration
- React library configuration
- Path mapping and module resolution
- Strict type checking settings

## Configurations

### Base Configuration (`base.json`)

General TypeScript configuration for libraries and utilities:
- Strict type checking
- Modern ES modules
- Path mapping for monorepo
- Consistent compiler options

### Next.js Configuration (`nextjs.json`)

Configuration optimized for Next.js applications:
- Next.js specific settings
- App Router support
- Server and client component types
- Optimized for Next.js build process

### React Library Configuration (`react-library.json`)

Configuration for React component libraries:
- React JSX settings
- Library export settings
- Declaration file generation
- Optimized for publishing

## Installation

This package is part of the monorepo and is automatically linked via pnpm workspaces. No manual installation required.

## Usage

### In tsconfig.json

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### For Next.js Apps

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@repo/*": ["../../packages/*"]
    }
  }
}
```

### For React Libraries

```json
{
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "declaration": true
  }
}
```

## Configuration Details

### Base Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@repo/*": ["../../packages/*"]
    }
  }
}
```

### Next.js Configuration

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "plugins": [
      {
        "name": "next"
      }
    ],
    "strict": true,
    "noEmit": true,
    "incremental": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### React Library Configuration

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist",
    "noEmit": false
  }
}
```

## Path Mapping

The configurations include path mapping for the monorepo:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@repo/*": ["../../packages/*"],
      "@/*": ["./src/*"]
    }
  }
}
```

This allows clean imports:
```typescript
import { db } from '@repo/database';
import { Button } from '@/components/Button';
```

## Development

### Adding New Configurations

1. Create new JSON file in the package
2. Export it from package.json
3. Test across different package types
4. Update documentation

### Customizing Configurations

For package-specific needs:

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "build",
    "target": "ES2020"
  }
}
```

## Type Checking

### Running Type Checks

```bash
# Check specific package
pnpm tsc --noEmit

# Check entire monorepo
pnpm check-types
```

### IDE Integration

- VS Code automatically picks up TypeScript configurations
- IntelliSense works with path mapping
- Type errors show in real-time

## Best Practices

1. **Consistent Configs**: Use the shared configurations
2. **Strict Mode**: Keep strict mode enabled
3. **Path Mapping**: Use consistent import paths
4. **Type Coverage**: Aim for 100% type coverage
5. **Regular Checks**: Run type checks in CI/CD

## Troubleshooting

### Common Issues

- **Path Resolution**: Ensure baseUrl and paths are correct
- **Module Resolution**: Check moduleResolution setting
- **Declaration Files**: For libraries, enable declaration generation

### Performance

- Use `skipLibCheck` to speed up compilation
- Enable `incremental` for faster rebuilds
- Use project references for large monorepos

## Learn More

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Configuration](https://www.typescriptlang.org/tsconfig)
- [Next.js TypeScript](https://nextjs.org/docs/typescript)
- [Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
