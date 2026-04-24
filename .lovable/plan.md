# Spanish Language Support — Implementation Plan

## Pre-flight finding

The `conversations` table already has a `language` column (text, default 'en') — but **no `lang` column**. The spec is explicit that the edge function (deployed separately) writes to `lang`, so the migration is required as specified. The existing `language` column will be left untouched (additive, zero risk).

⚠️ If after deployment we see edge function INSERT errors, the column name in the edge function may need to be reconciled with the existing `language` column. Flagging for awareness.

---

## 1. Database migration

```sql
alter table conversations
  add column if not exists lang text default 'en'
  check (lang in ('en', 'es'));

create index if not exists idx_conversations_lang on conversations(lang);
```

Idempotent, additive, no rollback needed.

---

## 2. Frontend changes — `src/pages/Index.tsx` (only file touched)

### 2a. Extend `VisitorInfo` interface (line ~10)
Add `lang: "en" | "es"` field.

### 2b. URL param parsing in the existing `useEffect` (line ~46)
Add a `sanitizeLang` helper (whitelist: only "es" accepted, everything else → "en") and parse `params.get("lang")` into the visitor object.

### 2c. Set `document.documentElement.lang` (one-liner inside the same useEffect)
```ts
document.documentElement.lang = v.lang;
```

### 2d. Payload forwarding
No code change needed in `sendToAPI` — `lang` is part of the `visitor` object and is already spread into the request body via `visitor`. ✅

### Skipped (per spec)
- Page title / meta description: no centralized title management exists in the React tree (no react-helmet, no document.title hook). Skipping per "only if trivial" instruction.
- No `index.html` changes.
- No i18n libraries.
- No UI string translations.
- No language toggle.

---

## 3. Verification (manual, after deploy)

1. `?company=Test+Motors&variant=1&name=Carlos&lang=es` → Spanish opening (usted register), software pitch
2. `?company=Test+Motors&variant=web1&name=Carlos&lang=es` → Spanish, turnkey pitch
3. `?company=Test+Motors&variant=1&name=Carlos` (no lang) → English, software pitch (regression)
4. DevTools Elements → `<html lang="es">` on Spanish URLs, `<html lang="en">` on English URL
5. Network tab → POST to `/chat` → request body contains `visitor.lang: "es"`
6. SQL: `select lang, count(*) from conversations group by lang;` → returns rows with `es` for new Spanish conversations

---

## Files touched
- 1 migration (new)
- `src/pages/Index.tsx` (4 small edits)

Total: 1 DB change + 1 frontend file. No other files in scope.