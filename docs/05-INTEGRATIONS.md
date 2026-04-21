# 05 — Integrations

External services referenced from code or configured as Supabase secrets.

## Anthropic (Claude)

- **Purpose**: Generates assistant replies to visitor chat messages.
- **How it's called**: Indirectly — the browser does **not** call Anthropic. It POSTs to the Supabase Edge Function `chat` (`src/pages/Index.tsx:73`), which proxies a streaming Messages API request to Anthropic. The Edge Function source is not in repo, but the streaming event names parsed by the client (`content_block_delta` with `delta.text`, `src/pages/Index.tsx:107`) are Anthropic Messages API events.
- **Endpoint** (inferred): `POST https://api.anthropic.com/v1/messages` with `stream: true`.
- **Auth**: server-side only, via secret `ANTHROPIC_API_KEY`.
- **Model**: ⚠️ Not visible in this repo.
- **Rate limits**: Anthropic account limits apply. ⚠️ No app-level rate limiting in repo.
- **Failure mode**: Edge Function returns non-2xx or breaks the stream → client catches and renders: *"Sorry, I'm having a connection issue. Please refresh and try again."* (`src/pages/Index.tsx:128`).

## Cal.com

- **Purpose**: Books demo calls when the conversation reaches that point.
- **How it's called**: ⚠️ Not visible in this repo. Inferred from:
  - Secret `CAL_API_KEY` configured.
  - `products.cal_event_type` (text) — likely the Cal.com event type slug.
  - `bookings.cal_event_id` (text), `bookings.scheduled_at`, `bookings.duration_minutes` (default 20).
  - `conversations.demo_cal_event_id`, `conversations.demo_booked_at`.
- **Endpoint** (typical): `POST https://api.cal.com/v1/bookings` (or v2). Not confirmable from repo.
- **Auth**: `CAL_API_KEY` (server-side).
- **Failure mode**: ⚠️ Not in repo. From the user's POV, a booking failure would surface as an in-chat assistant message (the LLM is informed by the function's tool-call result, presumably).

## Brevo (transactional email)

- **Purpose**: Likely sending booking confirmations / follow-ups, given the `notification_log` table and `bookings.followup_sent`, `bookings.reminder_sent` flags.
- **How it's called**: ⚠️ Not visible in this repo.
- **Auth**: `BREVO_API_KEY` (server-side).
- **Endpoint** (typical): `POST https://api.brevo.com/v3/smtp/email`. Not confirmable from repo.
- **Failure mode**: A row is written to `notification_log` with `status` and `error_message` — visible only to operators reading the DB.

## Supabase (platform)

- **Purpose**: Hosts the Edge Function, Postgres database, and provides anon/service-role auth.
- **How it's called**:
  - Browser → Edge Function `chat` via raw `fetch` with the anon JWT in `apikey` and `Authorization: Bearer …` headers (`src/pages/Index.tsx:75-79`).
  - `@supabase/supabase-js` client is initialised in `src/integrations/supabase/client.ts:11` but **not used** by the chat page.
- **Auth**:
  - Browser uses `SUPABASE_PUBLISHABLE_KEY` (anon, safe to ship — see `06-SECURITY.md`).
  - Edge Function uses `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS.
- **Endpoint**: `https://mpbgzczhgwiplojqsaiy.supabase.co` (`src/pages/Index.tsx:3`, `src/integrations/supabase/client.ts:5`).

## Lovable hosting

- **Purpose**: Hosts the static SPA build. Custom domain configured.
- **URLs**: `https://chat.getlotmanager.com` (production), `https://quick-sales-talk.lovable.app` (Lovable subdomain), preview URL per branch.
- **Auth**: none — public SPA.

## Summary table

| Service | Credential env var | Caller | In-repo source? |
|---|---|---|---|
| Anthropic | `ANTHROPIC_API_KEY` | Edge Function `chat` | ❌ |
| Cal.com | `CAL_API_KEY` | Edge Function (assumed) | ❌ |
| Brevo | `BREVO_API_KEY` | Edge Function (assumed) | ❌ |
| Supabase DB | `SUPABASE_SERVICE_ROLE_KEY` | Edge Function | ❌ (function source) |
| Supabase (browser) | `VITE_SUPABASE_PUBLISHABLE_KEY` | `src/integrations/supabase/client.ts:6` and `src/pages/Index.tsx:4` | ✅ |
| Lovable AI Gateway | `LOVABLE_API_KEY` | ⚠️ Unknown — secret exists but no code reference | ❌ |
