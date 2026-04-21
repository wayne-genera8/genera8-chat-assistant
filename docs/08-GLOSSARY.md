# 08 — Glossary

Project-specific terms. Where a term comes from user-supplied context rather than the codebase, it is marked ⚠️.

## Variant codes

The `variant` URL parameter (parsed at `src/pages/Index.tsx:51`, sanitised to ≤20 chars) drives both client behaviour and (presumably) the server-side system prompt.

| Code | Meaning (per product context) | Code-confirmed effect |
|---|---|---|
| `web1` | ⚠️ SMS step 1 | Channel word becomes "SMS" in the hidden initial message (`Index.tsx:145`). |
| `web2` | ⚠️ SMS step 2 | Same — any variant starting with `web` → "SMS". |
| `web3` | ⚠️ SMS step 3 | Same. |
| `1` | ⚠️ Email step 1 | Channel word becomes "email" (`Index.tsx:145`). |
| `2` | ⚠️ Email step 2 | Same. |
| `3` | ⚠️ Email step 3 | Same. |

The frontend does **not** distinguish between step 1/2/3 within a channel. Step-level personalization, if any, must happen in the Edge Function based on the raw `variant` string forwarded in the request body (`Index.tsx:84`). The `conversations.variant` column persists this value (`src/integrations/supabase/types.ts:111`).

## Pitch types

⚠️ **Not in repo.** The user's product context describes:

- **Turnkey pitch** — used for SMS visitors (`variant=web1|web2|web3`). Sells LotManager as a managed service.
- **Software pitch** — used for email visitors (`variant=1|2|3`). Sells LotManager as a self-serve software product.

Selection logic must live in the un-versioned Edge Function. The `products.system_prompt` column is the only obvious storage for prompt templates.

## Brand terms

| Term | Meaning | Code reference |
|---|---|---|
| **GENERA8** | Parent company / brand. Spelled `Genera8` in the UI subtitle (`Index.tsx:191, 217`) and `<meta name="author">` (`index.html:9`). Brand gold `#F5A623` is used for the favicon (`public/favicon.svg`). |
| **LotManager** | The product being sold. Lime green `#36F085` is its accent color (`Index.tsx:213, 248, 269` and CSS token `--primary: 149 88% 58%` in `src/index.css:16`). Page title: "GENERA8 Chat Assistant" (`index.html:7`). |

Relationship: GENERA8 (parent) → LotManager (product). The chat header reads `⚡ LotManager — by Genera8` (`Index.tsx:212-218`).

## Other terms in the codebase

| Term | Where | Meaning |
|---|---|---|
| `dealer` / `company` | `Index.tsx:49` (URL params), `conversations.dealer_name`, `bookings.dealer_name` | The visitor's dealership name — `?dealer=` and `?company=` are aliases (company wins if both present). |
| `product` (slug) | `Index.tsx:54`, defaults to `"lotmanager"` | Slug that maps the conversation to a row in `products`. |
| `sessionId` | `Index.tsx:23` | Per-page-load UUID. Persisted as `conversations.session_id`. Not stored in localStorage. |
| `cal_event_type` | `products.cal_event_type` | The Cal.com event type slug used when booking a demo for this product. |
| `notification_channels` | `products.notification_channels` (jsonb) | Per-product config for email / Slack / WhatsApp notifications on new bookings. |
| `pain_summary` | `bookings.pain_summary` | Free-text summary of the prospect's pain point, captured during the chat. |
