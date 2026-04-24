alter table conversations
  add column if not exists lang text default 'en'
  check (lang in ('en', 'es'));

create index if not exists idx_conversations_lang on conversations(lang);