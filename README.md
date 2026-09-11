# Orange and Tabby cat

Your thoughts. Their territory.

A cozy, cat-themed personal notes app built as a hands-on full-stack learning project. Keep your thoughts in one place, supervised by two mischievous cats.

[Open the app](https://orange-and-tabby-cat-notes-app.vercel.app/)

![Orange and Tabby cat artwork](public/cats/cover.png)

## Features

- Email/password signup, email confirmation, sign-in, and logout.
- Forgot-password email and password update flow.
- Create, read, edit, and delete personal notes.
- Case-insensitive search by title, with newest notes first.
- Owner-only database access through Supabase Row Level Security (RLS).
- Form validation, pending buttons, success/error messages, and empty states.
- Responsive English interface with custom cat artwork.
- Date-only display in the `America/New_York` timezone (Boston).
- App manifest, home-screen icons, favicon, and social-sharing artwork.

## Tech stack

| Layer | Technology |
| --- | --- |
| Application | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth and `@supabase/ssr` |
| Hosting | Vercel |

## Run locally

Use Node.js compatible with the pinned Next.js version and npm. Exact dependency versions are recorded in `package-lock.json`.

### 1. Install dependencies

```bash
git clone https://github.com/techinob-ctrl/notes-app.git
cd notes-app
npm ci
```

### 2. Add environment variables

Create `.env.local` alongside `package.json`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Get the project URL and publishable key from your own Supabase project. `NEXT_PUBLIC_SITE_URL` is the base URL used to construct signup and password-reset email redirects.

These `NEXT_PUBLIC_` values are public configuration. Never put a Supabase secret key, `service_role` key, database password, or SMTP password in them. RLS must protect the database even when someone knows the publishable key.

`.env.local` is ignored by Git. Do not commit credentials. Restart the development server after changing environment variables.

### 3. Configure Supabase and start the app

Complete the database and authentication setup below first. Cloning this repository does not create the hosted database or its policies.

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000). On Windows, if PowerShell blocks npm wrappers, use `npm.cmd` and `npx.cmd` instead.

## Database setup

Create `public.notes` in a new Supabase project with this schema. This describes what the app expects; it is not an exported migration from the live database.

| Column | Type | Required | Default / relationship |
| --- | --- | --- | --- |
| `id` | `uuid` | Yes | Primary key, `gen_random_uuid()` |
| `title` | `text` | Yes | No default |
| `content` | `text` | Yes | Empty string: `''` |
| `created_at` | `timestamptz` | Yes | `now()` |
| `updated_at` | `timestamptz` | Yes | `now()` |
| `user_id` | `uuid` | Yes | Foreign key to `auth.users.id` |

Use `NO ACTION` for foreign-key updates and deletes if following this setup. Deleting a user who still owns notes will be blocked until those notes are handled explicitly.

The create action supplies `user_id` from the authenticated user. The update action sets `updated_at`; a `now()` default alone does not automatically refresh it when a row changes.

Server Actions require a non-blank title of at most 100 characters and content of at most 5,000 characters. These length checks are application validation, not database check constraints in this schema.

### Owner-only RLS policies

Enable RLS on `public.notes`. Make the table accessible through the Data API and grant the `authenticated` role the necessary SELECT, INSERT, UPDATE, and DELETE table privileges. Table privileges and RLS policies are separate requirements.

Create these permissive policies, targeting `authenticated`:

| Command | USING | WITH CHECK |
| --- | --- | --- |
| SELECT | `(select auth.uid()) = user_id` | Not applicable |
| INSERT | Not applicable | `(select auth.uid()) = user_id` |
| UPDATE | `(select auth.uid()) = user_id` | `(select auth.uid()) = user_id` |
| DELETE | `(select auth.uid()) = user_id` | Not applicable |

`auth.uid()` identifies the signed-in user. UPDATE checks both the existing row and the resulting row's ownership.

Do not leave an old public-read policy such as `USING (true)` alongside these policies. Permissive policies can combine to allow broader access. The home-page query relies on RLS to return only the current user's notes.

## Authentication setup

Enable the Email provider, new user signup, and email confirmation in Supabase Authentication.

For local development, use `http://localhost:3000` as the Site URL. For deployment, change it to your production origin. Allow these Redirect URLs:

```text
http://localhost:3000/**
https://YOUR_PRODUCTION_DOMAIN/auth/confirm
https://YOUR_PRODUCTION_DOMAIN/auth/reset-password
```

Replace `YOUR_PRODUCTION_DOMAIN` with your own domain. This project's deployed domain is `orange-and-tabby-cat-notes-app.vercel.app`.

The implementation uses Supabase's default confirmation links and exchanges the returned `code` for a session:

- `/auth/confirm` exchanges the signup code and redirects to the notes page.
- `/auth/reset-password` exchanges the recovery code and redirects to `/reset-password`.
- `/auth/reset-password/error` explains a failed exchange and offers a new reset request.

Open email links in the same browser and browser profile used to request them. The PKCE flow needs the locally stored verifier. A used link cannot simply be reused on another device; request a fresh link when needed. On a phone, `localhost` means the phone, not your development computer.

### Email delivery limitation

Supabase's default email service is for limited testing and only sends to pre-authorized project team addresses. Configure custom SMTP before offering email signup or recovery to general users. A successful deployment does not remove email-delivery restrictions. See the [Supabase SMTP documentation](https://supabase.com/docs/guides/auth/auth-smtp).

## Project structure

```text
app/
  page.tsx                  # Protected notes list and title search
  actions.ts                # Create, update, and delete Server Actions
  layout.tsx                # Shared layout and metadata
  loading.tsx               # Loading UI
  manifest.ts               # Home-screen metadata
  login/                    # Login page and login/logout actions
  signup/                   # Signup page and action
  forgot-password/          # Reset-email request
  reset-password/           # New-password form and action
  auth/confirm/             # Signup confirmation callback
  auth/reset-password/      # Recovery callback and error page
  notes/[id]/edit/           # Owner's edit-note page
components/                 # Shared forms, cards, buttons, and cover
lib/supabase/               # Server client and session-refresh helpers
types/note.ts               # Shape of displayed note data
public/cats/                # Artwork and home-screen icons
proxy.ts                    # Session-refresh request entry point
```

Server Components load data. Server Actions validate input and perform mutations. Client Components handle interactive form feedback. The Supabase SSR client carries sessions through cookies, while the proxy handles refresh. Database RLS enforces ownership independently of the visible UI.

## Checks

```bash
npx tsc --noEmit
npm run lint
npm run build
```

After building, run `npm start` to serve the production build locally.

The build uses `next/font/google` for Geist fonts and needs network access to fetch them. A restricted-network font-download failure is different from an application-code error.

### Manual QA checklist

- Sign up, confirm the email, and sign in.
- Log out and confirm the notes page requires authentication.
- Create, edit, search for, and delete a note.
- Check blank titles, text limits, empty search results, and long text on mobile.
- Use two accounts: each should only see its own notes.
- Open another account's edit URL; it should return a not-found page.
- Request a password reset while logged out and open a fresh link in the same browser profile.
- Update the password and log out: the new password should work and the old one should fail.
- Repeat authentication and notes checks on the production domain after deployment.

These are manual checks, not an automated test suite or a complete security audit.

## Deploy to Vercel

1. Import your GitHub repository and select the Next.js preset.
2. Use the directory containing this `package.json` as the project root.
3. Add the three environment variables above. Set `NEXT_PUBLIC_SITE_URL` to your production HTTPS origin, not localhost.
4. Choose Config for these public variables if Vercel asks for a variable type.
5. Configure the Supabase Site URL and exact production redirect URLs described above.
6. Deploy, then run the production QA checklist.

Environment-variable changes require a new deployment. Git does not upload `.env.local` to Vercel. Preview deployments need deliberate environment and redirect configuration too; production authentication URLs do not automatically test a preview build.

## Scope and next improvements

This is a learning project with a deployed notes workflow, not a claim of production hardening.

- Configure custom SMTP and review abuse protection before opening registration broadly.
- Add automated tests and versioned database migrations; neither is currently included.
- Add pagination for larger collections; the current notes page has no pagination controls.
- Home-screen metadata is included, but there is no service worker or offline notes support.
- The password-update action validates the current user session; it is not restricted to recovery-only sessions.

## Learning outcomes

App Router organization, Server and Client Components, Server Actions, TypeScript form state, Supabase CRUD, cookie-based sessions, PKCE email callbacks, owner-only RLS, environment configuration, responsive styling, and deployment QA.

## Artwork

The orange-cat and tabby-cat illustrations were AI-generated for this app. See [artwork notes](public/cats/ASSETS.md) for prompts and asset details.
