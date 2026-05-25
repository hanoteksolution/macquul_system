# Safari Ecommerce — Mobile App (Expo)

## Prerequisites

- Node.js 18+
- [Expo Go](https://expo.dev/go) on your phone (iOS / Android), **or** Android Studio / Xcode for emulators
- Backend running (production: `https://ecommerce.safaritechno.com/api/`)

## 1. Install & configure

```bash
cd ecommerce_mobile
npm install
```

API URL is set in `.env`:

```env
EXPO_PUBLIC_API_URL=https://ecommerce.safaritechno.com
```

For **local Docker** on the same server (phone on Wi‑Fi):

```env
EXPO_PUBLIC_API_URL=http://88.222.220.238:8020
```

For **Android emulator** on your PC:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8020
```

After changing `.env`, restart Expo (`Ctrl+C`, then `npm start`).

## 2. Start the app

```bash
npm start
# or
npx expo start
```

Then:

| Option | How |
|--------|-----|
| **Phone (Expo Go)** | Scan the QR code in the terminal |
| **Android emulator** | Press `a` in the Expo terminal |
| **iOS simulator** (Mac only) | Press `i` |
| **Web preview** | Press `w` or `npm run web` |

### Remote server (this VPS)

Expo is bound to port **8081**. If your firewall allows it, open:

`exp://88.222.220.238:8081`

Otherwise use a tunnel:

```bash
npx expo start --tunnel
```

Or run Expo on your **local computer** (same repo) and keep `EXPO_PUBLIC_API_URL` pointing at production HTTPS.

## 3. Test login

Default admin (from seed data):

- **Email:** `admin@example.com`
- **Password:** `admin123`

Register a new account from the app if you prefer a customer account.

## 4. Troubleshooting

| Problem | Fix |
|---------|-----|
| Products never load | Check `.env` API URL; open `https://ecommerce.safaritechno.com/api/products/` in a browser |
| Network error on emulator | Use `http://10.0.2.2:8020` not `localhost` |
| Session expired | Log in again from Profile |
| `npm install` fails | Run `npm install --legacy-peer-deps` |

## 5. Production build (optional)

```bash
npx expo prebuild
npx expo run:android   # or run:ios on Mac
```
