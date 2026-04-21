# 07 — Environment Variables

Values are deliberately omitted. Names only.

## Frontend (Vite, `import.meta.env.*`)

Found in `.env`. Vite exposes only `VITE_`-prefixed vars to the browser bundle.

| Name | Used in | Purpose | Required? |
|---|---|---|---|
| `VITE_SUPABASE_URL` | `.env:3` (declared); not currently read in source — the URL is hardcoded in `src/integrations/supabase/client.ts:5` and `src/pages/Index.tsx:3`. | Supabase project URL for browser calls. | No (currently — but should be) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env:2` (declared); not currently read in source — hardcoded in `src/integrations/supabase/client.ts:6` and `src/pages/Index.tsx:4`. | Anon JWT for Supabase REST/Edge calls from the browser. | No (currently — but should be) |
| `VITE_SUPABASE_PROJECT_ID` | `.env:1` (declared); not referenced in source. | Convenience identifier. | No |

## Edge Function / server-side (Supabase secrets)

Configured in the Supabase dashboard. Source code that consumes these is **not in the repo**; presence is confirmed via the Lovable Cloud secrets list.

| Name | Used in | Purpose | Required? |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Edge Function `chat` (assumed) | Auth for Anthropic Messages API. | Yes |
| `CAL_API_KEY` | Edge Function (assumed) | Auth for Cal.com bookings API. | Yes (for demo booking) |
| `BREVO_API_KEY` | Edge Function (assumed) | Auth for Brevo transactional email. | ⚠️ TO CONFIRM |
| `LOVABLE_API_KEY` | Unknown — no code reference found. | ⚠️ TO CONFIRM | ⚠️ |
| `SUPABASE_URL` | Auto-injected into Edge Functions. | Self-reference for `createClient`. | Yes |
| `SUPABASE_ANON_KEY` | Auto-injected. | — | Available |
| `SUPABASE_PUBLISHABLE_KEY` | Auto-injected. | — | Available |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Function (assumed) | Bypasses RLS for DB writes. | Yes |
| `SUPABASE_DB_URL` | Auto-injected. | Direct Postgres connection string. | Available |

⚠️ The required/optional column for Edge Function vars is marked from inferred usage — re-verify once `supabase/functions/chat/index.ts` is committed.
