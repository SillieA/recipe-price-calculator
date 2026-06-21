# Recipe Price Calculator

A Next.js static site for working out the cost price, sale price and profit
margin of recipes based on ingredient costs. All data is stored locally in your
browser (localStorage) — no backend required.

## Features

- **Ingredient library** – add/edit/delete ingredients with a package price,
  amount and unit. Supports metric and imperial weight (g, kg, oz, lbs), volume
  (ml, L, fl oz, cup, tbsp, tsp) and count units (each, dozen).
- **Recipes** – build recipes from ingredients with quantities, set the yield
  (how many units are produced) and the sale price per unit.
- **Costing** – ingredient costs are converted to a common base unit and priced
  proportionally, so updating an ingredient price automatically updates every
  recipe that uses it.
- **Profit & VAT** – toggle 20% UK VAT per recipe; cards show cost price, sale
  price (incl. VAT note), revenue, profit/loss per batch and profit margin %.
- **Export / Import** – download all data as JSON and restore it later.

## Tech stack

- Next.js (App Router) with TypeScript
- Tailwind CSS
- Static export (`output: 'export'`)
- Browser `localStorage` for persistence

## Getting started

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

This project targets Node.js 24 and pnpm 11.8.0.

## Build (static export)

```bash
pnpm build
```

The static site is generated into the `out/` directory and can be served by any
static host.

## Cost calculation

For an ingredient priced per package, the cost used in a recipe is:

```
cost = (recipe_qty_in_base / package_qty_in_base) * package_price
```

Example: flour at £1.50 per 1&nbsp;kg used as 250&nbsp;g →
`(250 / 1000) * 1.50 = £0.375`.

## Profit margin

```
gross_revenue = sale_price * yield
net_revenue   = vat_rated ? gross_revenue / 1.20 : gross_revenue
profit        = net_revenue - total_ingredient_cost
margin_%      = profit / net_revenue * 100
```
