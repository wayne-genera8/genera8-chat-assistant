# 06 — Security

## URL parameter access gate

The chat refuses to render unless the visitor arrives with at least one identifying URL parameter.

**Code reference**: `src/pages/Index.tsx:55`

```ts
setHasAccess(Boolean(v.dealer || v.variant || v.name));
```

**Render guard**: `src/pages/Index.tsx:176-203`

```tsx
if (!accessChecked) return null;
if (!hasAccess) {
  return ( /* "Invalid access — This chat requires a valid invitation link." */ );
}
```

**What this protects against**: casual drive-by visitors landing on the bare URL. It is **not** a security control:

- All four params are URL-readable and trivially guessable (e.g. `?name=test`).
- The Edge Function (which costs money per call to Anthropic) is **not** behind the same gate — anyone with the public Supabase URL and anon key can call it directly.
- Sanitisation (`Index.tsx:33-42`) limits length and strips control chars, but the gate accepts any non-empty string.

## RLS policies summary

Defined in `supabase/migrations/20260415204830_*.sql:10-23` and tightened in `supabase/migrations/20260415214011_*.sql`.

Every table in `public` (`bookings`, `conversations`, `messages`, `notification_log`, `products`) has exactly one policy:

```sql
CREATE POLICY "Service role full access" ON public.<table>
  FOR ALL TO service_role USING (true) WITH CHECK (true);
```

Effect: only requests authenticated as `service_role` (i.e. the Edge Function) can read or write. Anon/browser requests get nothing — confirmed by the fact that the second migration explicitly drops the prior `"Anon can read active products"` policy.

## CORS on Edge Functions

⚠️ **Not auditable** — the `supabase/functions/chat/` source is not in the repo. CORS must be configured server-side because the browser calls cross-origin (`chat.getlotmanager.com` → `*.supabase.co`) and the requests succeed in production.

## Secrets management

- Server-side secrets live in Supabase Edge Function config (visible in the Supabase dashboard under Functions → Secrets):
  - `ANTHROPIC_API_KEY`
  - `CAL_API_KEY`
  - `BREVO_API_KEY`
  - `LOVABLE_API_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_DB_URL`
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_PUBLISHABLE_KEY` (auto-injected)
- Client-side `.env` only contains publishable values (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`). These are designed to be public.

## 🚨 Hardcoded secrets in code

The Supabase **publishable / anon** JWT is hardcoded in two places:

1. `src/pages/Index.tsx:4`
   ```ts
   const API_KEY = "eyJhbGciOiJIUzI1NiIs...";
   ```
2. `src/integrations/supabase/client.ts:6`
   ```ts
   const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIs...";
   ```

**Risk assessment**: The anon/publishable key is **designed to be public** — it grants only the access permitted by RLS, which here is "nothing" for anon. Hardcoding it is conventionally acceptable. However:

- ⚠️ It is duplicated rather than read from `import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY`. If the project key is ever rotated, two files must be updated.
- ⚠️ `Index.tsx` should import from `src/integrations/supabase/client.ts` instead of duplicating the constant.

No service-role keys, Anthropic keys, or other private secrets were found hardcoded in the repo.

## Known gaps

| Gap | Impact | Where to fix |
|---|---|---|
| No app-level rate limit on the Edge Function | Anyone can spam Anthropic via the public function URL → cost & abuse risk. | Edge Function (not in repo). |
| URL gate is presentation-only | Doesn't prevent direct API abuse. | Edge Function should validate `visitor.variant` against a known set, or require a signed token. |
| Anon key duplicated | Maintenance/rotation risk. | `src/pages/Index.tsx:4` should import from `client.ts`. |
| Edge Function source not version-controlled | No code review, no rollback, no audit trail. | Add `supabase/functions/chat/index.ts` to the repo. |
| No retention policy on `messages` | Conversations accumulate indefinitely. | DB cron or scheduled function. |
| No auth on `/` route | Anyone with a guessed `?name=anything` URL gets in. | Acceptable by design? — confirm with product. |
| `<noscript>` in `<head>` | None present, but worth re-checking after future tracking-pixel additions. | `index.html`. |
