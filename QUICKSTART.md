# Quick Start Guide

Get Markify up and running in minutes!

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/markify.git
cd markify
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

## Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Docker

```bash
docker build -t markify .
docker run -p 80:80 markify
```

## Usage

1. **Upload File**: Drag and drop a `.md` file or click to browse
2. **Preview**: Review the live preview and document analysis
3. **Convert**: Click "Convert to DOCX" to generate the Word document
4. **Download**: Download the converted `.docx` file

## Features

- ✅ Drag and drop file upload
- ✅ Live markdown preview
- ✅ Document analysis and statistics
- ✅ Professional DOCX styling
- ✅ Custom color palettes
- ✅ Responsive design
- ✅ Keyboard navigation
- ✅ Accessibility support

## File Requirements

- **Format**: `.md`, `.markdown`, or `.txt`
- **Size**: Maximum 10 MB
- **Encoding**: UTF-8

## Supported Markdown Features

- Headings (H1-H6)
- Paragraphs and text formatting
- Lists (ordered and unordered)
- Code blocks and inline code
- Tables
- Blockquotes
- Links and images
- Horizontal rules
- Task lists

## Troubleshooting

### Build Errors

```bash
# Clean build artifacts
npm run clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

```bash
# Use different port
npm run dev -- --port 3001
```

### Docker Issues

```bash
# Rebuild Docker image
docker build --no-cache -t markify .
```

## Getting Help

- 📖 [Documentation](README.md)
- 🐛 [Report Issues](https://github.com/yourusername/markify/issues)
- 💬 [Discussions](https://github.com/yourusername/markify/discussions)
- 📧 [Email Support](mailto:support@markify.com)

## Next Steps

- Read the [full documentation](README.md)
- Check out [contributing guidelines](CONTRIBUTING.md)
- Review [security policy](SECURITY.md)
- Explore [deployment options](PRODUCTION_READINESS.md)

---

Happy converting! 🎉