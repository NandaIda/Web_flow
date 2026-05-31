# Product Requirements Document (PRD)

## Product Name: Full-Stack Decision Map & Stack Builder
**Product Vibe**: Precision System Configuration Blueprint (High Density Theme)  
**Host Environment**: Sandbox Node.js + Vite Client Container

---

## UI & Visual Theme Guidelines — High Density Design Theme

The interface uses a high-contrast, high-density visual theme:

- **Color Palette**: Off-white background canvas (`#F4F4F5`), deep charcoal headers (`#18181B`), sharp blue accents (`#2563EB`)
- **Typography**: Clean sans-serif for guidance text, compact monospace (`font-mono`) for specs, codes, and metadata rails
- **Layout Spacing**: Narrow vertical padding with high-density grids — users should see all key decisions without excessive scroll

### Font Size Rules

| Role | Size |
|------|------|
| Body / guidance text | 1rem (16px) minimum |
| Secondary / supporting text | 0.875rem (14px) |
| Labels, badges, metadata rails | 0.75rem (12px) — absolute floor |
| Fine print (copyrights, build refs) | 0.625rem (10px) — fine print only |

- **Use relative units** (`rem`/`em`) — never raw `px` for body text
- **Line height** minimum 1.5 (150%) on all body and guidance text
- **Text must zoom to 200%** without layout breakage (WCAG)
- **Subheadings** must be visually larger than body text
- Do not use `text-[10px]` or `text-[9px]` for anything a user needs to read — reserve for decorative metadata only
