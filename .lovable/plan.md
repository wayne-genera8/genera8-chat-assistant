## Mexico i18n — feat/mexico-i18n branch

### Pre-flight findings

Inspecting the current branch state, most of the work from the spec is already in place:

- ✅ Migration `20260424222410_*.sql` already exists with the `lang` column + index (idempotent, no-op to re-apply).
- ✅ `conversations.lang` column is live in the DB (`text`, default `'en'`, check constraint `('en','es')`).
- ✅ `VisitorInfo` interface already has `lang: "en" | "es"`.
- ✅ Initial `visitor` state already includes `lang: "en"`.
- ✅ `sanitizeLang` helper already defined and used in URL parsing useEffect.
- ✅ `document.documentElement.lang = v.lang` already set.
- ✅ `visitor` (including `lang`) is already forwarded in the request body.

**Only Step 4 remains**: route to `chat-v2` for Spanish traffic.

### The single change

In `src/pages/Index.tsx`, the `sendToAPI` function uses a hardcoded module-level constant:

```ts
const API_ENDPOINT = "https://mpbgzczhgwiplojqsaiy.supabase.co/functions/v1/chat";
```

Replace this with a base + dynamic endpoint chosen per call inside `sendToAPI`:

```ts
const API_BASE = "https://mpbgzczhgwiplojqsaiy.supabase.co/functions/v1";
```

Then inside `sendToAPI`, before the `fetch`:

```ts
const chatEndpoint = visitor.lang === "es" ? "chat-v2" : "chat";
const response = await fetch(`${API_BASE}/${chatEndpoint}`, { ... });
```

That's it. The existing `visitor` dependency is already in `sendToAPI`'s `useCallback` deps, so routing updates correctly when URL params resolve.

### Safety properties

- Default path (no `?lang=`) → `lang === "en"` → hits `/chat` (unchanged production endpoint). South African campaigns are unaffected.
- `?lang=es` → hits `/chat-v2`.
- `?lang=fr`, `?lang=ES ` (after lowercase + trim still equals `"es"` — actually routes to v2; spec verification #5 confirms `ES` → v2 is desired), `?lang=` → all fall back to `en` → `/chat`.
- If `chat-v2` isn't deployed yet, only Spanish URLs will fail. Intended.

### Files touched

- `src/pages/Index.tsx` — replace `API_ENDPOINT` constant with `API_BASE`, add `chatEndpoint` selection inside `sendToAPI`, update the `fetch` URL.

### Not touched

- No edge function code (Wayne deploys `chat-v2` separately).
- No new migration (already applied).
- No i18n libraries, no UI strings, no language toggle, no `index.html` changes.

### Verification (post-deploy, manual)

The 6 checks from the spec — Network tab POST URL ends in `/chat-v2` for `?lang=es` (incl. `ES`), `/chat` for everything else including no param and `?lang=fr`; `<html lang>` reflects the same; SQL check on the `lang` column.
