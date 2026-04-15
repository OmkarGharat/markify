# Markify - Professional Markdown to DOCX Converter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/node/v/18.0.0)](https://nodejs.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()

A modern, production-ready web application that converts Markdown files to professionally formatted Microsoft Word documents (.docx).

## ✨ Features

- 🚀 **Fast & Efficient**: Client-side processing with no server requirements
- 🎨 **Professional Styling**: Beautiful document formatting with custom color palettes
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔒 **Secure**: All processing happens locally in your browser
- 🌐 **Offline Support**: Works without internet connection after initial load
- 📊 **Document Analysis**: Real-time statistics and structure analysis
- 🎯 **Accessibility**: WCAG 2.1 compliant with keyboard navigation support

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/markify.git
cd markify

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
markify/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   ├── styles/            # CSS and styling
│   ├── utils/             # Utility functions
│   ├── tests/             # Test files
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── README.md              # This file
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 🎨 Customization

### Color Palette

Edit `src/styles/colors.js` to customize the document color scheme:

```javascript
export const COLORS = {
  h1: '1B2A4A',
  h2: '0D7377',
  h3: '2E86AB',
  // ... more colors
};
```

### Typography

Modify font settings in `src/styles/typography.js`:

```javascript
export const FONTS = {
  headings: 'Cambria',
  body: 'Calibri',
  code: 'Consolas',
};
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_NAME=Markify
VITE_APP_VERSION=1.0.0
VITE_MAX_FILE_SIZE_MB=10
```

See `.env.example` for all available options.

## 📦 Deployment

### 🚀 Quick Start

**For Windows users:**
```bash
# Run the automated deployment script
deploy.bat
```

**For Mac/Linux users:**
```bash
# Run the automated deployment script
bash deploy.sh
```

### 📖 Detailed Guides

- **[Complete Deployment Guide](DEPLOYMENT_GUIDE.md)** - Step-by-step Vercel deployment instructions
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Quick reference checklist
- **[Testing Report](TESTING_REPORT.md)** - Comprehensive testing results

### Vercel Deployment

#### Option 1: Vercel Dashboard (Recommended for Beginners)

1. **Prepare your project:**
   ```bash
   # Clean up test files
   rm test_comprehensive_syntax.md test_large_100pages.md generate_large_test.js

   # Initialize git (if not already done)
   git init
   git add .
   git commit -m "Initial commit - Markify application"

   # Push to GitHub
   git remote add origin https://github.com/YOUR_USERNAME/markify.git
   git push -u origin main
   ```

2. **Deploy via Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Click "Deploy"

#### Option 2: Vercel CLI (Recommended for Advanced Users)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

Configure these in Vercel Dashboard → Settings → Environment Variables:

```env
VITE_APP_NAME=Markify
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Professional Markdown to Word Document Converter
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_TRACKING=false
VITE_MAX_FILE_SIZE_MB=10
```

### Custom Domain Setup

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `markify.yourdomain.com`)
3. Configure DNS records:
   ```
   Type: CNAME
   Name: markify
   Value: cname.vercel-dns.com
   ```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Docker

```bash
# Build image
docker build -t markify .

# Run container
docker run -p 80:80 markify
```

## 🔒 Security

- All file processing happens client-side
- No data is sent to external servers
- Content Security Policy (CSP) headers
- Input validation and sanitization
- Secure file handling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [docx](https://docx.js.org/) - Document generation library
- [marked](https://marked.js.org/) - Markdown parser
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Build tool and dev server

## 📧 Support

For support, email support@markify.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Add PDF export option
- [ ] Support for more document formats
- [ ] Cloud storage integration
- [ ] Advanced formatting options
- [ ] Batch conversion support
- [ ] Custom templates

---

Made with ❤️ by the Markify Team
