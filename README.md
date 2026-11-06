# BAPPY — Personal Developer Portfolio

Personal portfolio of **Md. Abdur Rahman Bappy**, a CSE undergraduate at ULAB.
Built with **React, TypeScript, Vite, Tailwind CSS, Framer Motion and Lucide icons**.

## Getting started

Requirements: Node.js 18+ (20 or 22 recommended).

```bash
npm install        # install dependencies
npm run dev        # start the dev server at http://localhost:5173
npm run typecheck  # type-check the project
npm run build      # production build into /dist
npm run preview    # preview the production build locally
```

## Folder structure

```
├── index.html               # SEO metadata, Open Graph, JSON-LD, fonts
├── public/
│   ├── resume.pdf           # ← replace with your real resume
│   ├── images/              # ← profile photo, project thumbnails, gallery photos
│   ├── __forms.html         # static copy of the contact form for Netlify Forms
│   ├── favicon.svg, og-image.svg, robots.txt
├── src/
│   ├── data/                # ← ALL editable content lives here
│   │   ├── profile.ts       # name, email, photo, resume, social links, nav
│   │   ├── skills.ts        # skill groups (languages, tools, technologies, learning)
│   │   ├── projects.ts      # project cards
│   │   ├── experience.ts    # volunteering roles + leadership cards
│   │   ├── gallery.ts       # photography gallery
│   │   ├── achievements.ts  # certificates, workshops, competitions…
│   │   └── types.ts
│   ├── components/
│   │   ├── layout/          # Navbar, Footer, BackToTop (+ scroll progress)
│   │   ├── ui/              # Reveal, SectionHeader, Button, SocialLinks, Placeholder
│   │   └── icons/           # GitHub / LinkedIn / Facebook / Instagram / Snapchat SVG icons
│   ├── sections/            # Hero, About, Education, Skills, Projects, Experience,
│   │                        # Leadership, Photography, Achievements, Contact
│   ├── hooks/               # useTheme (dark/light), useActiveSection
│   ├── App.tsx, main.tsx
│   └── index.css            # design tokens (CSS variables) for both themes
├── tailwind.config.js       # maps tokens to Tailwind colours, fonts, animations
└── netlify.toml
```

## Customising

| What | Where |
| --- | --- |
| Profile photo | Put `profile.jpg` in `public/images/`, set `photo: '/images/profile.jpg'` in `src/data/profile.ts` |
| GitHub / LinkedIn / Facebook | Fill the `href` values in `socials` in `src/data/profile.ts` (empty = shown as "coming soon") |
| Resume | Replace `public/resume.pdf` (currently a one-page placeholder) |
| Skills | Add objects to the groups in `src/data/skills.ts` |
| Projects | Edit `src/data/projects.ts`; remove `placeholder: true` for real projects; thumbnails in `public/images/projects/` |
| Experience dates | Fill `period` in `src/data/experience.ts` |
| Photos | Add images to `public/images/gallery/` and set `src` + `alt` in `src/data/gallery.ts` |
| Achievements | Add items to the categories in `src/data/achievements.ts` |
| Colours | Edit the CSS variables in `src/index.css` (`:root` = dark, `.light` = light) |

## Contact form — does it need a backend?

Yes, a form always needs something on the server to receive messages. This project uses
**Netlify Forms**, which works automatically when the site is deployed on Netlify — no extra
code or account needed. Submissions appear in the Netlify dashboard under **Forms**, and you
can enable email notifications there (Forms → Form notifications → Add notification → Email).

When running locally with `npm run dev`, or when hosted somewhere else (e.g. Vercel), the form
will show an error because Netlify Forms isn't available there. On Vercel, connect a form
service such as Formspree, Web3Forms or EmailJS and change the `fetch` call in
`src/sections/Contact.tsx` to that service's endpoint. The email link always works everywhere.

## Deployment

### Netlify (current host)
Already configured via `netlify.toml` (build: `npm run build`, publish: `dist`). Push to the
`main` branch and Netlify builds and deploys automatically.

### Vercel
1. Push the project to a GitHub repository.
2. On https://vercel.com → **Add New → Project**, import the repository.
3. Vercel detects Vite automatically: build command `npm run build`, output directory `dist`.
4. Click **Deploy**. (Remember to switch the contact form to a form service — see above.)

Or with the CLI: `npm i -g vercel && vercel` in the project folder.
