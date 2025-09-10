# @repo/eslint-config

Shared ESLint configuration package for the Collaro monorepo. Provides consistent code linting rules across all packages and applications.

## Overview

This package contains:
- Base ESLint configuration
- Next.js specific rules
- React internal rules
- TypeScript integration
- Prettier integration

## Configurations

### Base Configuration (`base.js`)

General JavaScript/TypeScript linting rules:
- Airbnb style guide
- TypeScript strict rules
- Import/export validation
- Code quality rules

### Next.js Configuration (`next.js`)

Next.js specific rules:
- Next.js best practices
- App Router conventions
- Image optimization rules
- Font optimization rules

### React Internal Configuration (`react-internal.js`)

Advanced React rules:
- React hooks rules
- JSX accessibility
- React performance rules
- Advanced React patterns

## Installation

This package is part of the monorepo and is automatically linked via pnpm workspaces. No manual installation required.

## Usage

### In package.json

```json
{
  "eslintConfig": {
    "extends": ["@repo/eslint-config/base"]
  }
}
```

### In .eslintrc.js

```javascript
module.exports = {
  extends: ['@repo/eslint-config/base'],
  rules: {
    // Custom rules
  }
};
```

### For Next.js Apps

```javascript
module.exports = {
  extends: ['@repo/eslint-config/next.js'],
};
```

### For React Components

```javascript
module.exports = {
  extends: ['@repo/eslint-config/react-internal'],
};
```

## Rules Overview

### Enabled Rules

- **ES6+ Features**: Modern JavaScript support
- **TypeScript**: Strict type checking
- **React**: Hooks, JSX, and performance rules
- **Import/Export**: Clean module structure
- **Code Quality**: Best practices and anti-patterns

### Disabled Rules

- Rules that conflict with Prettier
- Overly restrictive rules
- Rules that don't apply to the project structure

## Configuration Files

### base.js
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  // ... rules
};
```

### next.js
```javascript
module.exports = {
  extends: [
    '@repo/eslint-config/base',
    '@next/eslint-config-next'
  ],
  // ... Next.js specific rules
};
```

### react-internal.js
```javascript
module.exports = {
  extends: [
    '@repo/eslint-config/base',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  // ... React specific rules
};
```

## Development

### Adding New Rules

1. Add to the appropriate configuration file
2. Test across all packages
3. Update documentation
4. Ensure no conflicts with existing rules

### Customizing Rules

For package-specific customizations:

```javascript
module.exports = {
  extends: ['@repo/eslint-config/base'],
  rules: {
    'no-console': 'warn', // Override for specific package
  }
};
```

## Integration with Prettier

The configurations include Prettier integration to avoid conflicts:
- ESLint disables formatting rules
- Prettier handles code formatting
- Consistent formatting across the monorepo

## CI/CD Integration

ESLint is run in CI/CD pipelines:
- Pre-commit hooks with lint-staged
- GitHub Actions for PR validation
- Automated fixes where possible

## Troubleshooting

### Common Issues

- **Rule Conflicts**: Check for conflicting rules between configurations
- **TypeScript Errors**: Ensure TypeScript configuration is correct
- **Import Errors**: Verify import paths and aliases

### Fixing Issues

```bash
# Fix auto-fixable issues
pnpm lint --fix

# Check specific file
pnpm eslint src/components/Button.tsx

# Check entire package
pnpm lint
```

## Best Practices

1. **Consistent Rules**: Use the shared configurations
2. **Auto-fix**: Use `--fix` for automatic fixes
3. **Pre-commit**: Run linting before committing
4. **CI Checks**: Ensure CI passes before merging
5. **Documentation**: Document any custom rules

## Learn More

- [ESLint Documentation](https://eslint.org/docs/user-guide/)
- [TypeScript ESLint](https://typescript-eslint.io)
- [ESLint Plugin React](https://github.com/jsx-eslint/eslint-plugin-react)
- [ESLint Plugin Import](https://github.com/import-js/eslint-plugin-import)
