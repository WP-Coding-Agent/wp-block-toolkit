# WP Block Toolkit

Production Gutenberg blocks demonstrating advanced patterns: server-side rendering, dynamic data binding, InnerBlocks composition, and PHP-based conditional visibility.

## Blocks

### Data Table (`developer/data-table`)

Dynamically queries any post type and renders results as a responsive, accessible `<table>`. Entirely server-side rendered — no static save, uses `render_callback`.

**Patterns demonstrated:**
- `ServerSideRender` for live editor preview of dynamic blocks
- Query builder UI in InspectorControls (add/remove filter rows)
- Taxonomy and meta query support via `WP_Query`
- ARIA roles for accessible tables

### Card Grid (`developer/card-grid`) + Card (`developer/card`)

A composable two-block system. The grid block controls layout, the card block handles content. Cards can only be inserted inside a grid.

**Patterns demonstrated:**
- `useInnerBlocksProps` with `allowedBlocks` constraint
- `parent` block registration to enforce nesting
- CSS custom properties driven by block attributes (`--grid-columns`, `--grid-gap`)
- `MediaUpload` for image selection
- Responsive CSS Grid with `auto-fill` + `minmax()`

### Conditional Content (`developer/conditional`)

Show or hide inner content based on runtime conditions: user role, login status, date range, or any custom PHP filter. The visibility check runs server-side in `render_callback` — content never leaks in page source.

**Patterns demonstrated:**
- `InnerBlocks` for arbitrary nested content
- Server-side visibility gating (not just CSS `display: none`)
- Custom PHP filter hook (`developer_conditional_check`) for extensibility
- Input sanitization: filter names validated against `[a-zA-Z_][a-zA-Z0-9_]*` to prevent injection

**Custom condition example:**
```php
// In your theme's functions.php:
add_filter('my_promo_active', function () {
    return get_option('holiday_promo_enabled') === 'yes';
});
// Then select "Custom PHP filter" in the block and enter: my_promo_active
```

## Installation

```bash
cd wp-content/plugins/wp-block-toolkit
npm install && npm run build
```

Activate the plugin. All three blocks appear in the block inserter.

## License

GPL-2.0-or-later
