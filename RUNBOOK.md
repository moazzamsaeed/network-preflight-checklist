# Databricks Network Pre-flight Checklist — Runbook

Operational reference for the developer / SA maintaining this project.
Keep this file current when commands, URLs, or architecture change.

---

## 1. Quick reference

| What | Where |
|---|---|
| Live site | https://moazzamsaeed.github.io/network-preflight-checklist/ |
| Source repo | https://github.com/moazzamsaeed/network-preflight-checklist |
| Local working tree | `/Users/moazzam.saeed/Documents/projects/network-preflight-checklist` |
| Default branch | `main` |
| Deploy branch | `gh-pages` (force-pushed by the deploy script) |
| Pages source | Branch `gh-pages` / path `/` |
| Dev server port | 5179 |
| GitHub Pages base path | `/network-preflight-checklist/` |
| Sister project (framework source) | https://github.com/moazzamsaeed/lakeflow-connect-preflight-checklist |

---

## 2. Stack

- **React 18 + Vite 5**, single-file app (`src/App.jsx`)
- **No backend, no auth, no analytics.** All state lives in the browser tab.
- **jsPDF** (dynamic-imported) for client-side PDF generation
- **DM Sans + JetBrains Mono** via Google Fonts CDN
- **GitHub Pages** static hosting; deploy is a local `npm run deploy` script

Framework was lifted from the **Lakeflow Connect Pre-flight Checklist**
sister project. The two share styles.css, the Vite config approach, and
the deploy story; this project replaces LFC's prescriptive-checklist
domain layer with a diagnostic-intake schema.

---

## 3. Local development

```sh
cd /Users/moazzam.saeed/Documents/projects/network-preflight-checklist
npm install        # one-time, or after package.json changes
npm run dev        # vite dev server on http://localhost:5179/network-preflight-checklist/
```

Local URL must include the `/network-preflight-checklist/` prefix (the
Vite `base` config matches production).

```sh
npm run build      # production build into dist/
npm run preview    # serve dist/ locally to sanity-check the build
```

### Stopping a stuck dev server

```sh
lsof -nP -iTCP:5179 -sTCP:LISTEN
kill <pid>
```

---

## 4. Deploying to GitHub Pages

Prereq: the GitHub repo `moazzamsaeed/network-preflight-checklist` must
exist with `origin` pointing at it, and Pages must be configured to
serve from the `gh-pages` branch (the deploy script creates that branch).

One command to publish:

```sh
npm run deploy
```

What that runs (see `scripts/deploy.sh`):

1. `npm run build` → produces `dist/`
2. `touch dist/.nojekyll`
3. Init a fresh git tree inside `dist/`, commit, force-push to `origin gh-pages`
4. Remove the temporary `.git` from `dist/`
5. Pages auto-rebuilds in ~30s

### One-time repo + Pages setup

```sh
gh repo create moazzamsaeed/network-preflight-checklist --public --source=. --remote=origin
git push -u origin main
# After first npm run deploy, set Pages source:
gh api -X PUT /repos/moazzamsaeed/network-preflight-checklist/pages \
  -F build_type=legacy -F 'source[branch]=gh-pages' -F 'source[path]=/'
```

### Force a Pages rebuild

```sh
gh api -X POST /repos/moazzamsaeed/network-preflight-checklist/pages/builds
```

### Why we don't use the GitHub Actions workflow

Same reason as LFC: `npm install` historically hung 8+ minutes on the
runner. The workflow at `.github/workflows/deploy.yml` is kept for
future re-enablement.

---

## 5. Repository layout

```
.
├── RUNBOOK.md              ← this file
├── index.html              vite entry → /src/main.jsx
├── vite.config.js          base path + react plugin + alias stubs
├── package.json            npm scripts incl. `deploy`
├── scripts/
│   └── deploy.sh           build + force-push to gh-pages
├── src/
│   ├── main.jsx            React 18 root
│   ├── App.jsx             ENTIRE app — schema, rule engine, exports
│   ├── styles.css          all CSS (lifted from LFC + additions)
│   └── empty.js            no-op stub aliased to html2canvas / dompurify
└── .github/workflows/
    └── deploy.yml          CI variant of the deploy (bypassed)
```

`src/App.jsx` is intentionally monolithic — section banners
(`/* ───────── ... ───────── */`) split it into discrete regions.

---

## 6. Architecture overview

### Three-step state machine

| `state.step` | Screen | What it does |
|---|---|---|
| 0 | `<CloudPicker />` | Pick AWS / Azure / GCP. Sets `state.cloud`. |
| 1 | `<IntakeForm />`  | Scroll form with sidebar nav. Captures `state.sections[...]`. |
| 2 | `<ResultsPage />` | Renders `analyze()` findings + intake snapshot + exports. |

`state` shape:

```js
{
  cloud: "aws" | "azure" | "gcp" | null,
  step: 0 | 1 | 2,
  sections: {
    context:      { customer, workspaceName, workspaceUrl, region, engineer },
    workspace:    { deploymentModel, vnetName, ..., privateConnectivity, ... },
    firewall:     { firewallPresence, udrRules: [...], nsgRules, ... },
    dns:          { provider, customDnsServers, forwarders: [...], ... },
    serverless:   { serverlessInUse, workloads: [...], nccPresent, ... },
    connectivity: { clusterToControlPlane, clusterToLibs, ... }, // tristates
    symptoms:     { whatBroken, reproducibility, errorMessage, ... },
  }
}
```

### Schema-driven sections

`INTAKE_SECTIONS` is a single declarative array. Each entry:

```js
{ id, label, icon, description, fields: [
  { id, label, type, options?, columns?, cloudOnly?, showIf?, help?, placeholder? }
] }
```

Field types implemented in `<FieldRow>`:

- `radio`     — single choice, options: `[{id,label,cloudOnly?}]`
- `checkbox`  — multi choice; state is array of option ids
- `select`    — single choice dropdown
- `text`      — single-line input
- `textarea`  — multi-line input
- `list`      — repeatable rows; `columns: [{id,label,placeholder?}]`
- `tristate`  — one of `working` / `broken` / `unknown` / `na`

Visibility:

- `cloudOnly: ["azure"]` — only renders for that cloud
- `showIf: (sectionState, fullState) => boolean` — dynamic gating

### `analyze(state)` rule engine

Pure function. Flat array `ANALYZE_RULES`. Each rule is
`(state) => finding | null` where finding =
`{ severity: "blocker" | "high" | "medium" | "info", title, detail, docsUrl? }`.

Results page sorts findings by severity. v0.1 ships with 20 seed rules
covering NPIP / PE / DNS forwarders / forced tunneling / TLS inspection /
HTTP proxy / library egress / NTP / CMK / workspace storage firewall /
AWS VPC DNS flags / DHCP option set / NCC PE rules / federation
PrivateLink / region-mismatched service tags.

Helper accessors used inside rules:

```js
const get = (s, sec, f) => s.sections?.[sec]?.[f];
const arr = (v) => Array.isArray(v) ? v : [];
const includes = (s, sec, f, val) => arr(get(s, sec, f)).includes(val);
```

### Exports

- `buildMarkdown(state, findings)` — header (customer / workspace /
  cloud / generated), `## Detected issues`, per-section captured values
  (skipping invisible fields), `## Open questions`.
- `buildPdf({ jsPDF, state, findings })` — flowing layout via
  `doc.text()` / `doc.rect()`; severity pills; section blocks; open
  questions. Real binary PDF.

Filenames slug-cased from workspace name / customer name; fallback
`network-preflight-intake.{md,pdf}`.

### Reset behavior

Clicking the brand title runs `reset()` → `INITIAL_STATE`. Hard wipe;
returns to the cloud picker.

---

## 7. How to: add a new field

Find the section in `INTAKE_SECTIONS` and push another field object:

```js
{
  id: "myField",                  // becomes state.sections.<section>.myField
  label: "My new field",
  type: "radio",                  // or text/textarea/checkbox/select/list/tristate
  options: [
    { id: "yes", label: "Yes" },
    { id: "no",  label: "No"  },
  ],
  cloudOnly: ["azure"],           // optional
  showIf: (s) => s.someOther === "yes",   // optional
  help: "Short hint shown below the input",
  placeholder: "for text/textarea",
}
```

Markdown and PDF exports pick it up automatically. If you want a finding
when this field has a particular value, add a rule (next section).

---

## 8. How to: add an `analyze()` rule

Push a function to `ANALYZE_RULES`:

```js
(s) => {
  if (s.cloud !== "azure") return null;
  if (get(s, "workspace", "publicAccess") !== "enabled") return null;
  if (get(s, "workspace", "privateConnectivity") !== "both") return null;
  return {
    severity: "info",
    title: "Public access enabled but full PE configured",
    detail: "Public access could be safely disabled; PE covers both UI and control plane.",
    docsUrl: "https://learn.microsoft.com/azure/databricks/...",
  };
}
```

Rule body should be pure and defensive (use `?.` / `arr()` helpers).
Exceptions are caught at the call site so a buggy rule won't blank the
results page.

---

## 9. Seed rule index

| # | Trigger summary | Severity |
|---|---|---|
| 1 | Azure NPIP on + no backend PE | blocker |
| 2 | Custom DNS + PE in use + no privatelink forwarder | blocker |
| 3 | Public access off + no frontend PE + no on-prem connectivity | high |
| 4 | Serverless + LF Federation + on-prem source + no NCC | high |
| 5 | Serverless + private destination + no NCC PE rules | high |
| 6 | Forced tunneling + no documented Databricks allow-list | high |
| 7 | DNS forwarders flagged as generic, not workspace-specific | info |
| 8 | Root storage firewall on + no PE | blocker |
| 9 | CMK in use + key store reachability unclear | blocker |
| 10 | AWS PrivateLink + VPC DNS flags off | blocker |
| 11 | AWS custom DHCP option set + no R53 Resolver inbound IPs | high |
| 12 | TLS inspection in path | high |
| 13 | HTTPS proxy without Databricks bypass | high |
| 14 | Cluster → libs marked broken | high |
| 15 | NTP egress broken (or unknown under forced tunnel) | info |
| 16 | Intermittent symptom + multiple custom DNS servers | info |
| 17 | Azure NSG service tag region ≠ workspace region | high |
| 18 | Cluster won't start + root storage FW + SCC | blocker |
| 19 | LF Fed → Snowflake without Snowflake PrivateLink | high |
| 20 | Azure Private Resolver outbound without workspace zone rule | high |

---

## 10. Troubleshooting

### Site shows old build after `npm run deploy`

Pages CDN caches HTML for ~10 min. Force-refresh, or compare bundle
hashes:

```sh
curl -sL https://moazzamsaeed.github.io/network-preflight-checklist/ \
  | grep -oE 'assets/index-[A-Za-z0-9_-]+\.js'
ls dist/assets/ | grep '^index-.*\.js$'
```

### Pre-push hook flags "AWS access token" inside a vendor JS bundle

Same as LFC. The repo already aliases `html2canvas` + `dompurify` to a
stub in `vite.config.js`. If a new vendor library trips gitleaks, alias
it the same way or add a `.gitleaksignore` entry — do not bypass with
`--no-verify`.

### `npm install` hangs

```sh
npm install --no-audit --no-fund --no-progress \
  --fetch-retries 3 --fetch-timeout 120000
```

### PDF download produces an empty / corrupted file

jsPDF is dynamic-imported (~245 KB chunk). If offline and uncached, the
import will throw silently. Open DevTools → Network and re-click; look
for a 404 on `jspdf.es.min-*.js`.

### Generated report has values missing for fields the customer answered

Likely a `showIf` gate is hiding the field on the results page. Check
the field's `showIf` predicate against the captured state. Hidden
fields are intentionally excluded from exports.

---

## 11. Useful commands

```sh
# Confirm git remote + branches
git remote -v
git branch -a

# View last deploy
git log --oneline gh-pages | head -5

# Inspect live Pages config
gh api /repos/moazzamsaeed/network-preflight-checklist/pages | jq

# Re-trigger Pages build manually
gh api -X POST /repos/moazzamsaeed/network-preflight-checklist/pages/builds
```

---

## 12. Known gaps (backlog from taxonomy)

These items appear in the project plan's taxonomy but are NOT in v0.1.
Each is intentionally deferred; the schema is structured so they can be
added by appending to `INTAKE_SECTIONS` / `ANALYZE_RULES`.

- Multi-workspace in same VNet/VPC, workspace-to-workspace flows
- NAT GW SNAT port exhaustion
- BGP / Cloud Router specifics (GCP)
- DNS TTL issues, DNSSEC, round-robin / multi-AZ behavior
- NCC for cross-cloud (Snowflake PL, S3, ADLS) — captured implicitly in
  Section D but no specific rule yet
- Workspace → SCIM IdP (provisioning)
- Workspace audit log pattern parsing
- JSON export (intentional defer per design Q&A)
- `localStorage` persistence of intake across reloads
- Preset scenarios dropdown ("hub-and-spoke Azure with on-prem firewall
  and Azure Private Resolver")
- Per-region Databricks control-plane CIDR allow-list reference (would
  enable a stronger version of rule 6 and 17)
- Cross-link / shared rules with LFC preflight checklist

Add real customer cases here as they surface — the most valuable rules
are the ones that catch real recurring issues.
