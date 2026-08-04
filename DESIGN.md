---
name: Huoyb Selected Works
description: A daylight project gallery built as a steel-framed glass exhibition wall.
colors:
  cobalt-selection: "#2457ff"
  daylight-field: "#f4f7fb"
  mist-section: "#edf2f8"
  frost-pane: "rgba(255, 255, 255, 0.9)"
  graphite-ink: "#111823"
  slate-copy: "#667180"
  mullion-line: "#d6dde8"
typography:
  display:
    fontFamily: "Unbounded, Familjen Grotesk, sans-serif"
    fontSize: "clamp(58px, 6.2vw, 92px)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Familjen Grotesk, Noto Sans SC, sans-serif"
    fontSize: "clamp(34px, 4vw, 54px)"
    fontWeight: 560
    lineHeight: 1.08
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Familjen Grotesk, Noto Sans SC, sans-serif"
    fontSize: "clamp(42px, 5vw, 66px)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Familjen Grotesk, Noto Sans SC, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "9px"
    fontWeight: 400
    lineHeight: 1.2
rounded:
  control: "10px"
  caption: "12px"
  pane: "14px"
spacing:
  control-inset: "5px"
  compact: "12px"
  content: "18px"
  section-gutter: "32px"
components:
  project-selector:
    backgroundColor: "rgba(255, 255, 255, 0.72)"
    textColor: "{colors.slate-copy}"
    typography: "{typography.label}"
    rounded: "{rounded.pane}"
    padding: "{spacing.control-inset}"
  project-selector-active:
    backgroundColor: "#ffffff"
    textColor: "{colors.graphite-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
    height: "64px"
  project-pane:
    backgroundColor: "{colors.frost-pane}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.pane}"
    padding: "20px"
  project-link:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-ink}"
    typography: "{typography.label}"
    padding: "0 0 5px"
    height: "44px"
---

# Design System: Huoyb Selected Works

## Overview

**Creative North Star: "The Daylight Glass Gallery"**

The portfolio is an Experience surface: real project covers and working product evidence lead from the first viewport, while the interface recedes into a bright architectural frame. Its governing metaphor is a steel-framed glass exhibition wall—frosted white panes, graphite mullions, cobalt selection fields, and crisp soft-edged depth.

The mood is precise, spatial, and quietly technical rather than corporate or sales-led. Maker identity stays compact; project imagery carries the visual weight. Motion establishes selection and depth, never spectacle for its own sake.

The current release uses kinetic character reveals for the project heading and closing profile statement. These effects share the maker-name entrance timing language and collapse cleanly when reduced motion is requested.

**Key Characteristics:**
- Daylight blue-white fields with translucent white exhibition panes.
- One cobalt interface accent, reserved for selection, focus, progress, and spatial guides.
- Graphite typography and hairline structure instead of dark-console chrome.
- Real project covers and product captures as the dominant visual assets.
- Shallow 3D movement with complete reduced-motion and reduced-transparency fallbacks.

## Colors

The palette is a cool daylight neutral system with cobalt as its only interface accent; project artwork retains its native color.

### Primary
- **Cobalt Selection:** Marks active projects, progress, focus, link hover, canvas guides, and the maker monogram. Its rarity makes state changes immediate.

### Neutral
- **Daylight Field:** The hero and page ground; it keeps the Three.js covers luminous and legible.
- **Mist Section:** Separates the project gallery from the hero without introducing another hue family.
- **Frost Pane:** The translucent raised surface for project cases and mobile captions.
- **Graphite Ink:** Primary text and headings, chosen for crisp contrast against the light field.
- **Slate Copy:** Supporting descriptions, navigation, and metadata.
- **Mullion Line:** Hairlines and structural separators that evoke the glass-wall frame.

**The One Cobalt Rule.** Cobalt is the only interface accent. Do not sample project-cover colors into navigation, controls, or section chrome.

**The Artwork Autonomy Rule.** Product screenshots and covers keep their native palettes; interface color never recolors them.

## Typography

**Display Font:** Familjen Grotesk (with Noto Sans SC and sans-serif fallbacks)

**Body Font:** Familjen Grotesk (with Noto Sans SC and sans-serif fallbacks)
**Label/Mono Font:** JetBrains Mono (with monospace fallback)

**Character:** Familjen Grotesk keeps Chinese interface copy direct and contemporary. JetBrains Mono is reserved for technology names and factual notation rather than used as a blanket developer aesthetic.

### Hierarchy
- **Display:** The maker name only; tightly tracked and compact enough to leave visual authority to the project covers.
- **Headline:** Section-level statements such as “项目与界面” use the same character-by-character kinetic reveal as the closing profile statement.
- **Title:** Project names inside exhibition panes.
- **Body:** Project summaries and short factual descriptions; keep lines comfortably readable and avoid marketing paragraphs.
- **Label:** Project numbers, years, roles, stacks, and compact technical metadata.

**The Evidence Before Ornament Rule.** Type labels real work—project, role, stack, year, and status. It does not manufacture proof metrics or decorative system readouts.

## Layout

The first viewport is an asymmetric partition: maker identity and the active-project caption occupy the left, the spatial cover stage occupies the right, and project selectors sit on the lower edge. The header is capped at 1360px; the project gallery and closing profile statement share one continuous 1260px field with fluid side gutters. Project cases use a two-column story/surface composition and stack with restrained sticky depth on larger screens.

At 980px and below, project cases collapse to one column and spatial depth is reduced. At 760px, the Three.js scene switches to its compact camera and card scale. At 680px and below, the page becomes a single-column gallery: navigation becomes a glass menu, the active-project caption becomes a readable frosted pane, selectors share the width, device covers reduce, and project cases stop sticking. Minimum interactive targets remain 44px and horizontal overflow is not permitted.

**The Work-First Partition Rule.** Layout keeps one real project surface visible alongside maker identity in the first viewport. The kinetic profile statement follows the project cases inside the same gallery field, without a duplicate project index.

## Elevation & Depth

Depth is lifted but ambient. Frosted panes use diffuse blue-gray shadows, translucent fills, and selective backdrop blur; they do not add duplicate borders. Hairlines remain structural, while Three.js cards use a shallow arc, cobalt edge signals, and controlled opacity to show selection.

### Shadow Vocabulary
- **Selector Float** (`0 18px 54px rgba(54, 83, 128, .13)`): Lifts the frosted selector tray over the hero.
- **Selected Field** (`0 8px 22px rgba(54, 83, 128, .11)`): Separates the active white selector from its tray.
- **Exhibition Pane** (`0 34px 90px rgba(65, 88, 124, .14)`): Gives full project cases their soft architectural depth.
- **Inset Glass Edge** (`inset 0 1px 0 rgba(255,255,255,.8), 0 18px 45px rgba(49,75,116,.12)`): Defines device-display wells without a visible border.

Motion belongs to this depth system. The maker name enters by split character, the role resolves from blur, project planes advance and recede on selection, pointer input adds restrained parallax, and device surfaces tilt only on fine pointers. Continuous, scroll-linked, tilt, and depth transitions collapse under `prefers-reduced-motion`; translucent menus become opaque under `prefers-reduced-transparency`.

**The Soft Edge Rule.** Raised light surfaces use either an ambient shadow or a structural hairline for their role, not both as decorative framing.

## Shapes

Controls and display wells use gently rounded corners, with compact controls at the control radius, captions at the caption radius, and major glass surfaces at the pane radius. The recurring geometry is architectural rather than pill-shaped: rectangular panes, hairline mullions, square project fields, and thin cobalt guide lines. Circular forms are reserved for iconography or product screenshots, not portfolio chrome.

**The Pane, Not Pill Rule.** Keep portfolio controls compact and rectilinear; do not turn selectors, links, or metadata into floating capsules.

## Components

### Project Selectors

The selector is a frosted two-item tray anchored to the hero’s lower edge. Each button exposes number, Chinese name, and Chinese category, uses a 64px desktop target, and communicates state with `aria-pressed`. Hover and active states become an opaque white field with an ambient shadow; project number remains cobalt. On mobile, both controls share the available width.

### Project Panes

Project cases are translucent white exhibition panes holding factual story content beside a real cover and mobile capture. They are borderless, softly elevated, and large enough for the artifacts to lead. Metadata is separated by hairlines; the visual well uses an inset glass edge. On coarse pointers and reduced motion, hover-only device focus is disabled.

### Direct Project Links

Links are plain, factual actions with a right arrow and at least a 44px target. Hover increases the arrow gap and shifts the text to cobalt; links do not become oversized call-to-action buttons.

### Navigation

Desktop navigation is a quiet text row whose hover state draws a thin cobalt underline. Mobile navigation becomes an opaque or translucent white menu with the same hierarchy and a 42px icon trigger; visible focus uses cobalt.

### Spatial Cover Stage

The signature canvas contains only the two real project covers. The active cover advances to full opacity while the alternate moves laterally, rotates on the shallow arc, and recedes. Dragging past the interaction threshold or using the semantic selectors updates the same active state. The canvas is decorative to assistive technology; all selection and project access remain available in HTML controls and links.

## Do's and Don'ts

### Do:
- **Do** let real covers and product captures dominate the first viewport and project panes.
- **Do** reserve cobalt for state, focus, progress, links, and spatial guidance.
- **Do** keep maker identity compact and place factual project context immediately beside it.
- **Do** preserve visible keyboard focus, semantic selector state, 44px targets, real alt text, and motion/transparency fallbacks.
- **Do** preserve public routes and direct links to working projects and prototypes.

### Don't:
- **Don't** add sales slogans, simulated commercial metrics, service-company claims, or conversion language.
- **Don't** turn the gallery back into a dark technical console or add decorative terminal metadata.
- **Don't** recolor project artwork to match the portfolio accent.
- **Don't** surround every element with a card, border, or shadow; depth is selective and architectural.
- **Don't** let 3D interaction become the only way to select or enter a project.
