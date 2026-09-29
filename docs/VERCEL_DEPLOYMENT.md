# Vercel Deployment Guide — MERIDAS

This guide explains how to deploy the MERIDAS frontend to Vercel seamlessly.

---

## 1. Import Repository into Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** → **"Project"**.
2. Select your repository: `Johanvasquezdev/Meridas`.

---

## 2. Project Configuration Settings
When importing, configure the following settings:

| Setting | Recommended Value |
|---|---|
| **Framework Preset** | `Next.js` |
| **Root Directory** | `frontend` *(Click Edit and select the `frontend` folder)* |
| **Build Command** | `next build` *(default)* |
| **Output Directory** | `.next` *(default)* |
| **Install Command** | `npm install` *(default)* |

> **Note**: If you keep the Root Directory as `/` (root), the repository includes a root `vercel.json` configured to build `frontend` automatically.

---

## 3. Environment Variables on Vercel
In the Vercel project settings, navigate to **Settings** → **Environment Variables** and add:

### Required Variables:
| Variable Name | Environment | Description / Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Production, Preview | URL of your deployed backend (e.g. `https://api.yourdomain.com` or Railway/Render URL) |
| `NEXT_PUBLIC_APP_NAME` | All | `Meridas` |
| `NEXT_PUBLIC_APP_VERSION` | All | `1.0.0` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | All | Your Clerk publishable key (`pk_test_...` or `pk_live_...`) |
| `CLERK_SECRET_KEY` | All | Your Clerk secret key (`sk_test_...` or `sk_live_...`) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | All | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | All | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | All | `/dashboard/chat` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | All | `/dashboard/chat` |

### Optional / Payment Variables:
| Variable Name | Environment | Description / Example |
|---|---|---|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | All | Your Stripe publishable key (`pk_test_...` or `pk_live_...`) |

---

## 4. Verification Checklist Before Going Live
- [x] TypeScript builds with 0 errors (`npx tsc --noEmit`).
- [x] Next.js 16 production build compiles all 16 static and dynamic routes.
- [x] Clerk middleware is active for protected routes (`/dashboard/*`, `/billing/*`, `/checkout/*`).
- [x] IBM Plex Sans font rendering configured with Google Fonts.
- [x] Responsive layout tested for mobile, tablet, and desktop viewports.
