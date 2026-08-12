# Making /sponsor coherent with the homepage

**Date:** 2026-08-11
**Status:** Approved, ready to implement

## Problem

`/sponsor` and `/` are built on two different design systems. They share the
brand palette and nothing else: different navigation paradigm, different
eyebrow typography, different section rhythm, different component vocabulary.
A visitor arriving from the homepage's "Become a Partner" CTA lands somewhere
that does not look like the same site.

One divergence is an outright bug. `.lang-rail` is `display: none !important`
below 1024px (global.css), and the drawer that carries the mobile EN/FR pills
lives inside `VerticalNav.astro`. `/sponsor` renders neither the drawer nor
any other switcher, so **French is unreachable on phones** on the one page
that asks visitors for money.

### Inventory of divergences

| Aspect | Homepage `/` | Sponsor `/sponsor` |
|---|---|---|
| Navigation | `VerticalNav`: right rail (desktop) + hamburger + full-screen drawer | `sponsor/TopBar`: wordmark, scroll progress, CTA. No section nav, no drawer |
| Mobile language | drawer pills | none (bug) |
| Section eyebrow | `text-gold font-display italic text-lg mb-3` | `font-mono text-xs tracking-[0.25em] uppercase text-gold` |
| Heading scale | `text-3xl md:text-4xl`, `md:text-5xl` on major beats | `text-3xl md:text-5xl` everywhere |
| Section padding | `py-20 md:py-28 px-6` | `py-24 md:py-32 px-6 md:px-16` |
| Container | `max-w-5xl` / `max-w-6xl` / `max-w-3xl` | `max-w-4xl` throughout |
| Between sections | `<hr class="section-divider">` | nothing |
| Hero | centered, full-bleed photo at 25%, dot grid, stat trio, steam cue | split 55/45, hard photo panel, "Begin reading" underline |
| Vocabulary | rounded cards, gold icon circles, hover lift | bare tables, plain lists, no icons |

## Decisions

Three forks were settled before design:

1. **Reference is the live `/`**, not the untracked `/homepage2` redesign.
   Aligning against shipped code is safe whatever happens to homepage2.
2. **Hero keeps its split-screen structure**, restyled. `/sponsor` should read
   as the same brand in a different room, not as a homepage clone.
3. **`Story.astro` keeps its condensed mini-timeline**, re-dressed in homepage
   vocabulary. Importing `Team.astro` and `Timeline.astro` wholesale would
   bury the pitch under full bios.

   *Superseded during implementation:* the hero became a three-chef triptych
   (see below), which made Story's chef filmstrip a duplicate — the same three
   faces, names and roles a single scroll apart. The filmstrip was removed and
   its credential lines moved onto the hero captions. Story now runs pull
   quote → timeline → editor's note.

## Design

### 1. Navigation shell

Delete `src/components/sponsor/TopBar.astro`. `/sponsor` renders the same
`<VerticalNav>` as the homepage, with links:

```
Story (#story) · Investment (#ledger) · Terms (#terms) · Partner (#inquiry) · Home (/)
```

This restores the mobile language switcher, because the drawer ships inside
`VerticalNav`. It also removes the hand-rolled `.lang-rail` markup currently
inlined in `sponsor.astro` and the `.lang-rail--topbar` modifier in
global.css, since the language chip returns to its standard top-left slot.

`Layout.astro` already wires the drawer toggle, scroll-spy (`section[id]` →
`.nav-link`), scroll-to-top and language switching for any page that renders
`VerticalNav`. No layout changes are needed.

Two TopBar responsibilities are rehomed:

- **Persistent CTA** becomes the `Partner` rail item pointing at `#inquiry`,
  mirroring how the homepage rail points at `/sponsor`.
- **Scroll progress** survives as a bare 2px gold hairline fixed to the top
  edge, with no bar chrome around it — a reading cue appropriate to a
  long-form dossier that costs nothing visually. New component:
  `src/components/sponsor/ReadingProgress.astro`.

### 2. Section grammar

Sponsor sections adopt the homepage primitives verbatim:

- Eyebrow: `text-gold font-display italic text-lg mb-3`
- Heading: `text-3xl md:text-4xl font-bold font-display`, reserving
  `md:text-5xl` for the Ledger — the same major/minor beat split the homepage
  uses between `About`/`Team` and `Opportunity`/`Timeline`
- Padding: `py-20 md:py-28 px-6`
- Container: `max-w-5xl` (Story, Terms), `max-w-6xl` (Ledger)
- `<hr class="section-divider">` closing each section

The existing cream/ink alternation (Story cream, Ledger ink, Terms cream,
Inquiry olive, Footer ink) already matches the homepage's cadence and stays.

### 3. Per-component changes

**`sponsor/Hero.astro`** — mono eyebrow becomes the italic gold display
eyebrow. The lone "Begin reading" underline link is replaced by the homepage's
dual-CTA pair: gold `Partner With Us` → `#inquiry`, gold-outline
`Read the case` → `#story`. Drops `pt-14`, which only existed to clear the
fixed TopBar.

*Revised during implementation.* The split hero was rebuilt twice:

1. The original `hero-chef.jpg` is a candid snapshot — the chef looking down
   at a deli container under flat light. Replaced with the commissioned
   portrait already in the repo.
2. Then replaced again with a three-panel brigade triptych: text block on
   top, the three chefs running edge to edge across the bottom, separated by
   gold hairlines and bleeding off the fold. Captions carry role, name and
   credentials over a bottom fade.

   The three source photographs were shot in different rooms — two warm
   panelled interiors, one bright marble kitchen — and will not sit together
   ungraded. What unifies them is a sepia pass plus saturation on all three, a
   heavier hand on Kevin's high-key frame, and a shared radial vignette that
   gives all three one apparent light source. Brigade height is
   `clamp(12rem, 33svh, 20rem)`, tuned so the whole hero including captions
   lands at exactly 100svh.

**`sponsor/Story.astro`** — eyebrows and type scale realigned; chef filmstrip
removed as a duplicate of the hero. The mini-timeline's future markers adopt
the hollow-vs-solid-gold logic the Comeback spine uses on the homepage, so
"dormant versus live" reads identically in both places. The editor's note
already matches (`border-l-2 border-gold/40`) and is untouched.

**`sponsor/Ledger.astro`** — stays a table, but stops hand-rolling one.
global.css already ships `.comparison-table` as the site's table primitive,
with the gold mono header and row hover the homepage uses; the ad-hoc utility
classes are replaced by it, wrapped in a `border border-gold/15 rounded-lg`
panel. Keeps `.table-scroll` for narrow screens.

**`sponsor/Terms.astro`** — the stacked budget bar is unchanged. The four
legend blocks become homepage cards
(`border border-gold/15 bg-cream/95 rounded-lg p-5`) carrying their colour
dot. Numbered commitments keep their form.

**`InquiryForm.astro`, `Footer.astro`** — already shared with the homepage.
Untouched.

### 4. Kept deliberately different

Split hero, table-over-cards for the tier ledger, condensed chef strip. These
are the page doing its own job, not drift.

## Out of scope

`Terms.astro:55` ships a live placeholder in public-facing copy:
`[Incorporated entity name / registration number — TBD]`. It is a content
problem, not a style one, and needs real text from the team.

## Verification

- `/sponsor` at 320px, 768px and 1440px: no horizontal overflow, hero clears
  the fold, rail appears at ≥1024px and hamburger below it.
- EN/FR toggle reachable and functional on mobile via the drawer.
- Scroll-spy highlights the correct rail item per section.
- Both pages side by side: eyebrows, headings, section spacing and dividers
  read as one system.
