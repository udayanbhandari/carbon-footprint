# CarbonSense - Carbon Footprint Awareness Platform

A client-side Web Application designed to help individuals understand, track, and reduce their carbon footprint through simple actions and personalized AI insights.

## Overview

CarbonSense is a highly responsive, offline-capable SPA (Single Page Application) that prioritizes user privacy, low overhead, and speed. All footprint tracking, quiz progress, and calculations happen purely in the browser using localized storage. The AI integration leverages the Google Gemini API with a strict Tier-1 synchronous keyword-matching fallback, ensuring zero-downtime reliability.

## Features

- **Personalized Carbon Tracking**: Real-time calculator for transport, food, energy, and shopping.
- **Smart AI Assistant**: Ask questions and get customized carbon-reduction advice based on your current footprint context.
- **Action Wizard**: Get a custom roadmap to reduce emissions and save money.
- **Climate Timeline**: Explore the milestones of climate science and global policy.
- **Climate Knowledge Quiz**: Test your understanding of emissions and global averages.
- **Lifecycle Explorer**: See where emissions originate in everyday products.

## Architecture

- **React + Vite**: Fast, unbundled development server with optimized production builds.
- **TypeScript**: Strict type safety defining all internal data structures (e.g. `CarbonActivity`, `FootprintEntry`).
- **Tailwind CSS**: Utility-first CSS using a custom `mesh` background and branded eco-palette.
- **Zustand**: Global state management configured with `persist` to securely store footprint data locally without a database.
- **Google Gemini**: Asynchronous tier-2 AI enrichment with built-in context building.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Testing

Vitest is used along with React Testing Library.

```bash
npm run test
```

## Security & Deployment

- No back-end servers required.
- API keys are injected at build time, and no hard-coded secrets exist in the source code.
- Fully compatible with Vercel or Netlify via `vercel.json` and `netlify.toml` edge rewrites and hardened security headers.
