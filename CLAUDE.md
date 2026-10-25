# Notes for Claude

- The default branch is `master`. Deploy with `npm run deploy` (builds and
  publishes `build/` to the `gh-pages` branch).
- Supabase settings (`REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`)
  are **not** in git: `.env` is git-ignored and must never be committed.
  In cloud sessions they come from the environment's variables, which the
  build reads like `.env`. Before building or deploying, check they are set
  (`printenv | grep -c REACT_APP_SUPABASE_` should print 2). If they are
  missing, stop and ask the owner to add them in the cloud environment
  settings; never ask for the keys in chat and never deploy without them,
  or the live site loses its admin screen and Supabase content.
- Never put the Supabase secret / `service_role` key anywhere in the repo.
