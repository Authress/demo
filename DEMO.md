# Demo

## Pre-Demo: Brand Customization

Before the demo, update the app's branding to match the customer's brand. The user will provide a URL (website or brand page) — fetch it, extract brand colors, logo, and company name, then update the config files below.

### What to update

All branding is centralized into three locations:

1. **Company identity** — [demo-config.ts](src/demo-config.ts)
   - Company name (used in page title, headings, alt text)
   - Company website URL (used in logo link)

2. **Color palette** — [colors.scss](src/assets/styles/colors.scss)
   - `$primary` — main brand color (buttons, accents, highlights)
   - `$secondary` — secondary color (navbar background, logo background)
   - `$dark` — darkest background color (page body)
   - `$highlight` — links and interactive highlights
   - Supporting neutrals: `$gray`, `$border`, `$embossed`, `$horizon`
   - All other files (style.scss, navbar.vue, component styles) reference these variables — no other files need color changes.
   - **Accessibility tip:** If the brand's primary color is light or low-contrast, add `$min-contrast-ratio: 2;` (or higher) before the Bootstrap variable imports to force readable text on colored buttons.

3. **Logo SVG** — replace the single logo file:
   - [src/assets/logo.svg](src/assets/logo.svg) — the single logo source (used by home page and navbar as `<img>`)
   - The favicon ([src/public/logo.svg](src/public/logo.svg)) always stays as the Authress logo — do not touch it.

### Steps
1. User provides customer URL
2. Fetch the URL, extract brand colors, logo URLs, and company name
3. Update `demo-config.ts` with company name and website
4. Update `colors.scss` with the new color palette
5. Replace `src/assets/logo.svg` with the customer's logo

## Runtime Demo

Each step below corresponds to a `[DEMO]` comment in the code. When the user asks for the step (they may paraphrase), make the specified code change.

**IMPORTANT:** After completing each step, always ask the user to validate before moving on to anything else.

**IMPORTANT:** Do not assume imports already exist. After making a code change, verify that all necessary imports are present in the file. Add any missing imports.

### Step 1: Add the authorization middleware
**Trigger:** User says something like "only allow logged in users" or "block unauthenticated users" or "add the authorization middleware" or "add token validation" or "protect the API"
**File:** [server/src/utilities/server.ts](server/src/utilities/server.ts)
**Action:** Between the `2. [DEMO] Authorization Middleware` comment markers, add:
```ts
app.use(authress);
```
`authress` is already imported from `./authressTokenValidation`.

### Step 2: Add the Authress route guard
**Trigger:** User says something like "add the route guard" or "protect the route" or "add authentication to the route"
**File:** [router.ts](src/router.ts)
**Action:** In the `/reports/:reportId?` route's `beforeEnter`, replace the `next();` call with:
```ts
await ensureUserIsLoggedIn(next);
```
This function is already imported from `./authressClient`. It handles navigation itself, so the bare `next()` call should be removed.

### Step 3: Add authorization check for reports
**Trigger:** User says something like "add authorization" or "check permissions" or "add the access check for reports"
**File:** [server/src/reports/reportsController.ts](server/src/reports/reportsController.ts)
**Action:** Between the `3. [DEMO] Add Authorization Check (reports:get)` comment markers, add:
```ts
const hasAccess = await authress.hasAccessToResource(userId, 'reports/*', 'reports:get');
if (!hasAccess) {
  return forbidden(response);
}
```
`authress` and `forbidden` are already imported.

### Step 4: Replace authorization check with resource-level filtering
**Pre-step:** Before making any code changes, ask the user: "Did you already restrict the user to only having access to specific reports?"
**Trigger:** User says something like "filter by user resources" or "use getUserResources" or "show only the reports the user has access to" or "only get reports the user has access to"
**File:** [server/src/reports/reportsController.ts](server/src/reports/reportsController.ts)
**Action:** Replace the Step 3 `hasAccessToResource` check with:
```ts
allowedReports = await authress.getUserResources(userId, 'reports/*', 'reports:get');
```
This populates the `allowedReports` variable (already declared above) so that `resourceRepository.getAll(allowedReports)` filters to only the reports the user has access to. Remove the `hasAccessToResource` / `forbidden` block.
