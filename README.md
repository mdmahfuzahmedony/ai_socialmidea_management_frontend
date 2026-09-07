This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# HeyBazz — Final Roadmap (Phase 1 + Phase 2)

## Tech Stack

- **Frontend**: Next.js (TypeScript, App Router) — Vercel e free hosting
- **Backend**: Laravel (API) — Localhost / Railway
- **AI Service**: Python (FastAPI) — Render e free hosting
- **AI Text**: Google Gemini (Flash-Lite recommended — sobcheye beshi free quota, 2026 e ~1000 request/day)
- **AI Image**: Pollinations.ai (primary) + Hugging Face Inference API (backup, jodi Pollinations down thake)
- **Database**: MySQL

⚠️ **Note**: Gemini free tier 2026 e tight (Flash-Lite e ~1000 req/day, Pro e maţro ~100 req/day). Multiple paying user thakle ei quota fast shesh hoye jete pare — tai future e low-cost paid tier e move korার plan mাথায় rakho.

---

## ✅ Already Done (ei porjonto banano hoyeche)

- Homepage, About, Pricing, Contact, Integrations page (Next.js)
- User Dashboard + Admin Dashboard (interactive UI, mock data)
- Login / Signup page (email-password + Google + Facebook OAuth UI)
- Laravel: Facebook Socialite (redirect + callback), Google Socialite, AuthController (register/login/logout), SocialPage model (encrypted token), migration
- Setup wizard (Connect → Select pages → Confirm → Done)
- Platform integration guide (Facebook, Instagram, LinkedIn, TikTok, X, Threads er real requirement)

---

## 🚀 Phase 1 — MVP (Launch-ready core)

### Step 1: Foundation & Connection

- [x] Google/Facebook diye login
- [x] Facebook Graph API diye Page connect + DB te save
- [ ] Setup page e user tার main page select korবে (UI ache, backend wiring baki)
- [ ] **Privacy Policy + Terms of Service page** — Facebook App Review ar Google OAuth consent screen er jonno **required**, na thakle approval আটকে jabe

### Step 2: AI Audit Engine

- [ ] Python (FastAPI) diye page er last 10 post er engagement data fetch (Facebook API theke)
- [ ] Gemini ke data pathiye summary/audit report banano (simple version — 3-4 ta bullet point insight)
- [ ] Audit result Laravel er DB te save kore dashboard e dekhano

### Step 3: Smart Post Creator (simplified)

- [ ] User topic likhbe + (optional) nijer image upload korbe
- [ ] Pollinations.ai diye 1টা banner generate (multiple version na, MVP e 1টাই thik ache)
- [ ] Gemini diye 1টা caption + hashtag (3 category: trending/related/local — eta rakhা jay, effort kom)
- [ ] Facebook/Instagram size onujayi auto-resize (Pillow)

### Step 4: Preview & Automation

- [ ] Simple preview (banner + caption dekhabe, mockup phone frame lagbe na MVP e)
- [ ] "Confirm" korle Laravel Job Queue e post ta jabe
- [ ] **Laravel Queue + Scheduler (cron)** — eta MVP er জন্য **must**, age deya original plan e ei part ta missing chilo
- [ ] Confirm korle Facebook/Instagram API call kore publish

### Step 5: Reliability (often skipped, but important)

- [ ] Token expire/API fail hole retry logic + error log
- [ ] User ke error message dekhano (silent fail na)

---

## 🌟 Phase 2 — Pro Features (launch er por add korার jonno)

Ei gula **valo differentiator**, kintu MVP er por add korle better — age core flow ta stable kora dorkar.

| Feature                            | Kaj ki                                                 | Effort                                                   |
| ---------------------------------- | ------------------------------------------------------ | -------------------------------------------------------- |
| **Brand Voice Cloning**            | Page er purono post pore AI shei tone e caption likhbe | Medium                                                   |
| **Competitor Benchmarking**        | 3-4 ta competitor page audit kore comparison dibe      | Medium                                                   |
| **Sentiment Analysis**             | Comment gula analyze kore audit report e add korbe     | Medium                                                   |
| **A/B Testing (2 banner/caption)** | 1 er jaygay 2ta version generate, user pick korবে      | Low-Medium                                               |
| **Multi-Platform Mirror Preview**  | FB mobile view + IG grid view pashাpashি dekhano       | Low                                                      |
| **AI Mood Board**                  | Business type onujayi color palette suggest            | Low                                                      |
| **Interactive drag-drop canvas**   | Logo mouse diye move kora jabe banner er upore         | **High** (Fabric.js/Konva.js lagবে) — sobcheye pore korо |

---

## 📋 Action Items (ekhon theke shuru korার jonno)

1. Google AI Studio theke Gemini API key nao (already thakle skip)
2. Facebook Developer App ke Development mode e active koro, test user add koro
3. Python e ekটা choto script likhe test koro — Gemini diye page er audit generate hocche kina
4. **Privacy Policy + Terms page** likhe felo (simple template diyeও hoy, App Review er jonno lagবে)
5. Laravel Queue worker (`php artisan queue:work`) local e test koro — ei ta MVP er backbone
