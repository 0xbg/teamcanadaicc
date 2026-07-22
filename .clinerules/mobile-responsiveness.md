## Brief overview
  - This rule file establishes that all web pages in this project MUST be responsive for mobile devices.
  - Every page, component, and layout must be tested and functional on viewports down to 320px width.
  - These guidelines are project-wide and apply to all HTML, CSS, and UI development work.

## Responsiveness Requirements
  - All pages must use the viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  - All text must be readable without horizontal scrolling at any viewport width (minimum 320px).
  - Touch targets (buttons, links, form inputs) must be at least 44x44px on mobile.
  - Forms must have adequate padding and readable font sizes on small screens (minimum 1rem for inputs).
  - Grid layouts must collapse to single-column on screens smaller than 640px.
  - Images must not overflow their containers and should use `max-width: 100%` or appropriate responsive classes.
  - Navigation must be accessible via a mobile-friendly hamburger menu or equivalent pattern on screens < 1024px.
  - Typography must scale down appropriately on mobile (headings, body text, etc.).
  - Padding and margins should be reduced on mobile to maximize usable screen space.
  - Modals, overlays, and popups must be fully visible and dismissible on mobile viewports.
  - Tailwind CSS responsive prefixes (sm:, md:, lg:, xl:) should be used consistently for breakpoint-based styling.
  - CSS media queries should follow a mobile-first approach where possible.
  - The site must be tested at 375px, 414px, 768px, and 1024px widths before being considered complete.

## Testing
  - Use browser DevTools responsive mode to test at common device widths.
  - Verify no horizontal overflow at any breakpoint.
  - Verify all interactive elements are usable with touch input.
  - Verify text contrast and readability on small screens.