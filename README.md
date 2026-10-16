# Haseeb Ur Rehman: Portfolio

React + Vite + Tailwind + Framer Motion, with Firebase (Auth + Firestore) and Cloudinary (images).
Portfolio is at `/` and the admin panel is at `/admin`.

## 1. Firebase setup
1. Go to https://console.firebase.google.com > **Add project** (turn Analytics off).
2. **Build > Firestore Database > Create database** > production mode > pick a nearby region.
3. **Build > Authentication > Get started > Email/Password > Enable.**
4. Authentication > **Users > Add user**: enter your admin email and password. **Copy the User UID** shown.
5. **Firestore > Rules**: paste the contents of `firestore.rules`, replace `PASTE_YOUR_ADMIN_UID_HERE` with your UID, click **Publish**.
   (This is what really protects your data. Only your account can edit.)
6. **Project settings (gear) > Your apps > Web (</>)** > register app > copy the config values.

## 2. Cloudinary setup
1. Sign up free at https://cloudinary.com. On the Dashboard copy your **Cloud name**.
2. **Settings (gear) > Upload > Upload presets > Add upload preset**.
3. Set **Signing mode = Unsigned**, name it (e.g. `portfolio`), Save. Copy the preset name.

## 3. Environment keys
Copy `.env.example` to `.env` and fill every value (Firebase config + Cloudinary cloud name and preset).

## 4. Run locally (needs Node 18+)
```
npm install
npm run dev
```
Open http://localhost:5173 and http://localhost:5173/admin

## 5. Deploy on Netlify
Option A (recommended, GitHub): push this folder to GitHub > Netlify **Add new site > Import from Git** > build command `npm run build`, publish directory `dist` (already in `netlify.toml`).
Option B (drag and drop): run `npm run build`, then drag the `dist` folder into Netlify Deploys.

**Important:** Netlify does not read your local `.env`.
Go to **Site configuration > Environment variables** and add all 8 `VITE_...` keys, then **redeploy**
(with drag and drop, build locally with the `.env` filled in first).

Then in Firebase **Authentication > Settings > Authorized domains**, add your Netlify domain (e.g. `yoursite.netlify.app`).

## 6. Using the admin panel
Open `yoursite.netlify.app/admin` and log in. Changes appear on the portfolio instantly. No re-upload is needed.
- **Profile & About:** upload or change your profile picture, edit your About Me text, tagline and contact links.
- **Projects:** add, edit and delete work (thumbnail, category, video link, description).
- **Daily updates:** post text with an optional image.

## Troubleshooting
- *Permission denied:* check that the UID in the rules matches your user, and that you published the rules.
- *Upload failed:* the preset must be **Unsigned**, and the cloud name and preset in `.env` must be correct.
- *Blank data on Netlify:* the env variables were not added before the build. Add them and redeploy.

## Deploy on Cloudflare Pages
1. Cloudflare dashboard > **Workers & Pages > Create > Pages > Connect to Git** (or Upload assets with the built `dist` folder).
2. Build command: `npm run build`. Output directory: `dist`.
3. **Settings > Environment variables:** add `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` (Firebase keys are already built in as fallbacks).
4. `public/_redirects` makes `/admin` work on refresh.
5. Firebase > Authentication > Settings > **Authorized domains:** add your `*.pages.dev` domain.
