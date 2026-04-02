# 💜 Purple Romance Website for Ari 💜

A beautiful, romantic website created with love. Features floating purple petals, customizable love notes, and interactive envelope modals.

## 📁 Project Structure

```
ARI WEBSITE/
├── index.html          # Main HTML file
├── styles.css          # Separated CSS styles
├── app.js              # Separated JavaScript logic
├── package.json        # Project metadata & scripts
├── vercel.json         # Vercel deployment configuration
└── README.md           # This file
```

## 🎨 Design & Features

- **Responsive Design**: Works beautifully on mobile, tablet, and desktop
- **Floating Petals**: Gentle, performance-optimized animation system
- **Editable Love Notes**: Click any romantic message to customize it
- **Interactive Envelopes**: Click cards to reveal beautiful love letters
- **Purple Theme**: Elegant gradient backgrounds and glassmorphic cards
- **Font Awesome Icons**: Beautiful decorative elements throughout
- **Tailwind CSS**: Modern utility-first styling

## 📦 Dependencies

All dependencies are loaded via **CDN** (no npm packages required for production):

- **Tailwind CSS** - Utility-first CSS framework
- **Google Fonts (Quicksand)** - Beautiful typography
- **Font Awesome 6** - Icon library

### Development Dependencies

Optional - for local development:
- `http-server` - Simple local server (for testing locally)

## 🚀 Getting Started

### Option 1: Direct File Opening (Easiest)

Simply open `index.html` directly in your browser.

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### Option 2: Local Server (Recommended for Testing)

Install dependencies and run a local server:

```bash
# Install dependencies
npm install

# Start development server (opens in browser)
npm start

# Or just serve without opening browser
npm run serve
```

The website will be available at `http://localhost:8080` (or `http://localhost:8000` depending on your http-server config).

## 🔧 Customization

### Edit Love Messages

Open `app.js` and find the `envelopeMessages` object around line 120:

```javascript
const envelopeMessages = {
  1: {
    title: "💜 Ari's Eternal Promise 💜",
    message: "Your custom message here..."
  },
  2: {
    title: "🌙 Forever Vow for Ari 🌙",
    message: "Your custom message here..."
  },
  3: {
    title: "💌 Purple Daydream Letter 💌",
    message: "Your custom message here..."
  }
};
```

### Customize Romantic Quotes

In `app.js`, modify the `quotes` array (around line 100) to add your own romantic quotes.

### Update Colors & Styling

Edit `styles.css` to customize:
- Color scheme
- Animation speeds
- Glassmorphic effects
- Petal animations

## 🌐 Deployment to Vercel

### Prerequisites

1. [Create a Vercel account](https://vercel.com) (free)
2. [Install Vercel CLI](https://vercel.com/docs/cli) or use GitHub

### Method 1: Using Vercel CLI (Easiest)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from your project directory
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Confirm project settings
# - Done! You'll get a deployment URL
```

### Method 2: Using GitHub (Recommended)

1. **Create a GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Purple romance website for Ari"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ari-website.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects settings from `vercel.json`
   - Click "Deploy"

3. **Enable Automatic Deployments**
   - Any push to your GitHub main branch auto-deploys!

### Method 3: Using Vercel Dashboard (Drag & Drop)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag and drop your project folder
3. Click Deploy
4. Done! 🚀

## 📊 Deployment Features

- **Auto-scaling**: Handles traffic automatically
- **Global CDN**: Serves from closest location to users
- **SSL/HTTPS**: Automatic secure certificates
- **Custom Domain**: Add your own domain (optional)
- **Environment Variables**: For sensitive data (if needed)

### After Deployment

Your website will be live at: `https://your-project-name.vercel.app`

**To add a custom domain:**
1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Follow DNS instructions from your domain registrar

## 🎯 Next Steps

1. ✅ Test locally: `npm start`
2. ✅ Customize messages in `app.js`
3. ✅ Deploy to Vercel
4. ✅ Share the URL with Ari! 💜

## 📝 File Descriptions

- **index.html**: Contains HTML structure with semantic markup and meta tags
- **styles.css**: All CSS including animations, glassmorphism, and responsiveness
- **app.js**: JavaScript for petals, interactivity, and envelope modal logic
- **package.json**: Project metadata and development scripts
- **vercel.json**: Vercel deployment configuration

## 🛠️ Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern animations and glassmorphism
- **Vanilla JavaScript**: No framework dependencies
- **Tailwind CSS**: Utility-first CSS
- **Vercel**: Deployment platform

## 💡 Tips

- **Mobile Friendly**: All effects work smoothly on mobile devices
- **Performance**: Optimized petal system caps at 32 petals
- **Accessibility**: Semantic HTML and ARIA labels where needed
- **No Backend**: Static HTML - no server needed!

## 🎓 Learning Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Font Awesome Icons](https://fontawesome.com)
- [MDN Web Docs](https://developer.mozilla.org)

## 📞 Support

For Vercel deployment issues:
- [Vercel Docs](https://vercel.com/docs)
- [Vercel Community](https://vercel.com/community)

## 💜 Final Note

This website is built with pure HTML, CSS, and JavaScript - no complex build process needed. Everything works right out of the box!

---

**Made with 💜 for Ari**
