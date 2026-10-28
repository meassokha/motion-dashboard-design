# Motion Dashboard

An animated dashboard web app built with React, Motion (formerly Framer Motion) and Tailwind CSS. It is the reference preview for the `motion-dashboard-design` skill: a collapsible sidebar, hover animation on every element, seven switchable visual styles in light and dark, drag-to-swap cards, customer profiles and an analytics chart gallery.

All people, figures and phone numbers in the app are sample data.

## Features

- **Collapsible sidebar**: full labels (264px) or an icon-only rail (76px), toggled by the button or **Ctrl/Cmd + B**. The rail shows each label as a tooltip on hover and keyboard focus. The active item has a pill that slides between items. Below 1024px the sidebar becomes a slide-out drawer. The last choice is remembered.
- **7 visual styles, light and dark**: Modern, Glassmorphism (iOS-style frosted panels over a drifting wallpaper), Claymorphism, Neumorphism, Skeuomorphism, Neubrutalism and Cyber. Switch them with the control in each page header; the sun/moon button switches the theme, and the app follows the system theme until you choose.
- **Hover and press animation everywhere**: each style has its own hover feel (lift, press-in, squish, offset shadow, glow), with the same feedback on keyboard focus.
- **Drag-to-swap cards** on Dashboard and Analytics: drag a card onto another card and the two trade places; every card stays in the grid's slots. Also works by keyboard (focus the grip, Space, arrow keys, Space) and by clicking the grip then "Swap here". Touch: press and hold. The arrangement is saved in the browser; "Reset layout" restores it.
- **Customers page**: a selectable list and a profile card with contact details, a credit-score gauge, outstanding balance with installment progress, and tags.
- **Analytics page**: 8 chart types: bars with a target line, donut, stacked bars, funnel, scatter, radar, heatmap and a radial gauge.
- **Accessibility**: text contrast checked at 4.5:1 or better in every style and theme, visible focus rings, a skip link, screen-reader labels and chart summaries, and reduced-motion support (animations stop and numbers show their final values).

## Getting started

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

| Command | What it does |
|---------|--------------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type-checks and builds the app into `dist/` |
| `npm run build:single` | Builds everything into one self-contained `dist/index.html` you can open or share as a single file |
| `npm run preview` | Serves the `dist/` build locally |
| `npm run lint` | Lints the code with oxlint |

Open the app with a starting style by adding `?style=glass` (or `modern`, `clay`, `neu`, `skeuo`, `brutal`, `cyber`) to the URL.

## Project structure

```
src/
  main.tsx                 entry point
  App.tsx                  navigation items and page routing
  index.css                design tokens for every style and theme, plus component styles
  lib/
    motion.ts              motion tokens, per-style hover presets, entrance variants
    design.tsx             theme and style state, storage and media-query hooks
    format.ts              number and currency formatting
  components/
    AppShell.tsx           responsive layout, topbar, keyboard shortcut, page transitions
    Sidebar.tsx            collapsible sidebar and mobile drawer
    Tooltip.tsx            rail tooltips
    Widgets.tsx            KPI card, count-up number, panel, button, theme toggle
    charts.tsx             shared chart styling, chart box and legend
    SwapGrid.tsx           drag-to-swap grid
    PageHeader.tsx         page title and the style switcher
  pages/
    Dashboard.tsx          KPIs, trend chart, recent applications
    Analytics.tsx          chart gallery
    Customers.tsx          customer list and profile card
```

## Customising

- **Colours, radius, shadows, fonts**: every component reads CSS variables from `src/index.css`. Each style has a light block (`:root[data-style='…']`) and a dark block (`…[data-theme='dark']`). Change the values there, or copy a block to add a new style.
- **Brand colour**: replace `--primary`, `--primary-solid`, `--primary-soft`, `--ring` and `--chart-1` in the style you use, then re-check text contrast.
- **Animation feel**: `src/lib/motion.ts` holds the springs and the hover preset per style; `DesignProvider` in `App.tsx` takes `intensity="subtle" | "expressive" | "playful"`.
- **Swap rules**: `SwapGrid` accepts `canSwap(a, b)` to limit which cards may trade places, `locked: true` on an item to pin a card, and `span` on an item to let a card keep its own size instead of the slot's.
- **Style switcher**: it is there for reviewing styles. For production, remove `<StyleSwitcher />` from `PageHeader.tsx` and set the style once in `App.tsx`.

## Stack

React 19, TypeScript, Vite, Tailwind CSS 4, Motion, Recharts, dnd-kit and Lucide icons.
