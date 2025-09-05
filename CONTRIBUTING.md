# Contributing to Collaro

Thank you for your interest in contributing to Collaro! We welcome contributions from the community and are grateful for your help in making this project better.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## 🤝 Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. By participating, you agree to:

- Be respectful and inclusive
- Focus on constructive feedback
- Accept responsibility for mistakes
- Show empathy towards other contributors
- Help create a positive community

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **pnpm**: Version 8 or higher (recommended)
- **Git**: Version 2.30 or higher
- **PostgreSQL**: For local database development
- **Docker**: Optional, for containerized development

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/Coderx85/Collaro.git
   cd Collaro
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   pnpm db:push
   pnpm db:generate
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

## 💻 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **🐛 Bug fixes**: Fix existing issues
- **✨ New features**: Add new functionality
- **📚 Documentation**: Improve documentation
- **🎨 UI/UX improvements**: Enhance user interface
- **⚡ Performance**: Optimize performance
- **🧪 Testing**: Add or improve tests
- **🔧 Tooling**: Improve development tools

### Finding Issues to Work On

1. Check the [Issues](https://github.com/Coderx85/Collaro/issues) page
2. Look for issues labeled `good first issue` or `help wanted`
3. Comment on the issue to indicate you're working on it
4. Wait for maintainer approval before starting work

## 🔄 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 2. Make Changes

- Write clear, concise commit messages
- Follow the coding standards
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run linting
pnpm lint

# Run type checking
pnpm check-types

# Run tests
pnpm test

# Build the project
pnpm build
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting
- `refactor:` for code restructuring
- `test:` for testing
- `chore:` for maintenance

## 📝 Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Prefer `const` over `let`, avoid `var`

### React Components

- Use functional components with hooks
- Follow the component structure in `apps/app/src/components/`
- Use TypeScript interfaces for props
- Implement proper error boundaries
- Follow accessibility guidelines

### Database

- Use the existing Drizzle ORM patterns
- Add proper indexes for performance
- Use transactions for multi-step operations
- Validate data at the database level

### Styling

- Use Tailwind CSS classes
- Follow the design system in `@repo/design`
- Maintain consistent spacing and colors
- Ensure responsive design

## 🧪 Testing

### Testing Strategy

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test -- path/to/test/file
```

### Writing Tests

- Use Jest and React Testing Library
- Follow the existing test patterns
- Aim for 80% code coverage minimum
- Test both success and error scenarios

## 📤 Submitting Changes

### Pull Request Process

1. **Ensure your branch is up to date**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Create a Pull Request**
   - Use a descriptive title
   - Provide detailed description
   - Reference related issues
   - Add screenshots for UI changes

3. **PR Template**
   Please fill out the PR template with:
   - Description of changes
   - Testing instructions
   - Screenshots (if applicable)
   - Related issues

4. **Code Review**
   - Address reviewer feedback
   - Make requested changes
   - Ensure CI checks pass

5. **Merge**
   - Squash merge is preferred
   - Delete the branch after merging

### PR Checklist

- [ ] Tests pass
- [ ] Code is linted
- [ ] Types are checked
- [ ] Documentation is updated
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Accessibility compliant

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to reproduce**: Step-by-step instructions
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: Browser, OS, Node version
- **Screenshots**: If applicable

### Feature Requests

For feature requests, please include:

- **Description**: What feature you'd like
- **Use case**: Why this feature would be useful
- **Alternatives**: Any alternative solutions considered
- **Additional context**: Any other relevant information

## 📞 Getting Help

If you need help:

1. Check the [documentation](./apps/docs/)
2. Search existing [issues](https://github.com/Coderx85/Collaro/issues)
3. Ask in [discussions](https://github.com/Coderx85/Collaro/discussions)
4. Contact maintainers

## 🎉 Recognition

Contributors will be:
- Listed in the repository contributors
- Mentioned in release notes
- Recognized in the project's acknowledgments

Thank you for contributing to Collaro! 🚀
