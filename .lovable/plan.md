

## Fix: Chat not picking up URL personalization

### Root cause
The SMS links use `?company=...` but the client reads `?dealer=...`. Result: `visitor.dealer` is always empty, the personalized headline never renders, and the hidden initial prompt to the Edge Function omits the dealer name. The `variant` param IS already being read and forwarded correctly — the variant-based prompt switching on the server works as long as we keep passing it.

### Changes — `src/pages/Index.tsx` only

1. **Accept `company` as the dealer param** (with `dealer` as a fallback for backward compat):
   ```ts
   dealer: sanitizeParam(params.get("company") || params.get("dealer")),
   ```

2. **Loosen the dealer/name sanitizer** so multi-word company names survive. Current regex `[^\w\s.,'-]` actually keeps spaces, BUT `URLSearchParams.get` already decodes `+` → space, so "Premium Cars Nairobi" should pass. Verify by adding `&` to the whitelist for names like "Smith & Co". New regex: `[^\w\s.,'&-]`.

3. **Generalize the initial hidden prompt** so it doesn't hard-code "email" (SMS visitors arrive via `web*` variants):
   ```ts
   const channel = visitor.variant.toLowerCase().startsWith("web") ? "SMS" : "email";
   let initialContent = `Hi, I clicked through from the ${channel} about LotManager.`;
   if (visitor.name && visitor.dealer)
     initialContent = `Hi, I'm ${visitor.name} from ${visitor.dealer}. I clicked through from the ${channel} about LotManager.`;
   else if (visitor.dealer)
     initialContent = `Hi, I'm from ${visitor.dealer}. I clicked through from the ${channel} about LotManager.`;
   else if (visitor.name)
     initialContent = `Hi, I'm ${visitor.name}. I clicked through from the ${channel} about LotManager.`;
   ```
   This gives the Edge Function the dealer name + channel context on turn one, so the AI's first reply is personalized ("Hey! I see you're from Premium Cars Nairobi…").

4. **Headline already renders when `visitor.dealer` is set** — no change needed beyond fix #1. It will now show "Hi Premium Cars Nairobi — let's talk LotManager".

5. **`visitor` object is already sent on every API call** via `sendToAPI` body (line 76-82) — no change needed.

### Out of scope
- No Edge Function changes. The server already receives `visitor` and switches prompts on `variant` containing `"web"`.
- No new visible "system" bubble in the UI. Personalization happens via (a) the headline and (b) the AI's first streamed reply, which is the existing pattern. Adding a fake system bubble would duplicate what the AI already says.

### Test plan (after deploy)
- `https://chat.getlotmanager.com/?company=Test+Motors&variant=web1` → headline reads "Hi Test Motors — let's talk LotManager"; AI opens with a turnkey/7-day pitch mentioning Test Motors.
- `https://chat.getlotmanager.com/?company=Elite+Auto&variant=1` → headline reads "Hi Elite Auto — let's talk LotManager"; AI opens with the software/dev-team pitch mentioning Elite Auto.
- `https://chat.getlotmanager.com/` (no params) → generic greeting, no headline, software prompt (default).

