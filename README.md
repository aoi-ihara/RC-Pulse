# RC-Pulse

## Overview

RC Pulse is the　web app which shows school　homeworks, belongings and schedules.

## Tech Stack

- Next.js
- Supabase
- Cloudflare Turnstile
- Argon2
- JSON Web Tokens (JWT)

## How to Deploy

1. Clone the repository:

```bash
git clone https://github.com/aoi-ihara/RC-Pulse.git
```

2. Navigate to the project directory:

```bash
cd RC-Pulse
```

3. Install Next.js:

```bash
npm install
```

4. Generate the JWT secret key:

```bash
openssl rand -base64 32
```

5. Get hashed password:

```bash
npm install argon2
node -e "require('argon2').hash('YOUR_PASSWORD').then(console.log)"
```

5. Create table in Supabase:

```sql
create table rc_pulse (
  id uuid not null default gen_random_uuid(),
  sent_at timestamp with time zone not null default (now() at time zone 'jst'::text),
  body text not null,
  heading text,

  constraint rc_pulse_pkey primary key (id)
);
```

6. Set environment variables:

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0xYOUR_SITE_KEY
TURNSTILE_SECRET_KEY=0xYOUR_SECRET_KEY

NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_URL.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_sd_YOUR_SERVICE_ROLE_KEY

JWT_SECRET=YOUR_GENERATED_JWT_SECRET_KEY
RC_PULSE_HASHED_PASSWORD="\$argon2id\$v=19\$m=65536,t=3,p=4\$YOUR_HASHED_PASSWORD"
```

Replace `$` with `\$` in the hashed password.

7. Start the development server:

```bash
npm run dev
```
