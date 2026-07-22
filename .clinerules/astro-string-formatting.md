## Brief overview
  - This rule file establishes that string literals in Astro templates must use proper escaping to prevent text truncation issues.
  - These guidelines are project-wide and apply to all `.astro` files.

## String Literal Formatting
  - Always enclose string literals containing apostrophes, single quotes, or special characters in curly braces with backticks `{`text`}` inside Astro templates, or use double quotes `"..."` for JSX/HTML props, to prevent text truncation issues.

## Astro HTML Templates
  - Wrap raw text containing apostrophes or troublesome symbols using curly braces and backticks: `{`My text with an apostrophe`}`.
  - Example: `<p>It{`'`}s a great day</p>` — or better: `<p>{`It's a great day`}</p>`

## HTML Attributes / Props
  - Ensure attributes (such as `alt`, `title`, `placeholder`, `description`, etc.) containing apostrophes are properly enclosed in double quotes `"..."` instead of single quotes `'...'`.
  - Example: `<img alt="Team Canada's logo" />` instead of `<img alt='Team Canada's logo' />`

## Verification
  - Run `npm run build` or `npx astro check` after making changes to confirm that all templates compile cleanly without syntax errors.