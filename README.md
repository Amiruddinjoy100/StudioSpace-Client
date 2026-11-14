# StudioSpace — Client

**Live website URL:** `NOT DEPLOYED — add your Vercel URL after deployment`

## Website features

- Swiper-powered three-slide hero and dynamic six-studio showcase fetched from MongoDB through the Express API.
- Studio category filtering, search, sorting, detail pages, amenities, host details, image galleries, and booking modal.
- Better Auth email/password and optional Google login, with persistent private routes and session-aware navbar.
- Private dashboard, own listings management, booking management, and saved studio wishlist.
- Responsive editorial design, dark/light theme, Sonner toast feedback, custom not-found route, skeleton loaders, and empty states.

## Tech stack

- Next.js 15 (App Router) and React 19
- JavaScript + global responsive CSS
- Better Auth React client
- Swiper, Lucide React icons, and Sonner
- REST integration with Express + MongoDB backend

## Start the frontend locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

- App: http://localhost:3000
- Backend: run sibling `server` project at http://localhost:5000 first.
- `NEXT_PUBLIC_API_URL` must match the API host.
- Build check: `npm run build` (run after dependencies install).

## Examiner credentials

Run the server's `npm run seed` first:

- **Email:** `examiner@studiospace.test`
- **Password:** `DemoPass123`

These are intended for **local demonstration only**, not public deployment. Refer to the root README for safe setup and the user/host booking test walkthrough.
