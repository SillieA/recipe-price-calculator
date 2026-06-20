'use client';

import Link from 'next/link';
import { useAppData } from '@/components/AppDataProvider';
import { calculateRecipe, formatCurrency, formatNumber } from '@/lib/calculations';

export default function Home() {
  const { data, hydrated } = useAppData();

  const results = data.recipes.map((recipe) => ({
    recipe,
    result: calculateRecipe(recipe, data.ingredients),
  }));

  const avgMargin =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.result.marginPct, 0) /
        results.length
      : 0;

  const best = [...results].sort(
    (a, b) => b.result.marginPct - a.result.marginPct,
  );

  const stats = [
    { label: 'Ingredients', value: data.ingredients.length, href: '/ingredients' },
    { label: 'Recipes', value: data.recipes.length, href: '/recipes' },
    {
      label: 'Avg. margin',
      value: `${formatNumber(avgMargin)}%`,
      href: '/recipes',
    },
  ];

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-brand to-brand-hover rounded-md text-white p-8">
        <h1 className="text-3xl font-bold font-heading">Recipe Price Calculator</h1>
        <p className="mt-2 max-w-2xl text-white/80">
          Track ingredient costs, work out your cost price, sale price and
          profit margin per batch &mdash; with UK VAT support. Everything is
          saved in your browser.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/ingredients"
            className="px-4 py-2 rounded-md bg-white text-brand-dark font-medium hover:bg-brand-light"
          >
            Manage ingredients
          </Link>
          <Link
            href="/recipes"
            className="px-4 py-2 rounded-md bg-white/20 border border-white/40 text-white font-medium hover:bg-white/30"
          >
            View recipes
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-surface rounded-md border border-brand-border shadow-sm p-5 hover:border-brand transition-colors"
          >
            <div className="text-sm text-slate-500">{stat.label}</div>
            <div className="text-3xl font-bold text-foreground mt-1">
              {hydrated ? stat.value : '—'}
            </div>
          </Link>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-foreground font-heading">
            Recipe margins
          </h2>
          <Link
            href="/recipes"
            className="text-sm font-medium text-brand hover:text-brand-dark"
          >
            View all
          </Link>
        </div>

        {!hydrated ? (
          <p className="text-slate-400">Loading…</p>
        ) : best.length === 0 ? (
          <div className="bg-surface rounded-md border border-dashed border-brand-border p-8 text-center text-slate-500">
            No recipes yet. Create one to see profit margins here.
          </div>
        ) : (
          <div className="bg-surface rounded-md border border-brand-border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-subtle text-slate-500 text-left">
                  <th className="px-4 py-3 font-medium">Recipe</th>
                  <th className="px-4 py-3 font-medium text-right">Cost</th>
                  <th className="px-4 py-3 font-medium text-right">
                    Profit / batch
                  </th>
                  <th className="px-4 py-3 font-medium text-right">Margin</th>
                </tr>
              </thead>
              <tbody>
                {best.map(({ recipe, result }) => (
                  <tr key={recipe.id} className="border-t border-brand-border">
                    <td className="px-4 py-3 text-slate-800 font-medium">
                      {recipe.name}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatCurrency(result.totalCost)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        result.profit >= 0
                          ? 'text-emerald-600'
                          : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(result.profit)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        result.profit >= 0
                          ? 'text-emerald-600'
                          : 'text-red-600'
                      }`}
                    >
                      {formatNumber(result.marginPct)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
