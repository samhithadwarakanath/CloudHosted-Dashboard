

# CloudHosted Dashboard — Monolithic Deployment (SvelteKit + Vercel)

This repository contains the CloudHosted Dashboard: a monolithic SvelteKit web application implementing login & authentication, a dashboard UI, SvelteKit server routes for backend logic, Drizzle ORM for DB access, and third-party OAuth (Google) integration. This README documents the deployment architecture, CI/CD, security, scalability, monitoring, logging, and the usage of GenAI (GitHub Copilot) for development.

## Project Overview

CloudHosted Dashboard is a single SvelteKit project that contains:

- Login & authentication flow (Google OAuth example)
- Dashboard UI (Svelte + SvelteKit pages/components)
- Backend logic via SvelteKit server routes (`src/routes/api` and `src/routes/*/+server.ts`)
- Database interactions using Drizzle ORM (`src/lib/db`, `drizzle/` folder)
- Third-party API usage (Google OAuth, example external APIs)

Production URL:

https://cloudhosted-dashboard-login-861.vercel.app

---

## Part 1 — Monolithic Deployment 

### 1.1 Deployment Architecture

This project uses a monolithic deployment model where front-end, backend API routes, authentication, and DB interactions live in one SvelteKit repository and deploy together.

Vercel serves the app with:

- Static assets via global CDN
- Serverless functions for SvelteKit server routes
- Edge network for low-latency responses

Tech stack summary:

- Cloud host: Vercel
- Framework: SvelteKit
- Backend API: SvelteKit Server Routes
- DB ORM: Drizzle ORM
- Auth: OAuth (Google example)
- CI/CD: GitHub → Vercel
- Monitoring: Vercel logs + Analytics

Why this qualifies as monolithic deployment:

- Single codebase containing frontend and backend
- Single deployment target (Vercel)
- Shared routing and server logic
- Simple scaling and operational model

### 1.2 Deployment Steps (Vercel)

1. Add the Vercel adapter to SvelteKit (if not already present):

```sh
npm install -D @sveltejs/adapter-vercel
```

2. Configure `svelte.config.js` with the adapter, e.g.:

```js
import adapter from '@sveltejs/adapter-vercel';

const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
```

3. Build locally to verify:

```sh
npm ci
npm run build
```

4. Push code to GitHub:

```sh
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

5. Deploy on Vercel:

- Go to https://vercel.com and import your GitHub repository (CloudHosted-Dashboard).
- During import, add required environment variables in Vercel dashboard (do NOT commit secrets to git).
- Click Deploy. Vercel will run install/build and create a deployment.

### 1.3 Monitoring & Logging setup

Vercel provides built-in monitoring and logging:

- Function logs (server routes)
- Build & deployment logs
- Error reporting and stack traces
- Basic analytics (page views, latency) — optional plan features



---

## Part 2 — Automated Deployment (CI/CD Pipeline) 

This project uses GitHub → Vercel integration which provides an automated build→test→deploy→monitor flow.

CI/CD stages met:

- Build: Triggered automatically on git push to selected branches. Vercel runs `npm ci` and `npm run build`.
- Test: Build validation and TypeScript checks run during the build; if you add `vitest`/`playwright` tests you can run them in a CI job or a custom GitHub Action.
- Deploy: Successful builds are deployed to Vercel; each successful deployment creates a new immutable version.
- Monitor: Vercel exposes runtime logs and deployment history.

Why this satisfies the assignment: The required build → test → deploy → monitor lifecycle is automated by linking GitHub to Vercel.

Optional GitHub Actions (if you prefer to run checks before Vercel build):

```yaml
name: CI

on:
	push:
		branches: [ "main" ]

jobs:
	build:
		runs-on: ubuntu-latest
		steps:
		- uses: actions/checkout@v3
		- uses: actions/setup-node@v3
			with:
				node-version: 22
		- run: npm ci
		- run: npm run build
```

You can extend this action to run `npm test` or `npx playwright test` for E2E checks.

---

## Part 3 — Security & Scalability 

### Security Measures 

- HTTPS: Vercel enforces HTTPS by default for all deployments.
- Environment variables: Store secrets only in Vercel's Environment Variables page or local `.env` for development. Never push secrets to Git.
- OAuth security: Use secure redirect URIs; handle tokens server-side; keep client_secret in server-only environment variables.
- CORS: Restrict and validate origins in server routes where applicable.
- Serverless isolation: Each server route runs isolated in Vercel functions, improving process isolation.

Developer best practices to follow:

- Do not commit `.env` or secrets to the repo. Add `.env` to `.gitignore`.
- Use short-lived tokens where possible.
- Validate and sanitize inputs on server routes.

### Scalability Measures

Vercel provides horizontal autoscaling, serverless concurrency, global CDN, and zero-downtime deployments. SvelteKit offers SSR and static optimization, allowing the app to scale naturally under load.

Key features that help scale:

- Global edge CDN for static assets
- Serverless functions auto-scale
- Edge caching for frequently-accessed content
- Zero-downtime atomic deployments

### Cloud Provider Security & Scalability (5 pts)

Using Vercel you get:

- TLS/SSL certificates
- DDoS protections and managed infra
- Region-aware serverless infrastructure
- Improved cold-starts and edge caching optimizations

---

## Bonus — GenAI Services (GitHub Copilot)

GitHub Copilot was used as a developer assistant during this project and counts for the GenAI bonus requirement.

How Copilot helped:

- Generated boilerplate SvelteKit server routes and component scaffolding
- Suggested TypeScript fixes and improved code completions
- Assisted in scaffolding the OAuth flow and Drizzle ORM queries
- Helped clean up error handling and logging patterns

Example wording you can include in the assignment report:

"GitHub Copilot was used throughout development to accelerate API route creation, reduce syntax errors, auto-generate boilerplate SvelteKit logic, and assist in writing deployment configuration code. This qualifies as a GenAI DevOps accelerator as described in the assignment." 

---

## Required Screenshots 

1. Vercel: Project Deployment <img width="1710" height="957" alt="image" src="https://github.com/user-attachments/assets/1b500827-ec92-422c-a77a-ab695e43ec33" />

2. Vercel: Build logs showing a successful build <img width="1407" height="721" alt="image" src="https://github.com/user-attachments/assets/f05a9517-1178-4b89-a982-44d85a4965f2" />

3. Vercel: Deployment Summary <img width="1484" height="481" alt="image" src="https://github.com/user-attachments/assets/4bfd8f48-e9e7-4172-ae49-ae8653c10285" />

4. Application in action (Login page and Dashboard)  

https://github.com/user-attachments/assets/4afb0c2f-c4b4-4316-85c1-1a225f40948f


5. Project Listing:
   <img width="616" height="377" alt="image" src="https://github.com/user-attachments/assets/4d4073c7-83a4-4b63-a759-ecb71e6956fd" />

6. Vercel: Environment Variables page
    <img width="979" height="461" alt="image" src="https://github.com/user-attachments/assets/f74c53ef-71c7-47eb-921d-5fcd638932f1" />


## How to Run Locally

Clone and run the project locally for development and testing:

```bash
git clone https://github.com/samhithadwarakanath/CloudHosted-Dashboard.git
cd CloudHosted-Dashboard
npm ci
```

Create a `.env` file in the project root with the required variables (use placeholders locally — do not commit this file):

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback/google
DATABASE_URL=your-database-url (if used)
SESSION_SECRET=some-long-random-string
```

Then run the dev server:

```bash
npm run dev
```

Open http://localhost:5173 to view the app.

## Notes & Verification

- Do NOT commit secrets. Use Vercel project settings to store production secrets.
- Confirm builds locally with `npm run build` before pushing.
- To verify deployment, check the Vercel dashboard for the deployment status and function logs.

## Contact / Credits

Author: samhithadwarakanath

Built with: SvelteKit, Drizzle ORM, Vercel

---

