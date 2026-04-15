# 🚀 Quick Vercel Deployment Checklist

Use this checklist for quick reference when deploying Markify to Vercel.

## Pre-Deployment Checklist

- [ ] **Tests Pass**: Run `npm test` to ensure all tests pass
- [ ] **Build Works**: Run `npm run build` to verify build succeeds
- [ ] **Clean Up**: Remove test files (`test_comprehensive_syntax.md`, `test_large_100pages.md`, `generate_large_test.js`)
- [ ] **Git Ready**: Ensure git repository is initialized and changes are committed
- [ ] **Environment Variables**: Set up any required environment variables

## Deployment Methods

### Method 1: Vercel Dashboard (GUI)
- [ ] Log in to [vercel.com](https://vercel.com)
- [ ] Click "Add New..." → "Project"
- [ ] Import your GitHub repository
- [ ] Verify auto-detected settings
- [ ] Add environment variables (if needed)
- [ ] Click "Deploy"

### Method 2: Vercel CLI
- [ ] Install CLI: `npm install -g vercel`
- [ ] Login: `vercel login`
- [ ] Deploy: `vercel`
- [ ] Deploy to production: `vercel --prod`

### Method 3: Automated Script
- [ ] **Windows**: Run `deploy.bat`
- [ ] **Mac/Linux**: Run `bash deploy.sh`

## Post-Deployment Checklist

- [ ] **Verify URL**: Check that `https://your-project.vercel.app` loads
- [ ] **Test Functionality**:
  - [ ] File upload works
  - [ ] Markdown parsing works
  - [ ] Document conversion works
  - [ ] Download works
- [ ] **Test Large Files**: Upload 100-page test file
- [ ] **Mobile Test**: Check responsive design on mobile
- [ ] **Error Handling**: Test error scenarios
- [ ] **Custom Domain** (optional): Set up if needed
- [ ] **Analytics** (optional): Enable Vercel Analytics

## Quick Commands

```bash
# Test and build
npm test
npm run build

# Vercel CLI commands
vercel login              # Login to Vercel
vercel                    # Deploy to preview
vercel --prod             # Deploy to production
vercel logs               # View logs
vercel env ls             # List environment variables
vercel env add KEY prod   # Add environment variable

# Git commands
git status                 # Check status
git add .                  # Stage changes
git commit -m "message"    # Commit changes
git push origin main       # Push to GitHub
```

## Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| Build fails | Run `npm run build` locally first |
| Tests fail | Run `npm test` and fix issues |
| 404 errors | Check `vercel.json` rewrite rules |
| Env vars missing | Add in Vercel dashboard |
| Deployment stuck | Run `vercel cancel` then redeploy |

## Important URLs

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Project Settings**: https://vercel.com/dashboard → Your Project → Settings
- **Deployment Logs**: https://vercel.com/dashboard → Your Project → Deployments
- **Environment Variables**: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

## File Size Limits

- **Current Limit**: 10 MB per file
- **Vercel Limit**: 10 MB per file (free tier)
- **Recommended**: Keep files under 5 MB for best performance

## Performance Benchmarks

- **Small File** (< 1 MB): < 2 seconds
- **Medium File** (1-5 MB): < 5 seconds
- **Large File** (5-10 MB): < 10 seconds
- **100-Page Document**: < 5 seconds

## Security Checklist

- [ ] No `.env` files committed
- [ ] Environment variables set in Vercel
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] Security headers configured
- [ ] File validation working

## Monitoring

- [ ] Check deployment logs regularly
- [ ] Monitor performance in Vercel dashboard
- [ ] Set up error tracking (optional)
- [ ] Enable analytics (optional)

## Rollback Plan

If something goes wrong:

1. **Immediate**: Go to Vercel dashboard
2. **Find**: Previous successful deployment
3. **Promote**: Click "..." → "Promote to Production"
4. **Investigate**: Check logs for errors
5. **Fix**: Make necessary changes
6. **Redeploy**: Push fixes and redeploy

## Success Indicators

✅ **Deployment Successful When:**
- All tests pass
- Build completes without errors
- Production URL loads correctly
- All features work as expected
- Large files can be uploaded and processed
- No console errors in browser

## Need Help?

- **Documentation**: See `DEPLOYMENT_GUIDE.md`
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Issues**: Check project repository
- **Community**: Vercel Discord community

---

**Last Updated**: 2026-04-15
**Version**: 1.0.0