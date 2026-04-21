# Architecture Documentation

Last updated: 2026-04-21

> Regenerate when architecture changes significantly.

This folder documents the LotManager Chat Assistant — a personalized chat front-end for the GENERA8 sales funnel.

## Index

- [01-ARCHITECTURE.md](./01-ARCHITECTURE.md) — High-level overview, user flows, tech stack, system diagram.
- [02-FRONTEND.md](./02-FRONTEND.md) — React/Vite app: routing, components, URL access gate, styling.
- [03-BACKEND.md](./03-BACKEND.md) — Supabase Edge Function `chat` and Anthropic streaming flow.
- [04-DATA-MODEL.md](./04-DATA-MODEL.md) — Postgres tables, ERD, RLS policies, what gets logged.
- [05-INTEGRATIONS.md](./05-INTEGRATIONS.md) — External services: Anthropic, Cal.com, Brevo.
- [06-SECURITY.md](./06-SECURITY.md) — Access gate, RLS, CORS, secrets, hardcoded-key flags.
- [07-ENV-VARS.md](./07-ENV-VARS.md) — Every env var referenced in code.
- [08-GLOSSARY.md](./08-GLOSSARY.md) — Variant codes, pitch types, brand terms.
- [99-TODOS.md](./99-TODOS.md) — TODO/FIXME/HACK comments scanned from the codebase.

## Conventions

- Every technical claim cites a file path (e.g. `src/pages/Index.tsx:42`).
- ⚠️ **TO CONFIRM** marks claims that could not be verified from the repo alone.
- Mermaid diagrams render in GitHub and Lovable.
