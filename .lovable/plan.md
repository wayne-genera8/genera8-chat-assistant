## Localize chat header strings

Update only the two visible header strings in `src/pages/Index.tsx` to match `visitor.lang`. No new files, deps, or other string changes.

### Change

In the headline block (currently lines ~217–225, rendered when `visitor.dealer` is truthy), compute the strings based on `visitor.lang`:

```tsx
{visitor.dealer && (
  <div className="px-5 py-5 shrink-0">
    <h1 className="text-xl font-semibold" style={{ color: "#f0f0f0" }}>
      {visitor.lang === "es"
        ? `Hola ${visitor.dealer} — hablemos sobre LotManager`
        : `Hi ${visitor.dealer} — let's talk LotManager`}
    </h1>
    <p className="mt-1 text-sm" style={{ color: "#888" }}>
      {visitor.lang === "es"
        ? "Pregúnteme lo que quiera — le respondo con honestidad y, si tiene sentido, agendamos una demo."
        : "Ask me anything — I'll answer honestly and we can book a demo if it makes sense."}
    </p>
  </div>
)}
```

### Out of scope

- Access-gate page strings ("Invalid access", etc.)
- Input placeholder, Send button, error toast string
- Any other component or file
- i18n libraries / language switcher UI

### Verification (manual in preview)

1. `?company=Test+Motors&variant=1&name=Carlos&lang=es` → Spanish header + subtitle
2. `?company=Test+Motors&variant=1&name=Carlos` → English (regression)
3. `?...&lang=ES` (uppercase) → Spanish (sanitizer already lowercases)
