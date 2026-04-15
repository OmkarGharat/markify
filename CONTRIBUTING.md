# Contributing to Markify

Thank you for your interest in contributing to Markify! This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Setting Up Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/markify.git
   cd markify
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Creating a Branch

Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix-name
```

### Making Changes

1. Write code following the project's coding standards
2. Add tests for new functionality
3. Ensure all tests pass:
   ```bash
   npm test
   ```

4. Run the linter and fix any issues:
   ```bash
   npm run lint:fix
   ```

5. Format your code:
   ```bash
   npm run format
   ```

### Committing Changes

Follow conventional commit format:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for code style changes (formatting, etc.)
- `refactor:` for code refactoring
- `test:` for adding or updating tests
- `chore:` for maintenance tasks

Examples:
```bash
git commit -m "feat: add support for tables in markdown"
git commit -m "fix: resolve issue with large file uploads"
git commit -m "docs: update README with new features"
```

### Submitting a Pull Request

1. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a pull request on GitHub

3. Fill out the PR template with:
   - Description of changes
   - Related issues
   - Testing performed
   - Screenshots (if applicable)

## Code Style Guidelines

### JavaScript/React

- Use functional components and hooks
- Follow React best practices
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components small and focused

### CSS

- Use Tailwind CSS utility classes
- Follow BEM naming for custom CSS classes
- Keep styles responsive and accessible
- Use CSS variables for theme colors

### Testing

- Write unit tests for utility functions
- Write component tests for React components
- Aim for high test coverage
- Test both happy paths and edge cases

## Project Structure

```
markify/
├── src/
│   ├── components/     # React components
│   ├── styles/         # CSS and styling
│   ├── utils/          # Utility functions
│   ├── tests/          # Test files
│   ├── App.jsx         # Main application
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── index.html          # HTML template
└── package.json        # Dependencies
```

## Reporting Issues

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node.js version)

## Feature Requests

For feature requests:

- Check existing issues first
- Describe the use case
- Explain why it would be beneficial
- Provide examples if possible

## Code Review Process

All submissions go through code review:

1. Automated checks (CI/CD)
2. Peer review
3. Approval from maintainers
4. Merge into main branch

## Questions?

Feel free to open an issue for questions or discussions.

---

Thank you for contributing to Markify! 🎉
