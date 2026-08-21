# LinkedIn Profile Research

Use the installed LinkedIn CLI for authenticated profile research.

Executable:

```
/home/ask/linkedin-rs
```

The CLI uses the session stored at:

```
/home/ask/.config/linkedin-cli/session.json
```

Never read, print, expose, or include cookies/session credentials in output.

## Fetch a profile

Accept either a full LinkedIn profile URL or vanity slug:

```bash
/home/ask/linkedin-rs profile view "$PROFILE_URL" --json
```

Example:

```bash
/home/ask/linkedin-rs profile view \
  "https://www.linkedin.com/in/john-doe-123/" \
  --json
```

Use the JSON response to extract relevant facts such as:

- Name
- Headline
- Location
- About section
- Current and previous positions
- Education
- Public identifier
- Profile URN

Do not use `profile visit`; that command registers a visible profile view.

## Fetch latest profile posts

Fetch the profile's latest authored posts:

```bash
/home/ask/linkedin-rs profile posts "$PROFILE_URL" \
  --count "$POST_COUNT" \
  --json
```

Example:

```bash
/home/ask/linkedin-rs profile posts \
  "https://www.linkedin.com/in/john-doe-123/" \
  --count 10 \
  --json
```

The command follows LinkedIn pagination until it collects the requested number of posts or no more posts are available. JSON output contains the full available post objects, including hydrated referenced entities where available.

Use recent posts to identify:

- Topics the person discusses
- Current projects or priorities
- Opinions and professional interests
- Recent company or role changes
- Potential personalized outreach hooks

## Operational rules

- Prefer `--json` for machine-readable output.
- Quote profile URLs in shell commands.
- Use a small post count, normally 5 to 10.
- Treat an empty post array as "no accessible posts," not necessarily "the profile has never posted."
- If the CLI reports an authentication error, stop and report that the LinkedIn session needs renewal.
- Do not retry aggressively. LinkedIn may restrict automated access.
- Never run posting, commenting, messaging, invitation, reaction, or profile-visit commands without explicit user approval.
