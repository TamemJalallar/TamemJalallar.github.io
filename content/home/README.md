# Homepage Content (MDX-backed)

This folder is a lightweight file-based content source for the homepage.

## Format
Each `.mdx` file uses JSON frontmatter between `---` markers.

Example:

```mdx
---
{
  "title": "Section title",
  "items": []
}
---
Optional markdown body text.
```

## Files
- `services.mdx`
- `case-studies.mdx`
- `testimonials.mdx`

The loader lives in `/lib/content/home-content.ts`.
