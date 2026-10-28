---
name: motion-dashboard-design
description: Design and build animated web-app dashboards (admin, analytics, back-office) with a collapsible icon/label sidebar and Framer Motion hover effects; asks theme and style first.
---

# Motion Dashboard Design

Builds dashboard-style web apps: a sidebar that toggles between full labels and an icon-only rail, a sticky topbar, and KPI / chart / table content, with Motion (Framer Motion) animation on every interactive element, in the visual style the customer picks. Uses the **ui-ux-pro-max** skill for palettes, fonts and UX rules when it is installed; everything below also works without it.

All code in this skill was compiled and run (React 19, Motion 14, Tailwind 4, Recharts 3, Vite 8) and every style's text pairs were checked for 4.5:1 contrast.

## Workflow

1. **Style interview** - ask the customer before writing any code (section 1).
2. **Design system** - run ui-ux-pro-max if available, then lock the style recipe (section 2).
3. **Scaffold** the stack (section 3).
4. **Build the shell** - sidebar, topbar, main area - from the reference code (sections 4 and 7).
5. **Build the content** - page header, KPI row, charts, tables (section 6).
6. **Apply the hover system** to every element (section 5).
7. **Verify and deliver** with the checklist (section 8).

---

## 1. Style interview (always first)

Ask before building. Use `AskUserQuestion` when available (one call, up to 4 questions, the user can always type "Other"); otherwise ask the same questions as a short numbered list in plain text. Skip any question the request already answers. Never more than two rounds.

**Round 1**

| # | Header | Question | Options |
|---|--------|----------|---------|
| 1 | Theme | Light or dark interface? | Light · Dark · Both, with a toggle (Recommended) |
| 2 | Style | Which visual style family? | **Modern / Professional** - clean SaaS, soft shadows (also Minimal Swiss, Flat, Bento) · **Glass** - Glassmorphism, Aurora, frosted panes over colour · **Soft 3D** - Neumorphism, Claymorphism · **Tactile / Bold** - Skeuomorphism, Neubrutalism, Cyber / neon |
| 3 | Purpose | What will the dashboard mainly show? | Finance / banking · Analytics / SaaS admin · Operations / monitoring · CRM / back-office |
| 4 | Motion | How lively should the animation feel? | Subtle · Expressive (Recommended) · Playful |

**Round 2** (only what is still open)

| # | Header | Question | Options |
|---|--------|----------|---------|
| 5 | Exact style | Which one within the family? | The styles of the chosen family (e.g. Neumorphism · Claymorphism) |
| 6 | Accent | Brand colour? | Use our brand colours (ask for hex codes or logo) · Blue · Violet · Emerald / Teal |
| 7 | Stack | Where will this live? (skip if project files show it) | React + Vite + Tailwind (Recommended) · Next.js App Router · Existing project |
| 8 | Rearrange | Only if the request asks for movable cards and leaves the rules open: how should cards move? | Swap places · Reorder (others shift) · Free placement and resizing (then a follow-up on which cards may move, if unclear) |

**If nobody is there to answer** (scheduled or unattended run): Both themes with toggle, Modern / Professional, purpose inferred from the request, Expressive, brand-neutral blue, React + Vite + Tailwind. Write the assumptions at the top of your reply.

Save the answers as a **design brief** (`design-brief.md` in the project root) so later pages stay consistent:

```md
# Design brief
style: glass | theme: both (toggle) | purpose: finance | motion: expressive
accent: #4f46e5 | font: Inter | stack: react-vite-tailwind | sidebar default: expanded
```

### Style-fit guard

Honour the customer's choice, but when the database flags a risky combination, apply the adaptation below and tell the customer in **one sentence** what you adjusted.

| Choice | Risk (from ui-ux-pro-max) | Dashboard-safe adaptation |
|--------|---------------------------|---------------------------|
| Neumorphism | High a11y risk; "not for data-heavy dashboards" | Neumorphic chrome only (sidebar, cards, buttons, inputs); 1px hairline borders on all panels; data text ≥4.5:1; never neumorphic table rows |
| Claymorphism | "Not for finance, legal, data-critical" | Puffy shadows on cards and buttons only; bouncy springs on icons/buttons, never on numbers or rows; standard semantic colours for profit/loss |
| Skeuomorphism | "Not for modern enterprise" | Material (leather/metal) on sidebar and buttons; data panes stay smooth paper, no texture behind numbers |
| Glass / Aurora | Contrast depends on backdrop | Build it the iOS way (see "Glass done right" in section 6); never glass on glass; chart tooltips use `--surface-solid`; text checked against the brightest colour that can sit behind a pane |
| Cyber / neon | Neon text is hard to read | Glow only on hover / active; body text never neon |
| Neubrutalism + finance | Playful tone | Keep if asked; avoid red as the primary colour because red means loss |

---

## 2. Design system

**With ui-ux-pro-max installed**, resolve its folder and generate a system:

```bash
SKILL_DIR="$(dirname "$(dirname "$(find /mnt/skills ~/.claude/skills -path '*ui-ux-pro-max/scripts/search.py' 2>/dev/null | head -1)")")"
python3 "$SKILL_DIR/scripts/search.py" "<purpose> dashboard <style keyword>" --design-system \
  --density <6-8> --motion <3|6|8> --variance <3-8> -p "<Project>" -f markdown
```

- `--density`: 8 for analytics / operations (8-32px spacing), 6 for executive or finance overviews.
- `--motion`: Subtle 3, Expressive 6, Playful 8.
- `--variance`: 3 for Modern / Neumorphism, 5 for Glass / Clay / Skeuo, 8 for Neubrutalism.
- Take **palette, typography and anti-patterns** from the result. The **style is the customer's pick**: if the tool returns a different style, ignore that part. Its motion snippets are GSAP; translate the timing and easing into Motion.
- Supplementary searches: one per chart, `"<data shape>" --domain chart` (e.g. `"trend over time"`, `"part to whole"`); `--stack react` (or `nextjs`, `shadcn`).
- Read `$SKILL_DIR/references/quick-reference.md` sections 1, 2, 7, 9, 10 and the checklist in `$SKILL_DIR/references/pro-rules.md` before delivery.

**Brand colours win.** If the customer gave brand colours, or a brand design skill exists for them, its colours and fonts replace `--primary`, `--primary-solid`, `--primary-soft`, `--ring`, `--chart-1` and the font. Re-check contrast after swapping.

**Without ui-ux-pro-max**, use the token sets in section 6 and these fonts:

| Style | Font (Google Fonts) | Numbers |
|-------|---------------------|---------|
| Modern / Professional | Plus Jakarta Sans or Inter (finance: IBM Plex Sans) | `tabular-nums` everywhere |
| Glass / Aurora | Inter or DM Sans | |
| Neumorphism | Plus Jakarta Sans | |
| Claymorphism | Nunito (headings) + DM Sans (body) | |
| Skeuomorphism | Source Sans 3 | |
| Neubrutalism | Space Grotesk | |
| Cyber / Dark tech | Fira Sans + Fira Code for figures | |

For Khmer, Thai, Lao or other non-Latin content, add the matching Noto Sans family (e.g. `Noto Sans Khmer`) after the Latin font in `--font-sans`.

---

## 3. Stack and setup

- Motion needs React 18.2+. Install: `npm i motion lucide-react recharts @dnd-kit/core @dnd-kit/sortable tailwindcss @tailwindcss/vite` and `npm i -D vite-plugin-singlefile`. (`@dnd-kit` only when cards are rearrangeable, section 6.) Import from `"motion/react"`.
- A project that already uses `framer-motion` keeps it: same API, import from `"framer-motion"`.
- Next.js App Router: every file that uses Motion components or hooks starts with `"use client"` (or import from `"motion/react-client"` in server components).
- Icons: **one** family. Lucide (default, used below) or Phosphor (`@phosphor-icons/react`, the ui-ux-pro-max catalogue). Never emoji as icons.
- `vite.config.ts` (the `preview` mode inlines everything into one HTML file you can publish as an artifact or send):

```ts
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `vite build --mode preview` inlines everything into one HTML file for artifact previews.
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === 'preview' ? [viteSingleFile()] : [])],
}))
```

Folder layout: `src/lib/motion.ts`, `src/lib/design.tsx`, `src/components/{Tooltip,Sidebar,AppShell,Widgets,charts,SwapGrid}.tsx`, `src/index.css`.

---

## 4. Layout spec (the shell)

| Part | Spec |
|------|------|
| Sidebar width | Expanded **264px** (240-280), collapsed rail **76px** (72-80). Nav item 44px tall, 20px icon, radius `--radius-sm` |
| Default state | ≥1280px expanded, 1024-1279px collapsed, <1024px off-canvas drawer. The user's last choice is remembered (localStorage, wrapped in try/catch) |
| Toggle | Button in the sidebar header + **Ctrl/Cmd + B**. `aria-expanded`, `aria-controls`, label switches "Collapse sidebar" / "Expand sidebar"; icon cross-rotates |
| Collapsed rail | Icons only. Every item gets a tooltip on **hover and keyboard focus** (portaled so `overflow:hidden` can't clip it) and an `aria-label`. Count badges become dots. Group titles become thin dividers |
| Expanded | Icon + label + count badge; uppercase group titles; labels fade/slide in after the width starts moving (delay 60ms), out faster (100ms) |
| Nested items | Expanded: disclosure that animates `height: 0 → "auto"` (short lists only). Collapsed: hovering or focusing the parent opens a portaled flyout menu of the children |
| Active item | `aria-current="page"` + one shared `layoutId="nav-active"` pill that **slides** between items |
| Mobile drawer | Full labels, scrim, slides from left with a spring, closes on Esc, scrim click and navigation; focus moves into the drawer; hamburger in the topbar |
| Topbar | Sticky, 64px, translucent with blur: search (Ctrl K hint), theme toggle, notifications (bell + dot), avatar menu |
| Main | Skip link, `max-width` 1400-1600px, page header (title, subtitle, one primary action), KPI row (4, max 6), charts, tables on a 12-column grid |
| z-index | content 0 · topbar 20 · sidebar 30 · scrim 40 · drawer 50 · tooltip 100 |

---

## 5. Motion system

### Principles (reconciled with ui-ux-pro-max)

1. **Hover, focus and press feedback on every interactive element and every card.** It is user-initiated, so the "animate 1-2 elements per view" rule does not apply to it.
2. **Autonomous motion stays scarce**: one staggered entrance on first load (40-60ms per item), route transitions, KPI count-up once, live pulse only for genuinely live data. No looping decoration.
3. **Transform and opacity only.** One sanctioned exception: the sidebar's `width` (a single element on a spring). Charts use `ResponsiveContainer debounce={200}` so they resize once, after the sidebar settles.
4. **Keyboard and touch parity**: every `whileHover` has a `whileFocus` (or CSS `:focus-visible`) twin and a `whileTap`.
5. **Reduced motion**: `<MotionConfig reducedMotion="user">` at the root; `useReducedMotion()` for the sidebar width and the count-up (show the final number immediately); CSS transitions cut to 0.01ms.
6. **Exit faster than enter** (about 60-70%), springs stay interruptible, nothing shifts layout (reserve space for badges and values).
7. **Data stays crisp**: table rows, chart marks and numbers never scale or bounce; use a background wash, an accent edge or a tooltip instead.

### Tokens

| Token | Value | Use |
|-------|-------|-----|
| `spring.snappy` | stiffness 520, damping 34, mass 0.6 | hover, press, active pill |
| `spring.smooth` | stiffness 320, damping 32 | sidebar width, drawer |
| `spring.bouncy` | stiffness 420, damping 16 | Clay style or Playful intensity only |
| `ease.out` / `ease.in` | `[0.16,1,0.3,1]` / `[0.7,0,0.84,0]` | arriving / leaving |
| Durations | fast 120ms · base 200ms · slow 320ms · count-up 1.1s | |
| Intensity factor | Subtle ×0.5 · Expressive ×1 · Playful ×1.6 | multiplies every hover offset and scale |

### Hover vocabulary (every element)

| Element | Motion (transform) | CSS (paint) |
|---------|--------------------|-------------|
| Nav item | icon `scale 1.1, rotate -6°`; hover wash fades in; tap `scale 0.9` | text colour → `--fg`; active pill via `layoutId` |
| Sidebar toggle | style's button hover; icon cross-rotates on state change | wash background |
| Primary button | style's button hover; tap per style | `--btn-shadow` |
| Icon button | style's button hover; bell wiggles `rotate [0,-12,10,-6,0]` | wash background |
| KPI card | style's card hover; icon spring (`variants` propagate from the card) | `--shadow-hover`, `--border-hover`; Glass adds a light sweep |
| Chart / table panel | `y -2` only (no scale; none for Neumorphism) | `--shadow-hover` |
| Table row | none | wash + 3px inset accent edge |
| Chart point | `activeDot r=5` | tooltip on solid surface |
| Search input | icon `scale 1.1` on focus-within | ring + border colour |
| Segmented control / tabs | `layoutId` pill slides | |
| Theme toggle | sun/moon swap: rise + rotate in on a spring | |
| Avatar / menu items | style's button hover / `x 2` | wash |
| Badges, pills | static (they are data) | |

### Per-style hover signatures

| Style | Card hover | Button hover | Press | Signature effect (CSS) |
|-------|-----------|--------------|-------|------------------------|
| Modern | `y -3` | `y -1, scale 1.02` | `scale 0.97` | soft shadow grows |
| Glass | `y -4` | `scale 1.03` | `scale 0.97` | light sweep across the pane, deeper shadow; panes keep a gradient rim light |
| Clay | `y -4, scale 1.02` (bouncy) | `scale 1.05` | `scale 0.93` squish | puffier shadow |
| Neumorphism | `scale 0.99` (presses in, no lift) | `scale 0.98` | `scale 0.96` | shadow flips outset → inset |
| Skeuomorphism | `y -2` | `y -1` | `y 1, scale 0.99` | light-source shadow deepens |
| Neubrutalism | `x -3, y -3` | `x -2, y -2` | `x 2, y 2` | hard offset shadow 4px → 7px, so the card lifts off the page |
| Cyber | `y -2` | `scale 1.02` | `scale 0.97` | neon border + outer glow |

---

## 6. Style tokens and content

Components read **only** semantic CSS variables. Theme and style are attributes on `<html>`: `data-theme="light|dark"` and `data-style="modern|glass|clay|neu|skeuo|brutal|cyber"`. Swapping either re-skins the whole app with no component changes. Each set below is contrast-checked (text pairs ≥4.5:1).

Token meanings: `--page-base` solid page colour (painted on `<html>`, so nothing light ever shows behind a dark page) · `--page-bg` page (may be a gradient) · `--surface` cards (may be translucent or a gradient) · `--surface-solid` opaque surface for tooltips and menus · `--surface-2` inputs, segmented controls · `--sidebar-bg` / `--sidebar-fg` / `--sidebar-muted` (the last two only when the sidebar contrasts with the page) · `--fg` / `--fg-muted` text · `--primary` accent for text, icons, indicators · `--primary-solid` button fill · `--primary-soft` tinted fill (active nav, icon chips) · `--hover-wash` hover background · `--shadow` / `--shadow-hover` · `--chart-1..5` five categorical chart colours, distinct within each style · `--grid` chart gridlines · `--gauge-track` empty part of gauges and progress bars · Glass only: `--glass-shapes` (crisp wallpaper shapes), `--glass-rim` (rim-light gradient), `--glass-pill-shadow`, `--chip-base` · Neumorphism only: `--neu-dark` / `--neu-light` (the two extrusion shadow colours).

### `src/index.css` - token sets (all styles, light and dark)

```css
@import 'tailwindcss';

:root, :root[data-style='modern'] {
  --chart-3: #d97706; --chart-4: #7c3aed; --chart-5: #e11d48; --page-base: #f6f8fb;
  --font-sans: 'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif; --page-bg: #f6f8fb; --surface: #ffffff; --surface-solid: #ffffff;
  --surface-2: #f1f5f9; --sidebar-bg: #ffffff; --topbar-bg: rgb(246 248 251 / 0.8); --fg: #0f172a; --fg-muted: #475569; --border: #e2e8f0;
  --border-hover: #cbd5e1; --border-w: 1px; --primary: #2563eb; --primary-solid: #2563eb; --on-primary: #ffffff; --primary-soft: #eff4ff;
  --hover-wash: rgb(15 23 42 / 0.05); --ring: #2563eb; --success: #15803d; --warning: #b45309; --danger: #dc2626; --chart-1: #2563eb; --chart-2: #0d9488;
  --grid: #e9eef5; --radius: 16px; --radius-sm: 10px; --blur: none; --shadow: 0 1px 2px rgb(15 23 42 / 0.04), 0 1px 3px rgb(15 23 42 / 0.06);
  --shadow-hover: 0 4px 8px rgb(15 23 42 / 0.05), 0 12px 28px rgb(15 23 42 / 0.1); --sidebar-shadow: 1px 0 0 var(--border);
  --btn-shadow: 0 1px 2px rgb(37 99 235 / 0.3); --tooltip-bg: #0f172a; --tooltip-fg: #f8fafc;
}
:root[data-style='modern'][data-theme='dark'] {
  --chart-3: #fbbf24; --chart-4: #a78bfa; --chart-5: #fb7185; --page-base: #070b14; --page-bg: #070b14; --surface: #17223a; --surface-solid: #17223a;
  --surface-2: #1e2a46; --sidebar-bg: #0c1322; --topbar-bg: rgb(7 11 20 / 0.82); --fg: #f8fafc; --fg-muted: #b8c3d6; --border: #253350; --border-hover: #3b5079;
  --primary: #6cb0ff; --primary-solid: #2563eb; --primary-soft: rgb(108 176 255 / 0.16); --hover-wash: rgb(255 255 255 / 0.06); --ring: #6cb0ff;
  --success: #4ade80; --warning: #fbbf24; --danger: #f87171; --chart-1: #6cb0ff; --chart-2: #2dd4bf; --grid: #1c2742;
  --shadow: inset 0 1px 0 rgb(255 255 255 / 0.05), 0 1px 2px rgb(0 0 0 / 0.5), 0 8px 24px rgb(0 0 0 / 0.3);
  --shadow-hover: inset 0 1px 0 rgb(255 255 255 / 0.08), 0 18px 40px rgb(0 0 0 / 0.55); --sidebar-shadow: 1px 0 0 #1b2640; --tooltip-bg: #22304d;
  --tooltip-fg: #ffffff;
}
:root[data-style='glass'] {
  --chip-base: var(--primary-soft);
  --glass-shapes: radial-gradient(circle at 16% 26%, rgb(167 139 250 / 0.85) 0 150px, transparent 151px), radial-gradient(circle at 80% 18%, rgb(244 114 182 / 0.8) 0 115px, transparent 116px), radial-gradient(circle at 64% 76%, rgb(45 212 191 / 0.8) 0 175px, transparent 176px), radial-gradient(circle at 34% 88%, transparent 0 92px, rgb(251 146 60 / 0.85) 93px 122px, transparent 123px), radial-gradient(circle at 92% 62%, rgb(96 165 250 / 0.8) 0 70px, transparent 71px), repeating-linear-gradient(0deg, rgb(255 255 255 / 0.4) 0 1px, transparent 1px 56px), repeating-linear-gradient(90deg, rgb(255 255 255 / 0.4) 0 1px, transparent 1px 56px);
  --chart-3: #0e7490; --chart-4: #b45309; --chart-5: #047857; --page-base: #e9ecff;
  --page-bg: radial-gradient(38% 42% at 12% 16%, rgb(124 58 237 / 0.6), transparent 70%), radial-gradient(34% 40% at 88% 10%, rgb(236 72 153 / 0.55), transparent 70%), radial-gradient(42% 48% at 74% 90%, rgb(6 182 212 / 0.55), transparent 70%), radial-gradient(36% 40% at 20% 94%, rgb(249 115 22 / 0.45), transparent 70%), radial-gradient(30% 34% at 50% 48%, rgb(59 130 246 / 0.3), transparent 70%), linear-gradient(160deg, #eef0ff, #fdf2f8);
  --surface: linear-gradient(135deg, rgb(255 255 255 / 0.62), rgb(255 255 255 / 0.4)); --surface-solid: #ffffff; --surface-2: rgb(255 255 255 / 0.42);
  --sidebar-bg: linear-gradient(180deg, rgb(255 255 255 / 0.55), rgb(255 255 255 / 0.38)); --topbar-bg: rgb(255 255 255 / 0.3); --fg: #0b1020;
  --fg-muted: #2a3349; --border: rgb(255 255 255 / 0.55); --border-hover: rgb(255 255 255 / 0.9); --border-w: 1px; --primary: #3730a3;
  --primary-solid: linear-gradient(180deg, #5558e8, #3f35c4); --on-primary: #ffffff; --primary-soft: rgb(255 255 255 / 0.6);
  --hover-wash: rgb(255 255 255 / 0.4); --ring: #3730a3; --success: #0b4a23; --warning: #6b3205; --danger: #881337; --chart-1: #4338ca; --chart-2: #be185d;
  --grid: rgb(11 16 32 / 0.1); --radius: 22px; --radius-sm: 14px; --blur: blur(30px) saturate(180%);
  --glass-rim: linear-gradient(140deg, rgb(255 255 255 / 0.95), rgb(255 255 255 / 0.15) 35%, rgb(255 255 255 / 0.05) 60%, rgb(255 255 255 / 0.6));
  --glass-pill-shadow: inset 0 1px 1px rgb(255 255 255 / 0.8), 0 6px 16px rgb(40 30 120 / 0.12);
  --shadow: 0 10px 30px rgb(40 30 120 / 0.14), inset 0 1px 1px rgb(255 255 255 / 0.7);
  --shadow-hover: 0 22px 50px rgb(40 30 120 / 0.24), inset 0 1px 1px rgb(255 255 255 / 0.9);
  --sidebar-shadow: 0 20px 50px rgb(40 30 120 / 0.18), inset 0 1px 1px rgb(255 255 255 / 0.7);
  --btn-shadow: 0 8px 22px rgb(67 56 202 / 0.4), inset 0 1px 0 rgb(255 255 255 / 0.35); --tooltip-bg: rgb(15 18 36 / 0.78); --tooltip-fg: #ffffff;
}
:root[data-style='glass'][data-theme='dark'] {
  --chip-base: rgb(8 10 22 / 0.35);
  --glass-shapes: radial-gradient(circle at 16% 26%, rgb(99 102 241 / 0.6) 0 150px, transparent 151px), radial-gradient(circle at 80% 18%, rgb(192 38 211 / 0.55) 0 115px, transparent 116px), radial-gradient(circle at 64% 76%, rgb(8 145 178 / 0.55) 0 175px, transparent 176px), radial-gradient(circle at 34% 88%, transparent 0 92px, rgb(249 115 22 / 0.6) 93px 122px, transparent 123px), radial-gradient(circle at 92% 62%, rgb(59 130 246 / 0.55) 0 70px, transparent 71px), repeating-linear-gradient(0deg, rgb(255 255 255 / 0.06) 0 1px, transparent 1px 56px), repeating-linear-gradient(90deg, rgb(255 255 255 / 0.06) 0 1px, transparent 1px 56px);
  --chart-3: #67e8f9; --chart-4: #fcd34d; --chart-5: #6ee7b7; --page-base: #05060e;
  --page-bg: radial-gradient(38% 42% at 12% 16%, rgb(99 102 241 / 0.7), transparent 70%), radial-gradient(34% 40% at 88% 10%, rgb(192 38 211 / 0.55), transparent 70%), radial-gradient(42% 48% at 74% 90%, rgb(8 145 178 / 0.55), transparent 70%), radial-gradient(36% 40% at 20% 94%, rgb(234 88 12 / 0.45), transparent 70%), radial-gradient(30% 34% at 50% 48%, rgb(37 99 235 / 0.3), transparent 70%), #05060e;
  --surface: linear-gradient(135deg, rgb(255 255 255 / 0.13), rgb(255 255 255 / 0.04)), rgb(10 12 26 / 0.44); --surface-solid: #1a1d33;
  --surface-2: rgb(255 255 255 / 0.08); --sidebar-bg: linear-gradient(180deg, rgb(255 255 255 / 0.1), rgb(255 255 255 / 0.04)), rgb(10 12 26 / 0.46);
  --topbar-bg: rgb(8 10 22 / 0.35); --fg: #ffffff; --fg-muted: #d5dbea; --border: rgb(255 255 255 / 0.14); --border-hover: rgb(255 255 255 / 0.32);
  --primary: #c7d2fe; --primary-solid: linear-gradient(180deg, #5558e8, #3f35c4); --primary-soft: rgb(255 255 255 / 0.14); --hover-wash: rgb(255 255 255 / 0.08);
  --ring: #c7d2fe; --success: #86efac; --warning: #fde68a; --danger: #fecdd3; --chart-1: #c7d2fe; --chart-2: #f9a8d4; --grid: rgb(255 255 255 / 0.1);
  --glass-rim: linear-gradient(140deg, rgb(255 255 255 / 0.5), rgb(255 255 255 / 0.08) 35%, rgb(255 255 255 / 0.02) 60%, rgb(255 255 255 / 0.28));
  --glass-pill-shadow: inset 0 1px 1px rgb(255 255 255 / 0.2), 0 6px 16px rgb(0 0 0 / 0.3);
  --shadow: 0 10px 34px rgb(0 0 0 / 0.45), inset 0 1px 1px rgb(255 255 255 / 0.12);
  --shadow-hover: 0 22px 56px rgb(0 0 0 / 0.6), inset 0 1px 1px rgb(255 255 255 / 0.2);
  --sidebar-shadow: 0 20px 50px rgb(0 0 0 / 0.5), inset 0 1px 1px rgb(255 255 255 / 0.1);
  --btn-shadow: 0 8px 24px rgb(99 102 241 / 0.45), inset 0 1px 0 rgb(255 255 255 / 0.3); --tooltip-bg: rgb(26 29 51 / 0.82); --tooltip-fg: #ffffff;
}
:root[data-style='clay'] {
  --chart-3: #0284c7; --chart-4: #d97706; --chart-5: #059669; --page-base: #f3effc;
  --font-sans: 'Nunito', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; --page-bg: #f3effc; --surface: #ffffff; --surface-solid: #ffffff;
  --surface-2: #ece6fa; --sidebar-bg: #faf8ff; --topbar-bg: rgb(243 239 252 / 0.85); --fg: #2a2346; --fg-muted: #5b5378; --border: rgb(124 92 230 / 0.12);
  --border-hover: rgb(124 92 230 / 0.25); --border-w: 2px; --primary: #6d4fe0; --primary-solid: #7c5ce6; --on-primary: #ffffff; --primary-soft: #efe9ff;
  --hover-wash: rgb(124 92 230 / 0.08); --ring: #6d4fe0; --success: #15803d; --warning: #b45309; --danger: #dc2626; --chart-1: #7c5ce6; --chart-2: #f472b6;
  --grid: #eee8fb; --radius: 26px; --radius-sm: 16px; --blur: none;
  --shadow: 10px 10px 24px rgb(108 80 200 / 0.14), inset -5px -5px 12px rgb(108 80 200 / 0.07), inset 5px 5px 12px rgb(255 255 255 / 0.9);
  --shadow-hover: 14px 16px 32px rgb(108 80 200 / 0.22), inset -5px -5px 12px rgb(108 80 200 / 0.08), inset 5px 5px 12px rgb(255 255 255 / 0.95);
  --sidebar-shadow: 6px 0 24px rgb(108 80 200 / 0.08);
  --btn-shadow: 0 8px 18px rgb(124 92 230 / 0.35), inset 0 -3px 0 rgb(0 0 0 / 0.12), inset 0 2px 0 rgb(255 255 255 / 0.3); --tooltip-bg: #2a2346;
  --tooltip-fg: #ffffff;
}
:root[data-style='clay'][data-theme='dark'] {
  --chart-3: #7dd3fc; --chart-4: #fcd34d; --chart-5: #6ee7b7; --page-base: #120f24; --page-bg: #120f24; --surface: #2a2350; --surface-solid: #2a2350;
  --surface-2: #332b5e; --sidebar-bg: #1b1636; --topbar-bg: rgb(18 15 36 / 0.85); --fg: #fdfbff; --fg-muted: #d3cbef; --border: rgb(255 255 255 / 0.08);
  --border-hover: rgb(255 255 255 / 0.18); --primary: #c4b5ff; --primary-soft: rgb(196 181 255 / 0.16); --hover-wash: rgb(255 255 255 / 0.07); --ring: #c4b5ff;
  --success: #4ade80; --warning: #fcd34d; --danger: #fb8a8a; --chart-1: #c4b5ff; --chart-2: #f9a8d4; --grid: #342c5c;
  --shadow: 10px 10px 24px rgb(0 0 0 / 0.45), inset -4px -4px 10px rgb(0 0 0 / 0.25), inset 4px 4px 10px rgb(255 255 255 / 0.07);
  --shadow-hover: 14px 16px 32px rgb(0 0 0 / 0.55), inset -4px -4px 10px rgb(0 0 0 / 0.25), inset 4px 4px 10px rgb(255 255 255 / 0.1);
  --sidebar-shadow: 6px 0 24px rgb(0 0 0 / 0.35); --tooltip-bg: #3b3270; --tooltip-fg: #ffffff;
}
:root[data-style='neu'] {
  --chart-3: #b45309; --chart-4: #6d28d9; --chart-5: #be123c; --page-base: #e4e9f0; --neu-dark: #c3c9d2; --neu-light: #ffffff; --page-bg: #e4e9f0;
  --surface: #e4e9f0; --surface-solid: #eef2f7; --surface-2: #e4e9f0; --sidebar-bg: #e4e9f0; --topbar-bg: rgb(228 233 240 / 0.9); --fg: #1e293b;
  --fg-muted: #4a5568; --border: rgb(255 255 255 / 0.55); --border-hover: rgb(255 255 255 / 0.8); --border-w: 1px; --primary: #2b59c3; --primary-solid: #2b59c3;
  --on-primary: #ffffff; --primary-soft: #d9e2f1; --hover-wash: rgb(30 41 59 / 0.04); --ring: #2b59c3; --success: #166534; --warning: #92400e; --danger: #b91c1c;
  --chart-1: #2b59c3; --chart-2: #0f766e; --grid: #d3dae5; --radius: 20px; --radius-sm: 14px; --blur: none;
  --shadow: 8px 8px 18px var(--neu-dark), -8px -8px 18px var(--neu-light);
  --shadow-hover: inset 6px 6px 12px var(--neu-dark), inset -6px -6px 12px var(--neu-light); --sidebar-shadow: 6px 0 18px #c9cfd8;
  --btn-shadow: 5px 5px 12px var(--neu-dark), -5px -5px 12px var(--neu-light); --tooltip-bg: #1e293b; --tooltip-fg: #ffffff;
}
:root[data-style='neu'][data-theme='dark'] {
  --chart-3: #fbbf24; --chart-4: #a78bfa; --chart-5: #fb7185; --page-base: #181b22; --page-bg: #181b22; --surface: #262b36; --surface-solid: #2b313d;
  --surface-2: #1b1e25; --sidebar-bg: #1d2129; --topbar-bg: rgb(24 27 34 / 0.9); --fg: #f4f7fb; --fg-muted: #b9c2d1; --border: rgb(255 255 255 / 0.06);
  --border-hover: rgb(255 255 255 / 0.12); --primary: #85abff; --primary-solid: #3b6be0; --primary-soft: #262c38; --hover-wash: rgb(255 255 255 / 0.04);
  --ring: #85abff; --success: #4ade80; --warning: #fbbf24; --danger: #f87171; --chart-1: #85abff; --chart-2: #2dd4bf; --grid: #2a303b; --neu-dark: #0e1014;
  --neu-light: #2b303b; --shadow: 8px 8px 18px var(--neu-dark), -6px -6px 16px var(--neu-light);
  --shadow-hover: inset 6px 6px 12px var(--neu-dark), inset -6px -6px 12px var(--neu-light); --sidebar-shadow: 6px 0 18px #0e1014;
  --btn-shadow: 5px 5px 12px var(--neu-dark), -4px -4px 10px var(--neu-light); --tooltip-bg: #2f3542; --tooltip-fg: #ffffff;
}
:root[data-style='skeuo'] {
  --chart-3: #9f1239; --chart-4: #0f766e; --chart-5: #6d28d9; --page-base: #e7e3d8; --font-sans: 'Source Sans 3', 'Inter', ui-sans-serif, system-ui, sans-serif;
  --page-bg: linear-gradient(180deg, #ece8df, #e2ddd1); --surface: linear-gradient(180deg, #fdfcf9 0%, #f3f0e8 100%); --surface-solid: #fbfaf6;
  --surface-2: linear-gradient(180deg, #e9e5db, #f4f1ea); --sidebar-bg: linear-gradient(180deg, #3b3f46 0%, #2b2e33 100%); --sidebar-fg: #e9e4d8;
  --sidebar-muted: #b8b1a1; --topbar-bg: linear-gradient(180deg, rgb(250 248 243 / 0.95), rgb(236 232 223 / 0.95)); --fg: #2b2a27; --fg-muted: #5c574d;
  --border: #cfc8b8; --border-hover: #b5ac98; --border-w: 1px; --primary: #1f5fa8; --primary-solid: linear-gradient(180deg, #3d84d6 0%, #1f5fa8 100%);
  --on-primary: #ffffff; --primary-soft: rgb(31 95 168 / 0.1); --hover-wash: rgb(0 0 0 / 0.04); --ring: #1f5fa8; --success: #166534; --warning: #92400e;
  --danger: #b91c1c; --chart-1: #1f5fa8; --chart-2: #a16207; --grid: #e3ddd0; --radius: 12px; --radius-sm: 8px; --blur: none;
  --shadow: 0 1px 0 rgb(255 255 255 / 0.9) inset, 0 1px 2px rgb(0 0 0 / 0.12), 0 4px 10px rgb(60 50 30 / 0.12);
  --shadow-hover: 0 1px 0 rgb(255 255 255 / 0.9) inset, 0 2px 4px rgb(0 0 0 / 0.14), 0 10px 22px rgb(60 50 30 / 0.2);
  --sidebar-shadow: inset -1px 0 0 rgb(255 255 255 / 0.06), 4px 0 12px rgb(0 0 0 / 0.25);
  --btn-shadow: inset 0 1px 0 rgb(255 255 255 / 0.4), 0 1px 2px rgb(0 0 0 / 0.3), 0 2px 6px rgb(31 95 168 / 0.3); --tooltip-bg: #2b2e33; --tooltip-fg: #f5f1e6;
}
:root[data-style='skeuo'][data-theme='dark'] {
  --chart-3: #fda4af; --chart-4: #5eead4; --chart-5: #c4b5fd; --page-base: #141518; --page-bg: linear-gradient(180deg, #1c1d21, #131417);
  --surface: linear-gradient(180deg, #3a3d45 0%, #2e3138 100%); --surface-solid: #34373e; --surface-2: linear-gradient(180deg, #1f2024, #282a30);
  --sidebar-bg: linear-gradient(180deg, #2b2016 0%, #1f170f 100%); --sidebar-fg: #f6ead6; --sidebar-muted: #cbbb9c;
  --topbar-bg: linear-gradient(180deg, rgb(44 46 52 / 0.95), rgb(32 34 38 / 0.95)); --fg: #faf7f0; --fg-muted: #cfc8b8; --border: #4a4e57;
  --border-hover: #626773; --primary: #8cbcf5; --primary-solid: linear-gradient(180deg, #2f72c0 0%, #1d5594 100%); --primary-soft: rgb(140 188 245 / 0.15);
  --hover-wash: rgb(255 255 255 / 0.06); --ring: #8cbcf5; --success: #4ade80; --warning: #fbbf24; --danger: #fca5a5; --chart-1: #8cbcf5; --chart-2: #e0b44c;
  --grid: #3e4149; --shadow: inset 0 1px 0 rgb(255 255 255 / 0.09), 0 2px 4px rgb(0 0 0 / 0.45), 0 8px 18px rgb(0 0 0 / 0.35);
  --shadow-hover: inset 0 1px 0 rgb(255 255 255 / 0.12), 0 4px 8px rgb(0 0 0 / 0.5), 0 16px 32px rgb(0 0 0 / 0.45); --tooltip-bg: #3a3d45; --tooltip-fg: #faf7f0;
}
:root[data-style='brutal'] {
  --chart-3: #16a34a; --chart-4: #9333ea; --chart-5: #ea580c; --page-base: #fff8e7; --font-sans: 'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif;
  --page-bg: #fff8e7; --surface: #ffffff; --surface-solid: #ffffff; --surface-2: #fff1c2; --sidebar-bg: #ffde59; --topbar-bg: #fff8e7; --fg: #111111;
  --fg-muted: #3d3d3d; --border: #111111; --border-hover: #111111; --border-w: 2.5px; --primary: #111111; --primary-solid: #ff6b6b; --on-primary: #111111;
  --primary-soft: #ffffff; --hover-wash: rgb(17 17 17 / 0.08); --ring: #2563eb; --success: #166534; --warning: #92400e; --danger: #b91c1c; --chart-1: #2563eb;
  --chart-2: #e11d48; --grid: #eadfc2; --radius: 10px; --radius-sm: 8px; --blur: none; --shadow: 4px 4px 0 #111111; --shadow-hover: 7px 7px 0 #111111;
  --sidebar-shadow: 2.5px 0 0 #111111; --btn-shadow: 3px 3px 0 #111111; --tooltip-bg: #111111; --tooltip-fg: #ffde59;
}
:root[data-style='brutal'][data-theme='dark'] {
  --chart-3: #ff6b6b; --chart-4: #a78bfa; --chart-5: #60a5fa; --page-base: #0d0d0d; --page-bg: #0d0d0d; --surface: #1f1f1f; --surface-solid: #1f1f1f;
  --surface-2: #2b2b2b; --sidebar-bg: #171717; --topbar-bg: #0d0d0d; --fg: #ffffff; --fg-muted: #d6d6d6; --border: #e5e5e5; --border-hover: #ffde59;
  --primary: #ffde59; --primary-solid: #ffde59; --on-primary: #111111; --primary-soft: #2b2b2b; --hover-wash: rgb(255 255 255 / 0.08); --ring: #ffde59;
  --success: #4ade80; --warning: #fbbf24; --danger: #f87171; --chart-1: #ffde59; --chart-2: #4ecdc4; --grid: #2e2e2e; --shadow: 4px 4px 0 #5c5c5c;
  --shadow-hover: 7px 7px 0 #ffde59; --sidebar-shadow: 2.5px 0 0 #e5e5e5; --btn-shadow: 3px 3px 0 #e5e5e5; --tooltip-bg: #ffde59; --tooltip-fg: #111111;
}
:root[data-style='cyber'] {
  --chart-3: #4d7c0f; --chart-4: #d97706; --chart-5: #4f46e5; --page-base: #f4f7fb; --font-sans: 'Fira Sans', 'Inter', ui-sans-serif, system-ui, sans-serif;
  --page-bg: #f4f7fb; --surface: #ffffff; --surface-solid: #ffffff; --surface-2: #eef2f8; --sidebar-bg: #0b0f17; --sidebar-fg: #e6edf7; --sidebar-muted: #8b98ad;
  --topbar-bg: rgb(244 247 251 / 0.85); --fg: #0b0f17; --fg-muted: #4b5568; --border: #dde3ec; --border-hover: #0891b2; --border-w: 1px; --primary: #0e7490;
  --primary-solid: #0e7490; --on-primary: #ffffff; --primary-soft: rgb(14 116 144 / 0.1); --hover-wash: rgb(14 116 144 / 0.06); --ring: #0e7490;
  --success: #15803d; --warning: #b45309; --danger: #be123c; --chart-1: #0891b2; --chart-2: #c026d3; --grid: #e6ebf2; --radius: 12px; --radius-sm: 8px;
  --blur: none; --shadow: 0 1px 2px rgb(11 15 23 / 0.06); --shadow-hover: 0 0 0 1px #0891b2, 0 8px 24px -6px rgb(8 145 178 / 0.4); --sidebar-shadow: none;
  --btn-shadow: 0 0 0 1px rgb(14 116 144 / 0.5), 0 4px 16px -4px rgb(14 116 144 / 0.6); --tooltip-bg: #0b0f17; --tooltip-fg: #67e8f9;
}
:root[data-style='cyber'][data-theme='dark'] {
  --chart-3: #a3e635; --chart-4: #fbbf24; --chart-5: #818cf8; --page-base: #020409; --page-bg: #020409; --surface: #111b2c; --surface-solid: #111b2c;
  --surface-2: #16223a; --sidebar-bg: #070b13; --sidebar-fg: #f5f9ff; --sidebar-muted: #a9b7cc; --topbar-bg: rgb(2 4 9 / 0.85); --fg: #f5f9ff;
  --fg-muted: #a9b7cc; --border: #1c2840; --border-hover: #22d3ee; --primary: #22d3ee; --primary-solid: #22d3ee; --on-primary: #021014;
  --primary-soft: rgb(34 211 238 / 0.12); --hover-wash: rgb(34 211 238 / 0.07); --ring: #22d3ee; --success: #4ade80; --warning: #fbbf24; --danger: #fb7185;
  --chart-1: #22d3ee; --chart-2: #e879f9; --grid: #142033; --shadow: inset 0 1px 0 rgb(255 255 255 / 0.04), 0 0 0 1px rgb(34 211 238 / 0.05);
  --shadow-hover: 0 0 0 1px #22d3ee, 0 0 28px -6px rgb(34 211 238 / 0.6); --btn-shadow: 0 0 20px -4px rgb(34 211 238 / 0.7); --tooltip-bg: #22d3ee;
  --tooltip-fg: #021014;
}
```

### `src/index.css` - component layer (append after the tokens)

```css
/* first frame, before the script sets data-style: follow the viewer's theme so dark viewers never see a light flash */
@media (prefers-color-scheme: dark) {
  :root:not([data-style]):not([data-theme='light']) { --page-base: #070b14; --page-bg: #070b14; --fg: #f8fafc; color-scheme: dark; }
}
:root:not([data-style])[data-theme='dark'] { --page-base: #070b14; --page-bg: #070b14; --fg: #f8fafc; color-scheme: dark; }

/* Page paint, text colour and font are deliberately NOT in @layer base: any unlayered stylesheet
   (a host page's reset, an embed wrapper, a CMS theme) beats every Tailwind layer, and a reset like
   `body { background: #fff; color: #000 }` would leave dark cards with black text on a white page.
   `html body` outranks a plain `body` reset, and .app paints the page itself so it never depends on body. */
html {
  background-color: var(--page-base);
  -webkit-font-smoothing: antialiased;
}
html body,
.app {
  background: var(--page-bg);
  background-attachment: fixed;
  color: var(--fg);
  font-family: var(--font-sans);
}
html body { margin: 0; transition: background-color 0.3s, color 0.3s; }
.card { color: var(--fg); }

.text-muted { color: var(--fg-muted); }
.text-success { color: var(--success); }
.text-danger { color: var(--danger); }

.skip-link { position: absolute; left: 12px; top: -48px; z-index: 200; padding: 8px 12px; border-radius: 8px; background: var(--primary-solid); color: var(--on-primary); }
.skip-link:focus { top: 12px; }

/* focus rings are part of the hover system: anything that reacts to hover reacts to keyboard focus */
:where(a, button, input, [tabindex]):focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }

.card {
  position: relative;
  background: var(--surface);
  border: var(--border-w) solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  -webkit-backdrop-filter: var(--blur);
  backdrop-filter: var(--blur);
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
}
.card-interactive:hover,
.card-interactive:focus-visible { box-shadow: var(--shadow-hover); border-color: var(--border-hover); }

/* glass: light sweep across the pane on hover (background-position, stays inside the card) */
[data-style='glass'] .card-interactive::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(115deg, transparent 35%, rgb(255 255 255 / 0.22) 50%, transparent 65%) no-repeat;
  background-size: 250% 100%;
  background-position: 130% 0;
  transition: background-position 0.8s ease;
}
[data-style='glass'] .card-interactive:hover::after { background-position: -30% 0; }

.sidebar {
  background: var(--sidebar-bg);
  color: var(--sidebar-fg, var(--fg));
  box-shadow: var(--sidebar-shadow);
  -webkit-backdrop-filter: var(--blur);
  backdrop-filter: var(--blur);
}
[data-style='brutal'] .sidebar { border-right: var(--border-w) solid var(--border); box-shadow: none; }
.sidebar .icon-btn { color: var(--sidebar-muted, var(--fg-muted)); }
.sidebar-group-title { color: var(--sidebar-muted, var(--fg-muted)); }
.sidebar-rule { border-color: color-mix(in srgb, var(--sidebar-muted, var(--fg-muted)) 30%, transparent); }

.nav-link { color: var(--sidebar-muted, var(--fg-muted)); transition: color 0.15s; }
.nav-link:hover, .nav-link[data-active] { color: var(--sidebar-fg, var(--fg)); }
.nav-link[data-active] { color: var(--primary); }
[data-style='skeuo'] .nav-link[data-active], [data-style='cyber'] .nav-link[data-active] { color: var(--sidebar-fg); }
.nav-hover { background: var(--hover-wash); }
[data-style='skeuo'] .nav-hover, [data-style='cyber'] .nav-hover { background: rgb(255 255 255 / 0.06); }
.nav-active { background: var(--primary-soft); }
[data-style='neu'] .nav-active { background: var(--surface); box-shadow: inset 4px 4px 8px var(--neu-dark), inset -4px -4px 8px var(--neu-light); }
[data-style='clay'] .nav-active { background: var(--surface-solid); box-shadow: 4px 4px 10px rgb(108 80 200 / 0.15), inset 2px 2px 4px rgb(255 255 255 / 0.9); }
[data-style='clay'][data-theme='dark'] .nav-active { box-shadow: 4px 4px 10px rgb(0 0 0 / 0.3); }
[data-style='brutal'] .nav-active { background: var(--surface-solid); border: 2px solid var(--border); box-shadow: 3px 3px 0 var(--border); }
[data-style='skeuo'] .nav-active { background: linear-gradient(180deg, rgb(0 0 0 / 0.35), rgb(0 0 0 / 0.2)); box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.5), 0 1px 0 rgb(255 255 255 / 0.06); }
[data-style='cyber'] .nav-active { background: rgb(34 211 238 / 0.1); box-shadow: inset 3px 0 0 #22d3ee; }

.icon-btn { color: var(--fg-muted); transition: background-color 0.15s, color 0.15s; }
.icon-btn:hover { background: var(--hover-wash); color: var(--fg); }
.sidebar .icon-btn:hover { color: var(--sidebar-fg, var(--fg)); }

.btn-primary { background: var(--primary-solid); color: var(--on-primary); box-shadow: var(--btn-shadow); }
[data-style='brutal'] .btn-primary { border: var(--border-w) solid var(--border); }
.btn-ghost { color: var(--fg); background: var(--hover-wash); }

.topbar { background: var(--topbar-bg); border-bottom: 1px solid var(--border); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); }
[data-style='brutal'] .topbar { border-bottom: var(--border-w) solid var(--border); }
[data-style='neu'] .topbar { border-bottom: 0; }

.search { background: var(--surface-2); border: var(--border-w) solid var(--border); transition: box-shadow 0.2s, border-color 0.2s; }
.search:focus-within { border-color: var(--ring); box-shadow: 0 0 0 3px color-mix(in srgb, var(--ring) 20%, transparent); }
[data-style='neu'] .search { box-shadow: inset 4px 4px 8px var(--neu-dark), inset -4px -4px 8px var(--neu-light); border-color: transparent; }

.tooltip { background: var(--tooltip-bg); color: var(--tooltip-fg); border-radius: 8px; box-shadow: 0 6px 20px rgb(0 0 0 / 0.18); }
.badge { background: var(--primary-soft); color: var(--primary); }
[data-style='skeuo'] .badge, [data-style='cyber'] .badge { background: rgb(255 255 255 / 0.12); color: var(--sidebar-fg); }
.badge-dot { background: var(--danger); box-shadow: 0 0 0 2px var(--surface-solid); }
.brand-mark { background: var(--primary-solid); color: var(--on-primary); box-shadow: var(--btn-shadow); }
.avatar, .kpi-icon { background: var(--primary-soft); color: var(--primary); }
[data-style='neu'] .kpi-icon, [data-style='neu'] .avatar { background: var(--surface); box-shadow: var(--btn-shadow); }
[data-style='brutal'] .kpi-icon, [data-style='brutal'] .avatar { border: 2px solid var(--border); background: var(--surface-2); }
.scrim { background: rgb(2 6 23 / 0.5); backdrop-filter: blur(2px); }

.segmented { background: var(--surface-2); border: var(--border-w) solid var(--border); }
.segmented button { color: var(--fg-muted); }
.segmented button[aria-checked='true'] { color: var(--fg); }
.segmented-active { background: var(--surface-solid); box-shadow: 0 1px 3px rgb(0 0 0 / 0.12); }
[data-style='brutal'] .segmented-active { border: 2px solid var(--border); box-shadow: 2px 2px 0 var(--border); }

/* tables: hover = background wash + accent edge, never scale (data must stay crisp) */
/* tables: hover = background wash + accent edge, never scale (data must stay crisp).
   Cells get side padding so the 3px accent edge sits in its own gutter, clear of the text. */
.data-table { border-collapse: separate; border-spacing: 0; }
.data-table th, .data-table td { padding-inline: 10px; }
.data-table th:first-child, .data-table td:first-child { padding-left: 16px; }
.data-table th:last-child, .data-table td:last-child { padding-right: 14px; }
.data-row > td { border-top: 1px solid var(--border); transition: background-color 0.15s, box-shadow 0.15s; }
[data-style='brutal'] .data-row > td { border-top-width: 1.5px; }
.data-row:hover > td { background: var(--hover-wash); }
.data-row:hover > td:first-child { box-shadow: inset 3px 0 0 var(--primary); border-radius: 10px 0 0 10px; }
.data-row:hover > td:last-child { border-radius: 0 10px 10px 0; }

.pill { display: inline-block; border-radius: 999px; padding: 2px 10px; font-size: 12px; font-weight: 600; }
/* status text is mixed a quarter toward --fg so it keeps 4.5:1 on its own tinted fill in both themes */
.pill-success { color: color-mix(in srgb, var(--success) 75%, var(--fg)); background: color-mix(in srgb, var(--success) 14%, transparent); }
.pill-warning { color: color-mix(in srgb, var(--warning) 75%, var(--fg)); background: color-mix(in srgb, var(--warning) 16%, transparent); }
.pill-danger { color: color-mix(in srgb, var(--danger) 75%, var(--fg)); background: color-mix(in srgb, var(--danger) 14%, transparent); }

/* ---------- profile cards, progress, tags, heatmap ---------- */
:root { --gauge-track: color-mix(in srgb, var(--fg) 10%, transparent); }
.avatar-tint { background: color-mix(in srgb, var(--c) 22%, var(--surface-solid)); color: color-mix(in srgb, var(--c) 70%, var(--fg)); }
.profile-avatar { box-shadow: 0 0 0 4px var(--surface-solid), 0 8px 20px rgb(0 0 0 / 0.16); }
[data-style='brutal'] .avatar-tint { border: 2px solid var(--border); }
.profile-banner {
  background: radial-gradient(120% 140% at 0% 0%, color-mix(in srgb, var(--c) 60%, transparent), transparent 62%),
    linear-gradient(120deg, color-mix(in srgb, var(--c) 32%, transparent), color-mix(in srgb, var(--chart-4) 30%, transparent));
}
[data-style='brutal'] .profile-banner { border-bottom: var(--border-w) solid var(--border); }
.profile-fact { background: var(--hover-wash); }
[data-style='glass'] .profile-fact { background: var(--surface-2); box-shadow: inset 0 1px 1px rgb(255 255 255 / 0.25); }
[data-style='neu'] .profile-fact { background: var(--surface); box-shadow: inset 3px 3px 7px var(--neu-dark), inset -3px -3px 7px var(--neu-light); }
[data-style='brutal'] .profile-fact { background: var(--surface-2); border: 2px solid var(--border); }
.progress-track { background: var(--gauge-track); }
.progress-fill { background: var(--primary-solid); }
.tag { background: var(--surface-2); color: var(--fg-muted); border: 1px solid var(--border); }
.selected-ring { box-shadow: 0 0 0 2px var(--primary), 0 0 0 6px color-mix(in srgb, var(--primary) 22%, transparent); }
.heat-cell { background: color-mix(in srgb, var(--danger) var(--heat), transparent); color: var(--fg); transition: box-shadow 0.15s; }
.heat-cell:hover { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--danger) 70%, var(--fg)); }
[data-style='brutal'] .heat-cell { border: 1.5px solid var(--border); }

/* KPI delta chip: rounded rectangle tinted with the trend colour */
.delta-chip { --chip: var(--success); background: color-mix(in srgb, var(--chip) 14%, transparent); border-radius: calc(var(--radius-sm) - 2px); }
.delta-chip[data-trend='down'] { --chip: var(--danger); }
.delta-chip-value { color: color-mix(in srgb, var(--chip) 75%, var(--fg)); }
[data-style='glass'] .delta-chip { background: color-mix(in srgb, var(--chip) 16%, var(--chip-base)); box-shadow: var(--glass-pill-shadow); }
[data-style='neu'] .delta-chip { background: var(--surface); box-shadow: inset 3px 3px 6px var(--neu-dark), inset -3px -3px 6px var(--neu-light); }
[data-style='brutal'] .delta-chip { border: 2px solid var(--border); background: color-mix(in srgb, var(--chip) 22%, var(--surface-solid)); }
[data-style='clay'] .delta-chip { border-radius: 999px; }

/* ---------- swappable cards: drag onto another card to trade places; slots never change ---------- */
.swap-cell { cursor: grab; }
.swap-cell :where(button, a, input, [role='radio'], [role='button']) { cursor: pointer; }
.swap-cell[data-dragging] > :not(.swap-grip) { opacity: 0.35; }
.swap-cell[data-dragging]::after,
.swap-cell[data-picked]::after { content: ''; position: absolute; inset: 0; border-radius: var(--radius); pointer-events: none; }
.swap-cell[data-dragging]::after { outline: 2px dashed var(--border-hover); outline-offset: -1px; }
.swap-cell[data-picked]::after { box-shadow: 0 0 0 2px var(--primary), 0 0 0 6px color-mix(in srgb, var(--primary) 22%, transparent); }
.swap-grip {
  position: absolute; top: 4px; left: 50%; z-index: 5; translate: -50% 0;
  display: grid; place-items: center; width: 44px; height: 22px; border-radius: 999px;
  color: var(--fg-muted); background: var(--surface-2); border: 1px solid var(--border);
  opacity: 0; cursor: grab; touch-action: none; transition: opacity 0.15s, color 0.15s;
}
.swap-cell:hover > .swap-grip, .swap-grip:focus-visible, .swap-grip[aria-pressed='true'] { opacity: 1; }
.swap-grip:hover { color: var(--fg); }
@media (hover: none) { .swap-grip { opacity: 1; } }
.swap-drop {
  position: absolute; inset: 0; z-index: 6; display: grid; place-items: center; border-radius: var(--radius);
  background: color-mix(in srgb, var(--primary) 12%, transparent); outline: 2px dashed var(--primary); outline-offset: -2px;
}
.swap-target { cursor: pointer; background: color-mix(in srgb, var(--page-base) 40%, transparent); -webkit-backdrop-filter: blur(3px); backdrop-filter: blur(3px); }
.swap-target:hover, .swap-target:focus-visible { background: color-mix(in srgb, var(--primary) 18%, transparent); }
.swap-label {
  display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 999px;
  background: var(--primary-solid); color: var(--on-primary); font-size: 13px; font-weight: 600; box-shadow: var(--btn-shadow);
}
.swap-overlay { cursor: grabbing; }
.swap-overlay .card { box-shadow: var(--shadow-hover), 0 28px 60px rgb(0 0 0 / 0.28); }

/* ---------- Glass: iOS-style material ---------- */
/* the wallpaper drifts slowly so the frosted panes visibly refract what is behind them */
[data-style='glass'] .app { position: relative; isolation: isolate; }
[data-style='glass'] .app::before {
  content: '';
  position: fixed;
  inset: -12%;
  z-index: -1;
  pointer-events: none;
  background: var(--glass-shapes), var(--page-bg);
  animation: glass-drift 30s ease-in-out infinite alternate;
}
@keyframes glass-drift {
  from { transform: translate3d(-2%, -1%, 0) scale(1); }
  to { transform: translate3d(3%, 2%, 0) scale(1.08) rotate(6deg); }
}
/* rim light: a 1px gradient edge, bright top-left and bottom-right, like light catching glass */
[data-style='glass'] .card,
[data-style='glass'] #app-sidebar { border-color: transparent; }
[data-style='glass'] .card::before,
[data-style='glass'] #app-sidebar::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  pointer-events: none;
  background: var(--glass-rim);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
}
/* desktop sidebar floats as its own glass panel, inset from the window edge */
[data-style='glass'] #app-sidebar { top: 12px; height: calc(100dvh - 24px); margin: 12px 0 12px 12px; border-radius: 26px; }
/* header: fully clear so the wallpaper shows through; it frosts only once content scrolls beneath it */
[data-style='glass'] .topbar { background: transparent; border-bottom-color: transparent; -webkit-backdrop-filter: none; backdrop-filter: none; transition: background-color 0.25s, border-color 0.25s, box-shadow 0.25s; }
[data-style='glass'] .topbar[data-scrolled] { background: var(--topbar-bg); border-bottom-color: rgb(255 255 255 / 0.18); box-shadow: 0 8px 24px rgb(0 0 0 / 0.08); -webkit-backdrop-filter: var(--blur); backdrop-filter: var(--blur); }
[data-style='glass'] .search,
[data-style='glass'] .segmented { -webkit-backdrop-filter: var(--blur); backdrop-filter: var(--blur); }
[data-style='glass'] .nav-active,
[data-style='glass'] .segmented-active,
[data-style='glass'] .kpi-icon,
[data-style='glass'] .avatar { background: var(--primary-soft); box-shadow: var(--glass-pill-shadow); }
[data-style='glass'] .tooltip { -webkit-backdrop-filter: blur(20px) saturate(180%); backdrop-filter: blur(20px) saturate(180%); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
}
```

### Dark themes

Every style's dark variant follows the same ladder, so components pop off the page instead of sitting on a white or grey canvas:

1. **Page** is the darkest layer (`--page-base`, near-black with the style's hue).
2. **Sidebar** sits between page and cards.
3. **Cards, panels, inputs** are one clear step lighter than the page (about 1.2-1.3x the page's luminance), with a faint 1px top highlight (`inset 0 1px 0 rgb(255 255 255 / 0.05)`) and deeper shadows than light mode.
4. **Text** is near-white (`#f8fafc` or whiter); muted text stays light enough for ≥7:1 on cards; accents are lighter tints (blue 400 rather than 600).
5. **Tooltips, menus, popovers** are dark elevated surfaces with white text, never white boxes.
6. **Paint the page from the app, outside Tailwind's layers.** Page background, text colour and font sit on `html body` and `.app` as unlayered CSS, and cards set `color: var(--fg)` themselves. Tailwind v4 puts base styles in `@layer base`, and any unlayered stylesheet (a host page's reset, an embed wrapper) beats every layer, so a reset like `body { background: #fff; color: #000 }` would otherwise leave a white page with black numbers on dark cards.
7. The theme resolves in this order: the user's in-app choice (saved) → a `data-theme` the host already set on `<html>` → the OS setting. A `MutationObserver` follows the host if it switches later, the attributes are written in a layout effect (no light flash), and a small `prefers-color-scheme` block paints the very first frame dark for dark viewers.

### Glass done right (iOS-style material)

Glass only looks like glass when there is something colourful behind it to blur. All five parts are needed:

1. **A vivid wallpaper with crisp shapes**: 4-5 saturated radial "orbs" on a tinted base, plus hard-edged discs, a ring and a faint hairline grid (`--glass-shapes`). Soft gradients look the same blurred or not; hard edges are what make the frosting visible, sharp outside a pane and soft through it. The layer drifts slowly (30s, `ease-in-out infinite alternate`, stopped under reduced motion) on a fixed `::before` behind `.app`.
2. **Heavy blur with saturation**: `backdrop-filter: blur(30px) saturate(180%)`. Write `-webkit-backdrop-filter` first and the unprefixed property last: Tailwind v4's CSS minifier keeps only the last one when the value is a `var()`, and Chrome ignores the prefixed one. Verify in DevTools that the computed `backdrop-filter` on a card is not `none`.
3. **Translucent gradient fill**: light `rgb(255 255 255 / 0.62 → 0.40)`; dark `rgb(255 255 255 / 0.14 → 0.04)` over a dark tint `rgb(12 14 30 / 0.36)`.
4. **Rim light**: a 1px gradient edge (bright top-left and bottom-right) drawn with a masked `::before`, plus an inner top highlight in the shadow.
5. **Floating chrome**: on desktop the sidebar becomes its own rounded glass panel inset 12px from the window edge; selected items, icon chips and the avatar are frosted pills (`--primary-soft` + `--glass-pill-shadow`).
6. **A clear header**: the topbar has no fill, border or blur, so the wallpaper runs behind it and nothing reads as a mismatched strip. It frosts (blur + `--topbar-bg`) only once the page scrolls, via a `data-scrolled` attribute the shell sets.

Check text against the most saturated orb behind the thinnest part of the pane, not against the average.

Adding a style (Aurora, Bento, Minimal Swiss...): copy the nearest set (Aurora → Glass with an animated mesh `--page-bg`; Bento → Modern with `--radius: 24px` and varied grid spans; Minimal Swiss → Modern with `--radius: 4px`, `--shadow: none`, borders only), add a `hoverPreset` row in `motion.ts`, and re-check contrast.

### Content patterns

- **Page header**: `h1` (24px, semibold) + one-line subtitle in `--fg-muted` + one primary action on the right.
- **KPI row**: 4 cards (max 6): label, value with `CountUp`, icon chip, and a **delta chip**: a rounded rectangle tinted 14% with the trend colour, holding the arrow, the % (with a screen-reader "Up"/"Down") and "vs last month". Staggered entrance once.
- **Status text on tinted fills** (pills, delta chips) uses `color-mix(in srgb, <semantic> 75%, var(--fg))`, which keeps 4.5:1 on its own tint in both themes.
- **Charts**: type from ui-ux-pro-max `--domain chart` (trend → line/area, compare → bar, part-to-whole → donut ≤5 slices, target → bullet). Colours from `--chart-1..n` and `--grid`; tooltips on `--surface-solid`; `role="img"` + `aria-label` summarising the insight; skeleton while loading; empty and error states with retry.
- **Tables** (`.data-table`): sticky header, `tabular-nums`, right-aligned numbers, sortable headers with `aria-sort`, status as text pills (colour + word). Cells get side padding (16px first, 14px last) so the hover accent edge sits in its own gutter and never touches the text; the hover wash is drawn on cells with rounded ends (`border-collapse: separate`).
- **Profile card** (customers, borrowers, agents): tinted banner in the person's colour, overlapping initials avatar, name + ID + status pill, a facts grid (phone full width with a copy button: `navigator.clipboard.writeText` inside the click handler, falling back to selecting the number), a credit-score half-ring that draws itself (`motion.path` `pathLength`, bands by score), outstanding balance with an installment progress bar (`scaleX` from the left), next payment, tags and one primary action. Beside it, a grid of compact tiles; the selected tile wears a shared `layoutId` ring that glides between tiles, and the profile content cross-fades (`AnimatePresence mode="wait"`).
- **Analytics gallery**: pick the chart by the question, one panel each, rows of equal height (grid items stretch, `Panel className="h-full"`):

| Question | Chart | Recharts essentials |
|----------|-------|---------------------|
| Actual vs target over time | Bars + dashed line | `ComposedChart`, `Bar radius={[6,6,0,0]}`, `Line strokeDasharray="6 4" dot={false}` |
| Share of a whole (≤5 parts) | Donut with centre total + value list | `Pie innerRadius="62%" paddingAngle={3} cornerRadius={6}`, `activeShape` grows the hovered slice by 6px |
| Composition over time | Stacked bars | `Bar stackId="a"`, radius only on the top series |
| Conversion through stages | Horizontal funnel bars | `BarChart layout="vertical"`, `LabelList` with count and step %, fading `fillOpacity` |
| Relationship between two measures | Scatter, two segments | `ScatterChart`, `ZAxis range={[70,70]}`, second series `shape="diamond"` |
| Profile across 4-6 dimensions | Radar, two series | `RadarChart outerRadius="72%"`, `fillOpacity` 0.2, contrasting hues (`--chart-1` and `--chart-3`) |
| Two categories x intensity | Heatmap as a real `<table>` | cell fill `color-mix(<semantic> 12-45%, transparent)`, numbers always printed |
| One rate against a goal | Radial gauge | `RadialBarChart startAngle={210} endAngle={-30}`, `PolarAngleAxis domain={[0,100]}`, centre label |

Every chart gets a `role="img"` box with a one-sentence `aria-label` stating the real takeaway (check the numbers), `isAnimationActive` off under reduced motion, a legend built from the same tokens, and a tooltip on `--surface-solid`.

- **Numbers**: `Intl.NumberFormat` with the customer's locale and currency.

Example page body (KPI stagger + chart that resizes once):

```tsx
// import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from 'recharts'
<motion.div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" initial="hidden" animate="show"
  variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
  {kpis.map((k) => (
    <motion.div key={k.label} variants={{ hidden: { opacity: 0, y: 12 },
      show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } }}>
      <KpiCard {...k} />
    </motion.div>
  ))}
</motion.div>

<Panel title="Disbursed vs repaid">
  <div className="h-72" role="img" aria-label="Disbursements grew 88% since January; repayments track about 15% below.">
    <ResponsiveContainer width="100%" height="100%" debounce={200}>
      <AreaChart data={trend}>
        <CartesianGrid stroke="var(--grid)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: 'var(--fg-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--fg-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <ChartTooltip contentStyle={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--fg)' }} />
        <Area dataKey="disbursed" stroke="var(--chart-1)" strokeWidth={2.5} fill="var(--chart-1)" fillOpacity={0.12} activeDot={{ r: 5 }} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</Panel>
```

### Rearrangeable cards (only when the request asks for it)

Cards stay where they are unless the user asks for rearranging. When they do, **their instructions decide how it works**: which cards can move, how, and what happens to sizes. Fill each setting below from the request; use the fallback only for a setting the request leaves open, and ask (round 2 of the interview) only when a wrong guess would mean rebuilding.

| Setting | Options | How to build it | Fallback |
|---------|---------|-----------------|----------|
| Interaction | Swap: drop on a card and the two trade places · Reorder: drop between cards and the rest shift · Free placement and resizing | Swap: `SwapGrid` as is. Reorder: the same component with dnd-kit's `rectSortingStrategy` in place of `noShuffle` and `arrayMove` in place of `swap` in `onDragEnd`. Free placement or resizing: a grid-layout library (e.g. react-grid-layout) skinned with the same tokens and hover motion; `SwapGrid` does not do this | Swap |
| Which cards can trade | Any card with any card · only within groups (e.g. KPI tiles with KPI tiles) · a custom rule (same size only, charts only...) | One `SwapGrid` holding every card · one `SwapGrid` per group · the `canSwap(a, b)` prop | Within groups of the same kind |
| Fixed cards | None · some cards locked | `locked: true` on the item: no grip, can't be dragged or swapped onto | None |
| Size after a move | Takes the slot's size, so the page structure never changes · keeps its own size and the grid reflows | `slots` classNames per position · `span` on each item | Slot's size |
| Saved where | This viewer's browser · not saved · shared for everyone | `useSwapOrder` (localStorage) · plain `useState` · an artifact database or the app's own API | This viewer's browser, with a "Reset layout" button |

Not settings (always on, whatever the request): the keyboard path, the click-to-pick alternative, screen-reader announcements, touch press-and-hold, and widgets showing their final state inside the drag copy.

How the reference `SwapGrid` behaves (section 7):

- **Pointer**: press and move 6px anywhere on a card to lift it (a click stays a click). Touch: press and hold 250ms, so normal swipes still scroll. A lifted copy follows the pointer (`DragOverlay`, scaled 1.03 and tilted -1°), the original stays as a dimmed dashed placeholder, an allowed target shows a dashed "Swap here", the page auto-scrolls near the edges, and on drop the copy glides into its new slot while the other card slides across (`layout="position"`, so content never stretches mid-animation). Cards are never left at a free position.
- **Keyboard**: each movable card has a grip button (top centre, visible on hover, focus or touch). Space lifts, the arrow keys choose a target, Space swaps, Escape cancels; dnd-kit announces each step with the cards' titles, including when a target isn't allowed.
- **Single-pointer alternative** (WCAG 2.5.7): clicking the grip (or Enter) picks the card; every card it may swap with shows a "Swap here" button; Escape cancels. Focus returns to the moved card's grip.
- **Persistence**: `useSwapOrder(key, defaults)` keeps the order in `localStorage` only if it still holds the same cards, and exposes `isDefault` / `reset()` for a "Reset layout" button.
- When cards take the slot's size, build widgets to fill any slot: `h-full` panels, responsive charts, container queries (`Panel` is an `@container`, so `@md:grid-cols-2` adapts to the slot, not the screen).

---

## 7. Reference code

Copy these files, then adapt names, nav items and brand (the brand mark and "Atlas Console" in `Sidebar.tsx` are placeholders). They are the tested baseline; keep the behaviours (tooltips on focus, `aria-*`, reduced-motion handling) when restyling.

### `src/lib/motion.ts` - motion tokens and per-style hover presets

```ts
import type { TargetAndTransition, Transition, Variants } from 'motion/react'

/* ---------- Motion tokens: one rhythm for the whole app ---------- */
export const spring = {
  snappy: { type: 'spring', stiffness: 520, damping: 34, mass: 0.6 }, // hover, press, active pill
  smooth: { type: 'spring', stiffness: 320, damping: 32 }, // sidebar width, drawers
  bouncy: { type: 'spring', stiffness: 420, damping: 16 }, // playful / clay only
} satisfies Record<string, Transition>

export const ease = {
  out: [0.16, 1, 0.3, 1], // arriving: decelerate
  in: [0.7, 0, 0.84, 0], // leaving: accelerate
} as const

export const duration = { fast: 0.12, base: 0.2, slow: 0.32, countUp: 1.1 }

export type StyleId = 'modern' | 'glass' | 'clay' | 'neu' | 'skeuo' | 'brutal' | 'cyber'
export type Intensity = 'subtle' | 'expressive' | 'playful'

type HoverSet = { card: TargetAndTransition; button: TargetAndTransition; tap: TargetAndTransition; icon: TargetAndTransition }

/* ---------- Hover vocabulary per style (transform/opacity only; shadows live in CSS) ---------- */
const base: Record<StyleId, HoverSet> = {
  modern: { card: { y: -3 }, button: { y: -1, scale: 1.02 }, tap: { scale: 0.97 }, icon: { scale: 1.1, rotate: -6 } },
  glass: { card: { y: -4 }, button: { scale: 1.03 }, tap: { scale: 0.97 }, icon: { scale: 1.12 } },
  clay: { card: { y: -4, scale: 1.02 }, button: { scale: 1.05 }, tap: { scale: 0.93 }, icon: { scale: 1.15, rotate: 8 } },
  neu: { card: { scale: 0.99 }, button: { scale: 0.98 }, tap: { scale: 0.96 }, icon: { scale: 1.08 } },
  skeuo: { card: { y: -2 }, button: { y: -1 }, tap: { y: 1, scale: 0.99 }, icon: { scale: 1.08 } },
  brutal: { card: { x: -3, y: -3 }, button: { x: -2, y: -2 }, tap: { x: 2, y: 2 }, icon: { rotate: -10 } },
  cyber: { card: { y: -2 }, button: { scale: 1.02 }, tap: { scale: 0.97 }, icon: { scale: 1.1 } },
}

const factor: Record<Intensity, number> = { subtle: 0.5, expressive: 1, playful: 1.6 }

/** Scale every displacement/scale by the chosen intensity so one dial controls the feel. */
export function hoverPreset(style: StyleId, intensity: Intensity): HoverSet {
  const f = factor[intensity]
  const scaleBy = (t: TargetAndTransition): TargetAndTransition => {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(t)) {
      if (typeof v !== 'number') continue
      out[k] = k === 'scale' ? 1 + (v - 1) * f : v * f
    }
    return out as TargetAndTransition
  }
  const s = base[style]
  return { card: scaleBy(s.card), button: scaleBy(s.button), tap: scaleBy(s.tap), icon: scaleBy(s.icon) }
}

export const hoverSpring = (style: StyleId, intensity: Intensity): Transition =>
  style === 'clay' || intensity === 'playful' ? spring.bouncy : spring.snappy

/* ---------- entrance: one staggered rise on first render (30-60ms per item) ---------- */
export const stagger: Variants = { show: { transition: { staggerChildren: 0.06 } } }
export const rise: Variants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } }
```

### `src/lib/design.tsx` - design context (the interview answers), storage and media-query hooks

```tsx
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { hoverPreset, hoverSpring, type Intensity, type StyleId } from './motion'

/* ---------- small hooks ---------- */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage blocked: keep in memory */
    }
  }, [key, value])
  return [value, setValue] as const
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/* ---------- design context: the answers from the style interview ---------- */
type Theme = 'light' | 'dark'
type Design = {
  style: StyleId
  intensity: Intensity
  theme: Theme
  setTheme: (t: Theme) => void
  setStyle: (s: StyleId) => void
  hover: ReturnType<typeof hoverPreset>
  hoverTransition: ReturnType<typeof hoverSpring>
}
const DesignCtx = createContext<Design | null>(null)

const readTheme = (el: HTMLElement): Theme | null => (el.dataset.theme === 'dark' || el.dataset.theme === 'light' ? el.dataset.theme : null)

export function DesignProvider({ children, style: initialStyle, intensity }: { children: ReactNode; style: StyleId; intensity: Intensity }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  // priority: the user's in-app choice (saved) > a theme the host set on <html> > the OS setting
  const [saved, setSaved] = usePersistentState<Theme | null>('theme-choice', null)
  const [hostTheme, setHostTheme] = useState<Theme | null>(() => readTheme(document.documentElement))
  const theme: Theme = saved ?? hostTheme ?? (prefersDark ? 'dark' : 'light')
  const [style, setStyle] = useState<StyleId>(initialStyle)
  const written = useRef<Theme | null>(null)

  // if something else (e.g. the host's own light/dark switch) changes data-theme, follow it
  useEffect(() => {
    const root = document.documentElement
    const obs = new MutationObserver(() => {
      const t = readTheme(root)
      if (t && t !== written.current) {
        setHostTheme(t)
        setSaved(null)
      }
    })
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [setSaved])

  // layout effect: attributes are in place before the first paint, so there is no light flash
  useLayoutEffect(() => {
    const root = document.documentElement
    written.current = theme
    root.dataset.theme = theme
    root.dataset.style = style
    root.style.colorScheme = theme
  }, [theme, style])

  const value: Design = {
    style,
    intensity,
    theme,
    setTheme: setSaved,
    setStyle,
    hover: hoverPreset(style, intensity),
    hoverTransition: hoverSpring(style, intensity),
  }
  return (
    <DesignCtx.Provider value={value}>
      {/* reducedMotion="user": transforms/layout animations are skipped when the OS asks for less motion */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </DesignCtx.Provider>
  )
}

export function useDesign() {
  const ctx = useContext(DesignCtx)
  if (!ctx) throw new Error('useDesign must be used inside <DesignProvider>')
  return ctx
}
```

### `src/components/Tooltip.tsx`

```tsx
import { useLayoutEffect, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'

/** Label shown beside an icon-only control. Portaled so the sidebar's overflow:hidden can't clip it. */
export function Tooltip({ anchor, label, open }: { anchor: RefObject<HTMLElement | null>; label: string; open: boolean }) {
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    if (!open || !anchor.current) return
    const r = anchor.current.getBoundingClientRect()
    setPos({ top: r.top + r.height / 2, left: r.right + 12 })
  }, [open, anchor])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="tooltip"
          className="tooltip pointer-events-none fixed z-[100] -translate-y-1/2 whitespace-nowrap px-2.5 py-1.5 text-xs font-medium"
          style={{ top: pos.top, left: pos.left }}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.16 } }}
          exit={{ opacity: 0, x: -4, transition: { duration: 0.1 } }}
        >
          {label}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
```

### `src/components/Sidebar.tsx` - rail, nav links, mobile drawer

```tsx
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { PanelLeftClose, PanelLeftOpen, X, type LucideIcon } from 'lucide-react'
import { spring } from '../lib/motion'
import { useDesign } from '../lib/design'
import { Tooltip } from './Tooltip'

export type NavItem = { id: string; label: string; icon: LucideIcon; badge?: number }
export type NavGroup = { title: string; items: NavItem[] }

export const SIDEBAR_EXPANDED = 264
export const SIDEBAR_COLLAPSED = 76

type NavProps = { groups: NavGroup[]; activeId: string; onSelect: (id: string) => void; collapsed: boolean }

/* ---------- one nav link: icon always, label only when expanded, tooltip when collapsed ---------- */
function NavLink({ item, active, collapsed, onSelect }: { item: NavItem; active: boolean; collapsed: boolean; onSelect: (id: string) => void }) {
  const { hover, hoverTransition } = useDesign()
  const ref = useRef<HTMLAnchorElement>(null)
  const [showTip, setShowTip] = useState(false)
  const Icon = item.icon

  return (
    <li>
      <motion.a
        ref={ref}
        href={`#${item.id}`}
        aria-current={active ? 'page' : undefined}
        aria-label={collapsed ? item.label : undefined}
        onClick={(e) => {
          e.preventDefault()
          onSelect(item.id)
        }}
        onHoverStart={() => setShowTip(true)}
        onHoverEnd={() => setShowTip(false)}
        onFocus={() => setShowTip(true)}
        onBlur={() => setShowTip(false)}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileFocus="hover"
        whileTap="tap"
        className="nav-link group relative flex h-11 items-center gap-3 rounded-[var(--radius-sm)] px-[14px] text-sm font-medium outline-none"
        data-active={active || undefined}
      >
        {/* shared-layout pill: slides between items when the active page changes */}
        {active && <motion.span layoutId="nav-active" className="nav-active absolute inset-0 rounded-[inherit]" transition={spring.snappy} />}
        {/* hover wash, separate from the active pill */}
        <motion.span
          aria-hidden
          className="nav-hover absolute inset-0 rounded-[inherit]"
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 }, tap: { opacity: 1 } }}
          transition={{ duration: 0.15 }}
        />
        <motion.span
          className="relative z-10 grid size-5 shrink-0 place-items-center"
          variants={{ rest: { x: 0, scale: 1, rotate: 0 }, hover: hover.icon, tap: { scale: 0.9 } }}
          transition={hoverTransition}
        >
          <Icon size={20} strokeWidth={1.9} aria-hidden />
        </motion.span>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="label"
              className="relative z-10 flex-1 truncate whitespace-nowrap"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.06, duration: 0.18 } }}
              exit={{ opacity: 0, x: -8, transition: { duration: 0.1 } }}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        {item.badge !== undefined &&
          (collapsed ? (
            <span className="badge-dot absolute right-3 top-2.5 z-10 size-2 rounded-full" aria-hidden />
          ) : (
            <span className="badge relative z-10 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums">{item.badge}</span>
          ))}
      </motion.a>
      <Tooltip anchor={ref} label={item.badge ? `${item.label} (${item.badge})` : item.label} open={collapsed && showTip} />
    </li>
  )
}

function NavList({ groups, activeId, onSelect, collapsed }: NavProps) {
  return (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2">
      {groups.map((g, gi) => (
        <div key={g.title} className={gi ? 'mt-4' : ''}>
          {/* group title becomes a thin divider when collapsed */}
          <div className="relative mb-1 h-6 px-[14px]">
            <AnimatePresence initial={false} mode="popLayout">
              {collapsed ? (
                <motion.hr key="rule" className="sidebar-rule absolute inset-x-3 top-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              ) : (
                <motion.p key="title" className="sidebar-group-title whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {g.title}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <ul className="flex flex-col gap-1">
            {g.items.map((item) => (
              <NavLink key={item.id} item={item} active={item.id === activeId} collapsed={collapsed} onSelect={onSelect} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <motion.div whileHover={{ rotate: -8, scale: 1.06 }} transition={spring.bouncy} className="brand-mark grid size-10 shrink-0 place-items-center rounded-[var(--radius-sm)] text-sm font-bold">
        A
      </motion.div>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span key="brand" className="whitespace-nowrap text-[15px] font-semibold" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8, transition: { duration: 0.1 } }}>
            Atlas Console
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- desktop: rail that animates between icon-only and full width ---------- */
export function Sidebar({ collapsed, onToggle, ...nav }: Omit<NavProps, 'collapsed'> & { collapsed: boolean; onToggle: () => void }) {
  const reduce = useReducedMotion()
  const { hover, hoverTransition } = useDesign()
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <motion.aside
      id="app-sidebar"
      aria-label="Main navigation"
      initial={false}
      animate={{ width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED }}
      transition={reduce ? { duration: 0 } : spring.smooth}
      className="sidebar sticky top-0 z-30 flex h-dvh shrink-0 flex-col overflow-hidden"
    >
      <div className={`flex h-16 items-center px-[18px] ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && <Brand collapsed={collapsed} />}
        <motion.button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-controls="app-sidebar"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={`${collapsed ? 'Expand' : 'Collapse'} sidebar (Ctrl+B)`}
          whileHover={hover.button}
          whileTap={hover.tap}
          transition={hoverTransition}
          className="icon-btn grid size-10 shrink-0 place-items-center rounded-[var(--radius-sm)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={collapsed ? 'open' : 'close'} initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }}>
              <ToggleIcon size={20} aria-hidden />
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
      <NavList {...nav} collapsed={collapsed} />
    </motion.aside>
  )
}

/* ---------- below 1024px: off-canvas drawer, always full labels ---------- */
export function MobileSidebar({ open, onClose, ...nav }: Omit<NavProps, 'collapsed'> & { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    panel.current?.querySelector<HTMLElement>('a,button')?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim fixed inset-0 z-40" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            className="sidebar fixed inset-y-0 left-0 z-50 flex w-[min(300px,86vw)] flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: 0, transition: spring.smooth }}
            exit={{ x: '-100%', transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] } }}
          >
            <div className="flex h-16 items-center justify-between px-[18px]">
              <Brand collapsed={false} />
              <button type="button" onClick={onClose} aria-label="Close navigation" className="icon-btn grid size-10 place-items-center rounded-[var(--radius-sm)]">
                <X size={20} aria-hidden />
              </button>
            </div>
            <NavList
              {...nav}
              collapsed={false}
              onSelect={(id) => {
                nav.onSelect(id)
                onClose()
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

### `src/components/AppShell.tsx` - responsive shell, shortcut, topbar, route transition

```tsx
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bell, Menu, Search } from 'lucide-react'
import { useDesign, useMediaQuery, usePersistentState } from '../lib/design'
import { MobileSidebar, Sidebar, type NavGroup } from './Sidebar'
import { ThemeToggle } from './Widgets'

export function AppShell({ groups, activeId, onSelect, children }: { groups: NavGroup[]; activeId: string; onSelect: (id: string) => void; children: ReactNode }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isWide = useMediaQuery('(min-width: 1280px)')
  // remembered choice wins; first visit defaults to expanded on wide screens, collapsed on 1024-1279
  const [collapsed, setCollapsed] = usePersistentState<boolean>('sidebar-collapsed', !isWide)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggle = useCallback(() => setCollapsed((c) => !c), [setCollapsed])
  const { hover, hoverTransition } = useDesign()

  // Ctrl/Cmd + B toggles the rail (desktop) or the drawer (mobile)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        if (isDesktop) toggle()
        else setDrawerOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isDesktop, toggle])

  // the topbar knows when content scrolls under it (Glass keeps it clear until then, then frosts it)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="app flex min-h-dvh">
      <a href="#main" className="skip-link">Skip to content</a>
      {isDesktop ? (
        <Sidebar groups={groups} activeId={activeId} onSelect={onSelect} collapsed={collapsed} onToggle={toggle} />
      ) : (
        <MobileSidebar groups={groups} activeId={activeId} onSelect={onSelect} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="topbar sticky top-0 z-20 flex h-16 items-center gap-3 px-4 lg:px-8" data-scrolled={scrolled || undefined}>
          {!isDesktop && (
            <motion.button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation" aria-expanded={drawerOpen} whileTap={hover.tap} className="icon-btn grid size-10 place-items-center rounded-[var(--radius-sm)]">
              <Menu size={20} aria-hidden />
            </motion.button>
          )}
          <label className="search group flex h-10 min-w-0 max-w-md flex-1 items-center gap-2 rounded-[var(--radius-sm)] px-3">
            <Search size={18} className="text-muted shrink-0 transition-transform duration-200 group-focus-within:scale-110" aria-hidden />
            <span className="sr-only">Search</span>
            <input type="search" placeholder="Search loans, customers..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--fg-muted)]" />
            <kbd className="text-muted hidden rounded border border-[var(--border)] px-1.5 text-[11px] sm:block">Ctrl K</kbd>
          </label>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <motion.button type="button" aria-label="Notifications, 3 unread" whileHover={{ rotate: [0, -12, 10, -6, 0] }} whileTap={hover.tap} transition={{ duration: 0.5 }} className="icon-btn relative grid size-10 place-items-center rounded-[var(--radius-sm)]">
              <Bell size={20} aria-hidden />
              <span className="badge-dot absolute right-2.5 top-2.5 size-2 rounded-full" aria-hidden />
            </motion.button>
            <motion.button type="button" aria-label="Account menu" whileHover={hover.button} whileTap={hover.tap} transition={hoverTransition} className="avatar grid size-10 place-items-center rounded-full text-sm font-semibold">
              SK
            </motion.button>
          </div>
        </header>

        <main id="main" tabIndex={-1} className="flex-1 px-4 py-6 outline-none lg:px-8">
          {/* page transition keyed on the route: quick fade + 8px rise, exit faster than enter */}
          <AnimatePresence mode="wait">
            <motion.div key={activeId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }} exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
```

### `src/components/Widgets.tsx` - CountUp, KpiCard, Panel, Button, ThemeToggle

```tsx
import { useEffect, type ReactNode } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { ArrowDownRight, ArrowUpRight, Moon, Sun, type LucideIcon } from 'lucide-react'
import { ease, duration } from '../lib/motion'
import { useDesign } from '../lib/design'
import { useInDragOverlay } from './SwapGrid'

/* ---------- number that counts up once; final value immediately under reduced motion ---------- */
export function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const inOverlay = useInDragOverlay()
  const reduce = useReducedMotion() || inOverlay
  const mv = useMotionValue(reduce ? value : 0)
  const text = useTransform(mv, (v) => format(v))
  useEffect(() => {
    if (reduce) {
      mv.set(value)
      return
    }
    const controls = animate(mv, value, { duration: duration.countUp, ease: ease.out })
    return () => controls.stop()
  }, [value, reduce, mv])
  return <motion.span className="tabular-nums">{text}</motion.span>
}

/* ---------- KPI card: lift + icon spring on hover, equal on keyboard focus ---------- */
export function KpiCard({ label, value, format, delta, icon: Icon }: { label: string; value: number; format: (n: number) => string; delta: number; icon: LucideIcon }) {
  const { hover, hoverTransition } = useDesign()
  const up = delta >= 0
  const Trend = up ? ArrowUpRight : ArrowDownRight
  return (
    <motion.article
      tabIndex={0}
      aria-label={`${label}: ${format(value)}, ${up ? 'up' : 'down'} ${Math.abs(delta)}%`}
      className="card card-interactive relative flex h-full flex-col gap-4 p-5 outline-none"
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      variants={{ rest: { x: 0, y: 0, scale: 1 }, hover: hover.card }}
      transition={hoverTransition}
    >
      <div className="flex items-center justify-between">
        <span className="text-muted text-sm font-medium">{label}</span>
        <motion.span className="kpi-icon grid size-10 place-items-center rounded-[var(--radius-sm)]" variants={{ rest: { scale: 1, rotate: 0 }, hover: hover.icon }} transition={hoverTransition}>
          <Icon size={20} aria-hidden />
        </motion.span>
      </div>
      <div className="kpi-value text-3xl font-semibold tracking-tight">
        <CountUp value={value} format={format} />
      </div>
      {/* delta chip: tinted rounded fill in the trend's semantic colour; arrow + sign word, never colour alone */}
      <div className="delta-chip inline-flex w-fit items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium" data-trend={up ? 'up' : 'down'}>
        <Trend size={15} aria-hidden className="delta-chip-value" />
        <span className="delta-chip-value font-semibold tabular-nums">
          <span className="sr-only">{up ? 'Up' : 'Down'} </span>
          {Math.abs(delta)}%
        </span>
        <span className="text-muted">vs last month</span>
      </div>
    </motion.article>
  )
}

/* ---------- generic surface for charts/tables: subtle lift, no scale (keeps data crisp) ---------- */
export function Panel({ title, action, children, className = '' }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  const { style } = useDesign()
  return (
    <motion.section
      className={`card card-interactive @container flex flex-col p-5 ${className}`}
      whileHover={style === 'neu' ? undefined : { y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
    >
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        {action}
      </header>
      {children}
    </motion.section>
  )
}

export function Button({ children, variant = 'primary', onClick }: { children: ReactNode; variant?: 'primary' | 'ghost'; onClick?: () => void }) {
  const { hover, hoverTransition } = useDesign()
  return (
    <motion.button type="button" onClick={onClick} whileHover={hover.button} whileFocus={hover.button} whileTap={hover.tap} transition={hoverTransition} className={`btn btn-${variant} inline-flex h-10 items-center gap-2 rounded-[var(--radius-sm)] px-4 text-sm font-semibold`}>
      {children}
    </motion.button>
  )
}

export function ThemeToggle() {
  const { theme, setTheme, hover, hoverTransition } = useDesign()
  const dark = theme === 'dark'
  return (
    <motion.button type="button" onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} whileHover={hover.button} whileTap={hover.tap} transition={hoverTransition} className="icon-btn grid size-10 place-items-center overflow-hidden rounded-[var(--radius-sm)]">
      <motion.span key={theme} initial={{ y: 16, rotate: -60, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
        {dark ? <Moon size={20} aria-hidden /> : <Sun size={20} aria-hidden />}
      </motion.span>
    </motion.button>
  )
}
```

### `src/components/charts.tsx` - shared chart styling, sized and labelled chart box, legend

```tsx
import type { ReactElement } from 'react'
import { useReducedMotion } from 'motion/react'
import { ResponsiveContainer } from 'recharts'
import { useInDragOverlay } from './SwapGrid'

/* Shared chart styling: every colour comes from the theme tokens, so charts re-skin with the style. */
export const axisTick = { fill: 'var(--fg-muted)', fontSize: 12 }
export const tooltipProps = {
  contentStyle: { background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--fg)', boxShadow: '0 8px 24px rgb(0 0 0 / 0.18)' },
  labelStyle: { color: 'var(--fg)', fontWeight: 600, marginBottom: 4 },
  itemStyle: { color: 'var(--fg)' },
}
export const barCursor = { fill: 'var(--hover-wash)' }
export const lineCursor = { stroke: 'var(--border-hover)', strokeWidth: 1 }

/** Recharts draws its own entrance; switch it off when the OS asks for reduced motion. */
export function useChartAnimation() {
  const reduce = useReducedMotion()
  const inOverlay = useInDragOverlay() // the dragged copy shows the chart as-is
  return { isAnimationActive: !reduce && !inOverlay, animationDuration: 900, animationEasing: 'ease-out' as const }
}

/** Sized, labelled chart box. The label is the chart's text summary for screen readers. */
export function ChartBox({ label, className = 'h-64', children }: { label: string; className?: string; children: ReactElement }) {
  return (
    <div className={`relative ${className}`} role="img" aria-label={label}>
      {/* debounce: resize once after the sidebar settles instead of every animation frame */}
      <ResponsiveContainer width="100%" height="100%" debounce={200}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}

export function Legend({ items }: { items: { label: string; color: string; value?: string; dashed?: boolean }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-[3px]" style={i.dashed ? { border: `2px dashed ${i.color}` } : { background: i.color }} />
          <span className="text-muted">{i.label}</span>
          {i.value && <span className="font-semibold tabular-nums">{i.value}</span>}
        </li>
      ))}
    </ul>
  )
}
```

### `src/components/SwapGrid.tsx` - drag-to-swap grid (dnd-kit for input and accessibility, Motion for the lift and the slide)

```tsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type KeyboardEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  closestCenter, defaultDropAnimationSideEffects, DndContext, DragOverlay, KeyboardSensor, MouseSensor, pointerWithin, TouchSensor, useSensor, useSensors,
  type Announcements, type CollisionDetection, type DropAnimation,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, type SortingStrategy } from '@dnd-kit/sortable'
import { ArrowLeftRight, GripHorizontal } from 'lucide-react'
import { rise, spring, stagger } from '../lib/motion'

/* Cards in a SwapGrid can be dragged, but never placed freely: dropping a card on another card swaps the two,
   and every card always sits in one of the grid's slots. Which cards may swap, which are locked, and whether a card
   keeps the slot's size or its own are all settings, chosen per request (see the skill's "Rearrangeable cards"). */

/* ---------- widgets rendered inside the drag overlay show their final state (no count-up, no chart entrance) ---------- */
const InOverlay = createContext(false)
export const useInDragOverlay = () => useContext(InOverlay)

/* ---------- order of cards per group, remembered for this viewer ---------- */
export function useSwapOrder(key: string, defaults: string[]) {
  const [order, setOrder] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? 'null') as string[] | null
      // only trust a saved order that holds exactly the same cards
      if (saved && saved.length === defaults.length && defaults.every((d) => saved.includes(d))) return saved
    } catch {
      /* storage unavailable: start from the default layout */
    }
    return defaults
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(order))
    } catch {
      /* storage blocked: the order lives in memory only */
    }
  }, [key, order])
  const isDefault = order.every((id, i) => id === defaults[i])
  const reset = useCallback(() => setOrder(defaults), [defaults])
  return { order, setOrder, isDefault, reset }
}

const swap = (order: string[], a: string, b: string) => {
  const next = [...order]
  const i = next.indexOf(a)
  const j = next.indexOf(b)
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

// cards don't shuffle while you drag: the target is highlighted and the swap happens on drop
const noShuffle: SortingStrategy = () => null
// the slot under the pointer wins; keyboard dragging (no pointer) falls back to the nearest slot
const collision: CollisionDetection = (args) => {
  const hits = pointerWithin(args)
  return hits.length ? hits : closestCenter(args)
}

export type SwapItem = {
  id: string
  title: string
  render: () => ReactNode
  /** card carries its own size (e.g. 'xl:col-span-8') instead of taking the slot's size */
  span?: string
  /** card stays put and cannot be swapped with */
  locked?: boolean
}

type GridProps = {
  label: string
  items: SwapItem[]
  order: string[]
  onOrderChange: (order: string[]) => void
  /** one className per slot, e.g. column spans; used for cards without their own `span` */
  slots: string[]
  className: string
  /** optional rule for which pairs may trade places (default: any two unlocked cards) */
  canSwap?: (a: string, b: string) => boolean
}

export function SwapGrid({ label, items, order, onOrderChange, slots, className, canSwap }: GridProps) {
  const reduce = useReducedMotion()
  const byId = useMemo(() => Object.fromEntries(items.map((i) => [i.id, i])), [items])
  const title = (id: string | number) => byId[String(id)]?.title ?? String(id)
  const allowed = (a: string, b: string) => a !== b && !byId[a]?.locked && !byId[b]?.locked && (canSwap ? canSwap(a, b) : true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }), // a click stays a click
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }), // press and hold, so swipes still scroll
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates, keyboardCodes: { start: ['Space'], cancel: ['Escape'], end: ['Space'] } }),
  )

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${title(active.id)}. Use the arrow keys to choose a card to swap with, Space to drop, Escape to cancel.`,
    onDragOver: ({ active, over }) =>
      !over || over.id === active.id ? `Over its own place.` : allowed(String(active.id), String(over.id)) ? `Over ${title(over.id)}. Drop to swap.` : `${title(over.id)} can't be swapped with this card.`,
    onDragEnd: ({ active, over }) =>
      over && allowed(String(active.id), String(over.id)) ? `${title(active.id)} swapped with ${title(over.id)}.` : `${title(active.id)} returned to its place.`,
    onDragCancel: ({ active }) => `Moving ${title(active.id)} cancelled.`,
  }

  const dropAnimation: DropAnimation | null = reduce
    ? null
    : { duration: 280, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0' } } }) }

  // click / Enter alternative to dragging: pick a card, then choose where it goes
  const pick = (id: string) => {
    if (picked === id) {
      setPicked(null)
      setMessage(`Moving ${title(id)} cancelled.`)
      return
    }
    setPicked(id)
    setMessage(`${title(id)} picked. Choose a card to swap with, or press Escape to cancel.`)
  }
  const swapWith = (target: string) => {
    if (!picked) return
    onOrderChange(swap(order, picked, target))
    setMessage(`${title(picked)} swapped with ${title(target)}.`)
    const moved = picked
    setPicked(null)
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-grip="${moved}"]`)?.focus())
  }
  useEffect(() => {
    if (!picked) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMessage(`Moving ${title(picked)} cancelled.`)
        setPicked(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collision}
      accessibility={{ announcements, screenReaderInstructions: { draggable: `Press Space to drag this card, arrow keys to choose another card, Space again to swap. Or press Enter, then choose a card to swap with.` } }}
      onDragStart={({ active }) => {
        setPicked(null)
        setActiveId(String(active.id))
      }}
      onDragOver={({ over }) => setOverId(over ? String(over.id) : null)}
      onDragEnd={({ active, over }) => {
        if (over && allowed(String(active.id), String(over.id))) onOrderChange(swap(order, String(active.id), String(over.id)))
        setActiveId(null)
        setOverId(null)
      }}
      onDragCancel={() => {
        setActiveId(null)
        setOverId(null)
      }}
    >
      <SortableContext items={order} strategy={noShuffle}>
        <motion.div className={className} initial="hidden" animate="show" variants={stagger} aria-label={label} role="group">
          {order.map((id, slot) => (
            <SwapCell
              key={id}
              id={id}
              title={title(id)}
              className={byId[id]?.span ?? slots[slot] ?? ''}
              locked={!!byId[id]?.locked}
              isTarget={!!activeId && overId === id && allowed(activeId, id)}
              canTake={!!picked && allowed(picked, id)}
              picked={picked}
              pickedTitle={picked ? title(picked) : ''}
              onPick={pick}
              onSwapHere={swapWith}
            >
              {byId[id]?.render()}
            </SwapCell>
          ))}
        </motion.div>
      </SortableContext>

      {/* the lifted copy that follows the pointer; the card itself stays in its slot as a placeholder */}
      <DragOverlay dropAnimation={dropAnimation} className="swap-overlay">
        {activeId ? (
          <InOverlay.Provider value={true}>
            <motion.div className="h-full" initial={{ scale: 1, rotate: 0 }} animate={reduce ? {} : { scale: 1.03, rotate: -1 }} transition={spring.snappy}>
              {byId[activeId]?.render()}
            </motion.div>
          </InOverlay.Provider>
        ) : null}
      </DragOverlay>
      <div className="sr-only" aria-live="polite">
        {message}
      </div>
    </DndContext>
  )
}

type CellProps = {
  id: string
  title: string
  className: string
  locked: boolean
  isTarget: boolean
  canTake: boolean
  picked: string | null
  pickedTitle: string
  onPick: (id: string) => void
  onSwapHere: (id: string) => void
  children: ReactNode
}

function SwapCell({ id, title, className, locked, isTarget, canTake, picked, pickedTitle, onPick, onSwapHere, children }: CellProps) {
  const { setNodeRef, listeners, attributes, isDragging } = useSortable({ id, disabled: locked })
  // pointer listeners go on the whole card; the keyboard listener only on the grip, so Space/Enter inside a card keep their normal job
  const { onKeyDown: dndKeyDown, ...pointerListeners } = (listeners ?? {}) as Record<string, (e: unknown) => void>
  const onGripKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onPick(id)
    } else dndKeyDown?.(e)
  }

  return (
    <motion.div
      ref={setNodeRef}
      layout="position"
      transition={{ layout: spring.smooth }}
      variants={rise}
      className={`${locked ? '' : 'swap-cell'} relative min-w-0 ${className}`}
      data-dragging={isDragging || undefined}
      data-picked={picked === id || undefined}
      {...pointerListeners}
    >
      {children}

      {!locked && (
        <div
          {...attributes}
          aria-roledescription="draggable card"
          aria-label={`Move ${title}`}
          aria-pressed={picked === id}
          data-grip={id}
          className="swap-grip"
          onClick={() => onPick(id)}
          onKeyDown={onGripKey}
        >
          <GripHorizontal size={16} aria-hidden />
        </div>
      )}

      <AnimatePresence>
        {isTarget && (
          <motion.div className="swap-drop" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} aria-hidden>
            <span className="swap-label">
              <ArrowLeftRight size={15} aria-hidden /> Swap here
            </span>
          </motion.div>
        )}
        {canTake && (
          <motion.button
            type="button"
            className="swap-drop swap-target"
            onClick={() => onSwapHere(id)}
            aria-label={`Swap ${pickedTitle} with ${title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            <span className="swap-label">
              <ArrowLeftRight size={15} aria-hidden /> Swap here
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
```

Usage, with the settings from the request:

```tsx
// Swap, slot sizes fixed, saved per viewer (the fallbacks)
const ORDER = ['target', 'product', 'channel', 'funnel']                 // default order = default layout
const SLOTS = ['xl:col-span-8', 'xl:col-span-4', 'xl:col-span-7', 'xl:col-span-5']
const layout = useSwapOrder('layout:analytics', ORDER)
<SwapGrid label="Analytics charts" items={items} order={layout.order} onOrderChange={layout.setOrder}
  slots={SLOTS} className="grid gap-4 xl:grid-cols-12" />
// items: [{ id: 'target', title: 'Disbursements vs target chart', render: () => <Panel className="h-full" ...>...</Panel> }, ...]

// "the summary card stays first"            -> { id: 'summary', ..., locked: true }
// "charts keep their own size"              -> { id: 'target', ..., span: 'xl:col-span-8' } on every item
// "only cards of the same width can swap"   -> canSwap={(a, b) => widthOf(a) === widthOf(b)}
// "any card can swap with any card"         -> put every card in one SwapGrid
```

### Wiring

```tsx
// App.tsx
<DesignProvider style="glass" intensity="expressive">  {/* from the design brief */}
  <AppShell groups={navGroups} activeId={route} onSelect={setRoute}>
    <DashboardPage />
  </AppShell>
</DesignProvider>
```

**Live style review (optional):** while the customer is choosing, render a segmented control that calls `setStyle()` / `setTheme()` from `useDesign()` so they can flip between styles and themes on their real dashboard; remove it before production.

With a router, derive `activeId` from the current path and render real links (`<Link>` wrapped by `motion.create(Link)`) instead of the `href="#id"` anchors.

---

## 8. Verify and deliver

Run through this before handing over (it extends the ui-ux-pro-max pre-delivery checklist):

- [ ] `tsc` and the build pass; no console errors.
- [ ] Sidebar: toggles by button and Ctrl/Cmd+B; widths 264 / 76; state survives reload; tooltips appear on hover **and** Tab focus in the rail; active pill slides; labels never wrap or overflow mid-animation.
- [ ] Below 1024px: drawer opens from the hamburger, closes on Esc, scrim and navigation; focus goes into it.
- [ ] Every interactive element and card has hover, `:focus-visible` and press feedback in the chosen style; table rows and numbers do not scale.
- [ ] Reduced motion (DevTools → Rendering → prefers-reduced-motion): no transforms, sidebar snaps, KPI values show final numbers immediately.
- [ ] Both themes checked separately; text ≥4.5:1, borders and focus rings visible. Dark: page darkest, cards visibly lighter, no white tooltips or panels. Opening the page with `data-theme="dark"` on `<html>` (or a dark OS) shows dark from the first frame.
- [ ] Dark mode survives a host reset: load the page inside a wrapper whose head has `body { background: #fff; color: #000; font: 14px system-ui }` and confirm every style still shows a dark page, white KPI numbers and the chosen font.
- [ ] Rearrangeable cards (only if requested): they behave exactly as the request specified (which cards trade, locked cards, sizes, saving); mouse drag, touch press-and-hold, keyboard (grip, Space, arrows, Space) and click-to-pick all work; nothing can be left at a free position unless free placement was asked for.
- [ ] Tables: hovering a row shows the accent edge in its own gutter, clear of the first column's text.
- [ ] Glass: the header shows the wallpaper at rest and frosts on scroll; computed `backdrop-filter` on cards is not `none`; text checked over the most saturated part of the wallpaper.
- [ ] Charts resize once after the sidebar settles; every chart has a text summary; status uses words + colour.
- [ ] Tested at 375, 768, 1024, 1280 and 1440px; no horizontal scroll.
- [ ] Icons from one family, no emoji; fonts load with `display=swap`.
- [ ] Look at it: screenshot expanded, collapsed (with a tooltip open) and mobile, in both themes, and fix anything that looks off before delivery.

**Delivery**: the project files (or edits in the existing project) plus the design brief. For a quick look, build `vite build --mode preview` and publish the single `dist/index.html` as an artifact or send it as a file.
