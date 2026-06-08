# Kalai Pezhai — Design Intelligence Platform

A governed design intelligence platform for design teams.

Built by **Aadhithiyan**, Senior UX Strategist.

---

## What it does

- Generates governed outputs for 30 tools across 8 categories
- Plugin Generator — describe any Figma plugin, get the files to install immediately
- Token Sandbox — 28 components with live governance audit
- Vision — upload any design image, extract style, reverse-engineer a prompt
- Figma Docs — ZeroHeight-style component documentation generator

---

## Deploy in 4 steps

### Step 1 — Fork this repository on GitHub

### Step 2 — Deploy the server to Vercel
1. Go to vercel.com, sign in with GitHub, import this repository
2. Add environment variable: `ANTHROPIC_API_KEY` = your Anthropic API key
3. Add environment variable: `ALLOWED_ORIGIN` = `https://yourusername.github.io`
4. Click Deploy. Copy your deployment URL.

### Step 3 — Update index.html with your Vercel URL
Find this line in index.html (around line 50):
```
const PROXY_URL = "https://kalai-pezhai.vercel.app";
```
Replace with your actual Vercel URL. Commit and push.

### Step 4 — Enable GitHub Pages
Repository Settings → Pages → Source: main branch, root folder → Save.

Your platform is live at `https://yourusername.github.io/kalai-pezhai`

---

## Companion repository

The Figma Design System Generator plugin is in a separate repository:
`github.com/yourusername/kalai-figma-plugin`

---

*v9 Brain Dataset · 5,155 rows · 32 sheets · 53 governance prefixes*
*Aadhithiyan · Senior UX Strategist*
