# Revert Mexico i18n changes (frontend only)

Scope: a single file, `src/pages/Index.tsx`. The Supabase `conversations.lang` column and its index stay in place.

## Edits to `src/pages/Index.tsx`

1. **`VisitorInfo` interface (lines 11-17)** — remove `lang: "en" | "es";`. Restore to four fields:
   ```ts
   interface VisitorInfo {
     name: string;
     dealer: string;
     country: string;
     variant: string;
   }
   ```

2. **Initial `visitor` state (line 25)** — remove `lang: "en"`:
   ```ts
   const [visitor, setVisitor] = useState<VisitorInfo>({ name: "", dealer: "", country: "", variant: "" });
   ```

3. **`sanitizeLang` helper (lines 46-48)** — delete the function entirely.

4. **URL-parsing `useEffect` (lines 51-64)** — remove the `lang` field from the `v` object and remove the `document.documentElement.lang = v.lang;` line. Result:
   ```ts
   useEffect(() => {
     const params = new URLSearchParams(window.location.search);
     const v: VisitorInfo = {
       name: sanitizeParam(params.get("name")),
       dealer: sanitizeParam(params.get("company") || params.get("dealer")),
       country: sanitizeParam(params.get("country")),
       variant: sanitizeParam(params.get("variant"), 20),
     };
     setVisitor(v);
     setProduct(sanitizeSlug(params.get("product")));
     setHasAccess(Boolean(v.dealer || v.variant || v.name));
     setAccessChecked(true);
   }, []);
   ```

No other lines in the file reference `lang` (verified against the file in context). The `visitor` object passed to the edge function automatically drops `lang` once it's removed from state — no change needed at the fetch call site.

## What is NOT touched

- Supabase migration `20260424222410_*.sql` (adds `lang` column + index) — kept.
- `src/integrations/supabase/types.ts` — generated from DB schema; since the column stays, this file should stay as-is.
- `index.html`, edge functions, `package.json`, every other file — untouched.

## Verification after apply

- `rg "lang" src/pages/Index.tsx` returns no matches.
- `VisitorInfo` has exactly 4 fields.
- Preview loads, chat works as before.
- DB query `select column_name from information_schema.columns where table_name='conversations' and column_name='lang'` still returns one row.