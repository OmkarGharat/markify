#!/bin/bash

# Markify Vercel Deployment Script
# This script helps you deploy Markify to Vercel

set -e

echo "🚀 Markify Vercel Deployment Script"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "ℹ $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the Markify root directory."
    exit 1
fi

print_success "Found package.json - in correct directory"

# Step 1: Clean up test files
print_info "Step 1: Cleaning up test files..."
if [ -f "test_comprehensive_syntax.md" ]; then
    rm test_comprehensive_syntax.md
    print_success "Removed test_comprehensive_syntax.md"
fi

if [ -f "test_large_100pages.md" ]; then
    rm test_large_100pages.md
    print_success "Removed test_large_100pages.md"
fi

if [ -f "generate_large_test.js" ]; then
    rm generate_large_test.js
    print_success "Removed generate_large_test.js"
fi

# Step 2: Run tests
print_info "Step 2: Running tests..."
if npm test -- --run; then
    print_success "All tests passed"
else
    print_error "Tests failed. Please fix them before deploying."
    exit 1
fi

# Step 3: Build the project
print_info "Step 3: Building the project..."
if npm run build; then
    print_success "Build completed successfully"
else
    print_error "Build failed. Please check the errors above."
    exit 1
fi

# Step 4: Check if git is initialized
print_info "Step 4: Checking git status..."
if [ ! -d ".git" ]; then
    print_warning "Git repository not initialized. Initializing now..."
    git init
    git add .
    git commit -m "Initial commit - Markify application"
    print_success "Git repository initialized"
else
    print_success "Git repository already initialized"
fi

# Step 5: Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes."
    read -p "Do you want to commit them now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        print_success "Changes committed"
    else
        print_warning "Skipping commit. Please commit changes before deploying."
    fi
else
    print_success "No uncommitted changes"
fi

# Step 6: Check if Vercel CLI is installed
print_info "Step 6: Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing now..."
    npm install -g vercel
    print_success "Vercel CLI installed"
else
    print_success "Vercel CLI already installed"
fi

# Step 7: Check if logged in to Vercel
print_info "Step 7: Checking Vercel login status..."
if vercel whoami &> /dev/null; then
    print_success "Already logged in to Vercel"
else
    print_warning "Not logged in to Vercel. Please login..."
    vercel login
    print_success "Logged in to Vercel"
fi

# Step 8: Deploy to Vercel
print_info "Step 8: Deploying to Vercel..."
echo ""
print_warning "You will be prompted with several questions. Here are the recommended answers:"
echo "  - Set up and deploy? Y"
echo "  - Which scope? Your username"
echo "  - Link to existing project? N (for first deployment)"
echo "  - Project name? markify (or your preferred name)"
echo "  - In which directory? ./ (default)"
echo "  - Override settings? N (use existing vercel.json)"
echo ""
read -p "Press Enter to continue with deployment..."

vercel

# Step 9: Ask about production deployment
echo ""
print_warning "Deployment completed! This is a preview deployment."
read -p "Do you want to deploy to production now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Deploying to production..."
    vercel --prod
    print_success "Production deployment completed!"
else
    print_info "Skipping production deployment. You can deploy later with: vercel --prod"
fi

# Final summary
echo ""
echo "===================================="
echo "🎉 Deployment Summary"
echo "===================================="
print_success "Tests passed"
print_success "Build completed"
print_success "Deployed to Vercel"
echo ""
print_info "Next steps:"
echo "  1. Visit your Vercel dashboard to see the deployment"
echo "  2. Test the deployed application"
echo "  3. Set up custom domain (optional)"
echo "  4. Configure environment variables (optional)"
echo ""
print_info "Useful commands:"
echo "  - vercel --prod      # Deploy to production"
echo "  - vercel logs        # View deployment logs"
echo "  - vercel env ls      # List environment variables"
echo "  - vercel --prod      # Redeploy to production"
echo ""
print_success "Deployment process completed! 🚀"