# 02 — Frontend

## Entry point and routing

- `index.html` mounts `<div id="root">` and loads `/src/main.tsx`.
- `src/main.tsx:5` calls `createRoot(...).render(<App />)`.
- `src/App.tsx` wraps the tree in `QueryClientProvider`, `TooltipProvider`, two toaster components, and `BrowserRouter`. Routes:
  - `/` → `Index` (`src/App.tsx:18`)
  - `*` → `NotFound` (`src/App.tsx:20`)

There is only one functional page (`/`); `NotFound` is a fallback.

## Key components

| File | Responsibility |
|---|---|
| `src/pages/Index.tsx` | Entire chat experience: URL parsing, access gate, message state, streaming SSE consumer, render loop, header, input. 318 lines — flagged for refactor. |
| `src/pages/NotFound.tsx` | Static 404 with link to `/`. |
| `src/components/NavLink.tsx` | `react-router-dom` NavLink wrapper that exposes `activeClassName` / `pendingClassName` props. Not currently used by `Index` or `NotFound`. |
| `src/components/ui/*` | shadcn/ui primitives (button, dialog, toast, etc.). Not used by the chat page; available for future screens. |
| `src/hooks/use-mobile.tsx`, `use-toast.ts` | Standard shadcn helpers. |
| `src/integrations/supabase/client.ts` | Supabase JS client initialised with the anon key. Currently **not imported** by `Index.tsx` — the chat calls the Edge Function via raw `fetch`. |

## URL parameter handling and access gate

All logic lives in `src/pages/Index.tsx`.

**Sanitisation helpers** (`src/pages/Index.tsx:33-42`):

```ts
const sanitizeParam = (value, maxLength = 100) =>
  value?.replace(/[^\w\s.,'&-]/g, "").trim().slice(0, maxLength) ?? "";

const sanitizeSlug = (value) =>
  value?.replace(/[^a-z0-9_-]/gi, "").slice(0, 50).toLowerCase() || "lotmanager";
```

**Parsing on mount** (`src/pages/Index.tsx:45-57`):

```ts
const params = new URLSearchParams(window.location.search);
const v = {
  name:    sanitizeParam(params.get("name")),
  dealer:  sanitizeParam(params.get("company") || params.get("dealer")),
  country: sanitizeParam(params.get("country")),
  variant: sanitizeParam(params.get("variant"), 20),
};
setVisitor(v);
setProduct(sanitizeSlug(params.get("product"))); // defaults to "lotmanager"
setHasAccess(Boolean(v.dealer || v.variant || v.name));
setAccessChecked(true);
```

**Recognised query params**: `name`, `company` (alias `dealer`), `country`, `variant`, `product`.

**Access gate logic** (`src/pages/Index.tsx:178-203`):

- If `accessChecked` is false → render `null` (prevents flash).
- If `hasAccess` is false → render the "Invalid access — This chat requires a valid invitation link." screen.
- Otherwise → render the chat.

`hasAccess` is granted when **any** of `dealer`, `variant`, or `name` is non-empty after sanitisation. Country alone is not sufficient.

## State management

Plain React `useState` + `useRef`. No Redux/Zustand. `@tanstack/react-query` is initialised in `App.tsx:9` but not consumed.

State held in `Index.tsx`:

| State | Purpose |
|---|---|
| `messages: Message[]` | Visible chat transcript (does **not** include the hidden initial message). |
| `input: string` | Composer value. |
| `isStreaming: boolean` | Disables the composer while a reply is in flight. |
| `showTyping: boolean` | Three-dot typing indicator until the first delta arrives. |
| `sessionId` | `crypto.randomUUID()` generated once per page load (`Index.tsx:23`). Ephemeral — never persisted. |
| `visitor`, `product` | Parsed URL params. |
| `accessChecked`, `hasAccess` | Gate flags. |
| `hasSentInitial` (ref) | Guards the auto-send effect from firing twice in StrictMode. |

The hidden initial message is constructed at `src/pages/Index.tsx:145-153` and posted to the API via `sendToAPI([hiddenMessages])` without ever being added to `messages`, so it is not rendered.

## Styling

- **Tailwind config**: `tailwind.config.ts`. Uses `darkMode: ["class"]` and content globs covering `src/**/*.{ts,tsx}`. Colors are bound to CSS variables on `hsl(var(--token))`.
- **Theme tokens**: `src/index.css:6-44`. All colors are HSL. Notable:
  - `--background: 0 0% 8%` (≈ `#141414`)
  - `--foreground: 0 0% 94%` (≈ `#f0f0f0`)
  - `--primary: 149 88% 58%` (the lime green `#36F085`) — also `--ring`
  - `--card: 0 0% 12%` (≈ `#1e1e1e`)
  - `--border: 0 0% 16%` (≈ `#2a2a2a`)
  - `--radius: 0.75rem`
- **Brand colors actually in use**:
  - **LotManager lime** `#36F085` — chat bubbles, header logotype, send button, input focus border. Hardcoded as inline style strings in `Index.tsx` rather than via Tailwind tokens (e.g. `Index.tsx:213, 248, 269, 297, 305`).
  - **GENERA8 gold** `#F5A623` — favicon only (`public/favicon.svg`). Not referenced in components.
  - **Dark surface** `#141414` / `#1A1A1A` — page and input backgrounds, hardcoded inline.
- Body font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` (`src/index.css:85`).
- Typing indicator animation: `@keyframes bounce-dot` and `.typing-dot` selectors (`src/index.css:89-103`).

⚠️ The chat page bypasses the design tokens (it inline-styles hex codes). A refactor pass would replace these with `bg-primary`, `text-foreground`, etc.

## Personalization rendering

Below the header, a headline only renders when a `dealer` is present (`src/pages/Index.tsx:222-231`):

```tsx
{visitor.dealer && (
  <div className="px-5 py-5 shrink-0">
    <h1 className="text-xl font-semibold" style={{ color: "#f0f0f0" }}>
      Hi {visitor.dealer} — let's talk LotManager
    </h1>
    <p className="mt-1 text-sm" style={{ color: "#888" }}>
      Ask me anything — I'll answer honestly and we can book a demo if it makes sense.
    </p>
  </div>
)}
```

The hidden first user message includes `name` and `dealer` when available (see `Index.tsx:145-153`), so the assistant can greet the visitor by name even though only the dealer name is shown in the UI headline.
