# Deployment Guide - Frame Zero Web App

## Quick Deploy to Vercel

The easiest way to deploy the Frame Zero web app is using Vercel:

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub** (already done ✓)
   ```bash
   git push origin claude/nightlife-content-engine-zNIpy
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your `Frame-Zero` repository
   - Select the `claude/nightlife-content-engine-zNIpy` branch
   - Set root directory to `webapp`
   - Click "Deploy"

3. **Configuration**
   - Framework Preset: Next.js
   - Root Directory: `webapp`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

### Option 2: Deploy from CLI

```bash
cd webapp
npx vercel
# Follow the prompts
```

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Crypto-Vidal/Frame-Zero&project-name=frame-zero&repository-name=frame-zero&root-directory=webapp)

## Environment Variables

No environment variables are required for basic operation. The app runs entirely client-side.

## Build Configuration

The webapp is configured with:
- Next.js 15 with Turbopack
- TypeScript for type safety
- Tailwind CSS for styling
- Client-side rendering (no API routes needed)

Build output is optimized for edge deployment.

## Post-Deployment

After deployment, your app will be available at:
- Production: `https://your-project.vercel.app`
- Preview: Automatic preview deployments for each push

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Performance

The app is optimized for:
- Fast initial load (static generation)
- Instant client-side generation
- Mobile-responsive design
- Edge-optimized delivery

## Monitoring

Vercel provides:
- Real-time analytics
- Error tracking
- Performance monitoring
- Deployment logs

Access these from your Vercel dashboard.

## Troubleshooting

### Build Failures

If build fails, check:
1. Node version (use Node 18+)
2. Dependencies are installed
3. TypeScript has no errors

Run locally first:
```bash
cd webapp
npm install
npm run build
```

### Font Loading Issues

The app uses system fonts (no Google Fonts dependency) to avoid TLS issues.

### Import Errors

All imports use TypeScript path aliases (`@/lib/*`). Ensure `tsconfig.json` is configured correctly.

## Local Development

```bash
cd webapp
npm install
npm run dev
# Open http://localhost:3000
```

## Production Build Test

```bash
cd webapp
npm run build
npm start
# Test production build locally
```

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review build logs in Vercel dashboard
- Ensure `webapp/` is set as root directory

---

**Your web app is ready to deploy!**

All code is committed to branch: `claude/nightlife-content-engine-zNIpy`
