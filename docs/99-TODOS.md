# 99 — TODOs / FIXMEs / HACKs

Scan of `TODO|FIXME|HACK|XXX` across the repo (excluding `node_modules`, `.git`, `supabase/migrations`, lockfiles).

Only meaningful, in-source comments are listed. Lockfile and `@types/node` checksum noise (which contains the literal string "xxx" inside SHA hashes) is excluded.

## In-source comments

### `index.html:6`

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<!-- TODO: Set the document title to the name of your application -->
<title>GENERA8 Chat Assistant</title>
```

The title is already set to "GENERA8 Chat Assistant" — TODO appears stale and can be removed.

### `index.html:12`

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@Lovable" />
<!-- TODO: Update og:title to match your application name -->
```

`og:title` is in fact set on `index.html:21` to "GENERA8 Chat Assistant". TODO is stale. Note `twitter:site` is still `@Lovable` — likely should change to a GENERA8 handle.

### `README.md:1-3`

```markdown
# Welcome to your Lovable project

TODO: Document your project here
```

Default Lovable scaffold README. Now superseded by `docs/`.

## Implicit follow-ups (not flagged with TODO but worth tracking)

These come from the architecture review, not from comment scans. Track separately:

- `src/pages/Index.tsx` is 318 lines and inline-styles brand hex codes — refactor into smaller components and route colors through Tailwind tokens.
- `src/pages/Index.tsx:4` duplicates the Supabase publishable key already exported from `src/integrations/supabase/client.ts:6` — collapse to a single import.
- `supabase/functions/chat/index.ts` is referenced but not present in the repo — commit it for review/audit.
- `package.json` is named `"vite_react_shadcn_ts"` — rename to a project-specific name.
- `src/components/NavLink.tsx` is unused — delete or actually adopt for the (currently nonexistent) navigation.
