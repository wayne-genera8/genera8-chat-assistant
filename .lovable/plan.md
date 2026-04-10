

## AI Chat Landing Page for Genera8's Sales Funnel

A single-page chat application where prospects land from email CTAs and immediately start chatting with an AI sales agent.

### What will be built

**Single-page chat UI** with:
- Fixed header with ⚡ LotManager branding
- Conditional headline section based on `dealer` URL param
- Scrollable messages area with styled bubbles (assistant: dark card, user: lime green)
- Animated typing indicator (3 bouncing dots)
- Fixed bottom input bar with send button
- Dark theme (#141414 background, #36F085 accent)
- Mobile-first, max-width 600px, fully responsive

**On page load:**
- Generate session UUID, read URL params (name, dealer, country, variant, product)
- Auto-send contextual intro message (hidden from UI) to trigger agent greeting
- Show typing indicator until first response arrives

**API integration:**
- POST to Supabase edge function with SSE streaming
- Parse `content_block_delta` events to stream assistant responses in real-time
- Full message history sent with each request
- Input disabled during streaming, auto-focus after response

**Error handling:**
- Connection failures show friendly error message as assistant bubble
- Graceful SSE parsing with non-JSON line skipping

### Files to create/modify
- `src/pages/Index.tsx` — Complete chat application (single component)
- `src/index.css` — Update CSS variables for dark theme + typing indicator animation

