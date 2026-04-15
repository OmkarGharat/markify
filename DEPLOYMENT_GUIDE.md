# 🚀 Markify Vercel Deployment Guide

This guide will walk you through deploying Markify on Vercel step by step.

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ A [Vercel account](https://vercel.com/signup) (free tier is sufficient)
- ✅ [Node.js](https://nodejs.org/) installed (>= 18.0.0)
- ✅ [Git](https://git-scm.com/) installed and configured
- ✅ A [GitHub](https://github.com/) account (recommended for automatic deployments)

## 🎯 Deployment Options

You can deploy Markify on Vercel using two methods:

1. **Method 1: Vercel Dashboard (GUI) - Recommended for beginners**
2. **Method 2: Vercel CLI - Recommended for advanced users**

---

## 📱 Method 1: Vercel Dashboard (GUI)

### Step 1: Prepare Your Project

#### 1.1. Clean up test files (optional)
```bash
cd "C:\Users\Omkar\Documents\Projects\Markify"
rm test_comprehensive_syntax.md test_large_100pages.md generate_large_test.js
```

#### 1.2. Initialize Git repository (if not already done)
```bash
cd "C:\Users\Omkar\Documents\Projects\Markify"
git init
git add .
git commit -m "Initial commit - Markify application"
```

#### 1.3. Create GitHub repository and push
```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/markify.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy via Vercel Dashboard

#### 2.1. Log in to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Log In"
3. Choose your preferred login method (GitHub, GitLab, or Email)

#### 2.2. Import Your Project
1. Click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories listed
3. Find and click on your **markify** repository
4. Click **"Import"**

#### 2.3. Configure Project Settings

Vercel will automatically detect the configuration, but verify these settings:

**Framework Preset**: Vite
- ✅ This should be auto-detected

**Build Command**: `npm run build`
- ✅ Already configured in `vercel.json`

**Output Directory**: `dist`
- ✅ Already configured in `vercel.json`

**Install Command**: `npm install`
- ✅ Already configured in `vercel.json`

#### 2.4. Environment Variables (Optional)

Add environment variables if needed:

1. Scroll down to **"Environment Variables"**
2. Add any variables from `.env.example` that you want to customize:

```env
VITE_APP_NAME=Markify
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Professional Markdown to Word Document Converter
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_TRACKING=false
VITE_MAX_FILE_SIZE_MB=10
```

3. Click **"Add"** for each variable
4. Choose the scope (Production, Preview, Development)

#### 2.5. Deploy

1. Click **"Deploy"** button
2. Wait for the deployment to complete (usually 1-2 minutes)
3. You'll see a success message with your deployment URL

### Step 3: Access Your Deployed App

Your app will be available at:
- **Production**: `https://your-project-name.vercel.app`
- **Preview URLs**: For each git push/commit

---

## 💻 Method 2: Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate:
1. Choose your login method (GitHub, GitLab, or Email)
2. Complete the authentication in your browser

### Step 3: Deploy Your Project

#### 3.1. Navigate to your project directory
```bash
cd "C:\Users\Omkar\Documents\Projects\Markify"
```

#### 3.2. Deploy for the first time
```bash
vercel
```

You'll be prompted with several questions:

**? Set up and deploy "~/C:/Users/Omkar/Documents/Projects/Markify"?** `Y`

**? Which scope do you want to deploy to?** `Your username/team`

**? Link to existing project?** `N` (for new project)

**? What's your project's name?** `markify` (or your preferred name)

**? In which directory is your code located?** `./` (default)

**? Want to override the settings?** `N` (use existing vercel.json configuration)

The deployment will begin automatically.

### Step 4: Preview Your Deployment

After deployment, you'll get:
- **Preview URL**: `https://markify-xxxxx.vercel.app`
- **Production URL**: `https://markify.vercel.app` (after production deployment)

### Step 5: Deploy to Production

```bash
vercel --prod
```

This deploys to your production URL.

---

## 🔧 Advanced Configuration

### Custom Domain Setup

#### 1. Add Custom Domain
1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"** and enter your domain (e.g., `markify.yourdomain.com`)

#### 2. Configure DNS
Add the following DNS records:

**For APEX domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For subdomain (markify.yourdomain.com):**
```
Type: CNAME
Name: markify
Value: cname.vercel-dns.com
```

### Environment Variables Management

#### Via Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add/update variables
3. Redeploy to apply changes

#### Via CLI:
```bash
# Add environment variable
vercel env add VITE_APP_NAME production

# List all environment variables
vercel env ls

# Remove environment variable
vercel env rm VITE_APP_NAME production
```

### Build Optimization

The current `vercel.json` already includes optimal settings:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "framework": "vite",
  "installCommand": "npm install",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 🔄 Continuous Deployment

### Automatic Deployments with Git

Once connected to GitHub, Vercel will automatically deploy:

1. **On every push** to main branch → Production deployment
2. **On every push** to other branches → Preview deployment
3. **On every pull request** → Preview deployment

### Deployment Workflow

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"

# Push to trigger deployment
git push origin main

# Vercel automatically deploys to production
```

### Branch Preview Deployments

```bash
# Create a new branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to create preview deployment
git push origin feature/new-feature

# Vercel creates a preview URL for testing
```

---

## 📊 Monitoring and Analytics

### Vercel Analytics

1. Go to your project dashboard
2. Click **"Analytics"** tab
3. Enable Vercel Analytics (free tier available)

### Performance Monitoring

1. Check **"Deployments"** tab for build logs
2. Monitor **"Functions"** for any server-side functions
3. Use **"Logs"** for real-time debugging

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue 1: Build Fails
**Solution:**
```bash
# Test build locally first
npm run build

# Check for errors
npm run lint
npm run type-check
```

#### Issue 2: Environment Variables Not Working
**Solution:**
- Ensure variables start with `VITE_` prefix
- Redeploy after adding variables
- Check variable scope (Production/Preview/Development)

#### Issue 3: 404 Errors on Refresh
**Solution:**
The `vercel.json` already includes the necessary rewrite rules:
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

#### Issue 4: Deployment Stuck
**Solution:**
```bash
# Cancel current deployment
vercel cancel

# Redeploy
vercel --prod
```

#### Issue 5: Large File Upload Issues
**Solution:**
- Check `VITE_MAX_FILE_SIZE_MB` environment variable
- Ensure Vercel's 10MB limit is not exceeded
- Consider optimizing file handling if needed

---

## 🔒 Security Best Practices

### 1. Environment Variables
- Never commit `.env` files
- Use Vercel's environment variable management
- Rotate sensitive keys regularly

### 2. Content Security Policy
The current `vercel.json` includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`

### 3. HTTPS Only
Vercel automatically:
- Provides SSL certificates
- Redirects HTTP to HTTPS
- Handles certificate renewal

---

## 📈 Performance Optimization

### Current Optimizations

The application already includes:

1. **Code Splitting**: Vite automatically splits code
2. **Tree Shaking**: Unused code is eliminated
3. **Asset Optimization**: Images and assets are optimized
4. **CDN Delivery**: Vercel's global CDN

### Additional Optimizations (Optional)

#### 1. Enable Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to your `main.jsx`:
```jsx
import { Analytics } from '@vercel/analytics/react';

// In your App component
<Analytics />
```

#### 2. Image Optimization
Use Vercel's image optimization for any images you add.

---

## 🧪 Testing Your Deployment

### 1. Manual Testing Checklist

- [ ] Home page loads correctly
- [ ] File upload works
- [ ] Markdown parsing works
- [ ] Document conversion works
- [ ] Download functionality works
- [ ] Responsive design on mobile
- [ ] Error handling works
- [ ] Large file upload (test with 100-page file)

### 2. Automated Testing

Run tests before deployment:
```bash
npm test
npm run build
```

### 3. Load Testing

Test with your large markdown file:
```bash
# Upload test_large_100pages.md
# Verify performance and functionality
```

---

## 📝 Post-Deployment Checklist

- [ ] Verify production URL is accessible
- [ ] Test all core functionality
- [ ] Check mobile responsiveness
- [ ] Verify file upload limits
- [ ] Test with large files
- [ ] Set up custom domain (optional)
- [ ] Configure analytics (optional)
- [ ] Set up monitoring (optional)
- [ ] Update DNS records (if using custom domain)
- [ ] Share deployment URL with stakeholders

---

## 🎉 Success!

Your Markify application is now live on Vercel! 🚀

### Your URLs

- **Production**: `https://your-project-name.vercel.app`
- **Git Repository**: `https://github.com/YOUR_USERNAME/markify`

### Next Steps

1. **Monitor Performance**: Keep an eye on the Vercel dashboard
2. **Gather Feedback**: Share with users and collect feedback
3. **Iterate**: Make improvements based on usage data
4. **Scale**: Vercel automatically handles scaling

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/build.html)
- [React Deployment Best Practices](https://reactjs.org/docs/optimizing-performance.html)
- [Markify GitHub Repository](https://github.com/YOUR_USERNAME/markify)

---

## 💡 Tips and Tricks

### 1. Preview Deployments
Use preview deployments for testing before production:
```bash
git push origin feature-branch
# Get preview URL from Vercel dashboard
```

### 2. Rollback
If something goes wrong:
```bash
# Go to Vercel dashboard
# Click "Deployments"
# Find the previous successful deployment
# Click "..." → "Promote to Production"
```

### 3. Domain Aliases
Add multiple domains to point to the same app.

### 4. Team Collaboration
Invite team members to collaborate on Vercel projects.

---

**Need Help?**
- Check [Vercel's documentation](https://vercel.com/docs)
- Review [troubleshooting section](#-troubleshooting)
- Open an issue on GitHub

**Happy Deploying! 🚀**