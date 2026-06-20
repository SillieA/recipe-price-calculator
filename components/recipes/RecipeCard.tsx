'use client';

import { Ingredient, Recipe } from '@/types';
import {
  calculateRecipe,
  formatCurrency,
  formatNumber,
  unitLabel,
} from '@/lib/calculations';

interface RecipeCardProps {
  recipe: Recipe;
  ingredients: Ingredient[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
}

export function RecipeCard({
  recipe,
  ingredients,
  onEdit,
  onDelete,
}: RecipeCardProps) {
  const result = calculateRecipe(recipe, ingredients);
  const profitable = result.profit >= 0;
  const updatedAt = new Date(recipe.updatedAt);
  const updatedLabel = Number.isNaN(updatedAt.getTime())
    ? 'Unknown'
    : updatedAt.toLocaleString();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-lg text-slate-900">
            {recipe.name}
          </h3>
          <p className="text-sm text-slate-500">
            Makes {formatNumber(recipe.yieldsQuantity)} {recipe.yieldUnit}
          </p>
        </div>
        <div
          className={`text-right ${
            profitable ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          <div className="text-xl font-bold">
            {formatNumber(result.marginPct)}%
          </div>
          <div className="text-xs">margin</div>
        </div>
      </div>

      <div className="border border-slate-100 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-left">
              <th className="px-3 py-2 font-medium">Ingredient</th>
              <th className="px-3 py-2 font-medium text-right">Qty</th>
              <th className="px-3 py-2 font-medium text-right">Cost</th>
            </tr>
          </thead>
          <tbody>
            {result.lineItems.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-3 py-3 text-center text-slate-400"
                >
                  No ingredients added.
                </td>
              </tr>
            )}
            {result.lineItems.map((item, index) => (
              <tr key={index} className="border-t border-slate-100">
                <td className="px-3 py-2 text-slate-700">
                  {item.ingredientName}
                  {item.error && (
                    <span
                      className="ml-1 text-amber-600"
                      title={item.error}
                    >
                      ⚠
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-right text-slate-500">
                  {formatNumber(item.quantity)} {unitLabel(item.unitId)}
                </td>
                <td className="px-3 py-2 text-right text-slate-700">
                  {item.error ? '—' : formatCurrency(item.cost)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result.hasErrors && (
        <p className="text-xs text-amber-600">
          ⚠ Some ingredient costs could not be calculated (unit mismatch or
          missing data).
        </p>
      )}

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <dt className="text-slate-500">Total ingredient cost</dt>
        <dd className="text-right font-medium text-slate-900">
          {formatCurrency(result.totalCost)}
        </dd>

        <dt className="text-slate-500">Cost per {recipe.yieldUnit || 'unit'}</dt>
        <dd className="text-right text-slate-700">
          {formatCurrency(result.costPerUnit)}
        </dd>

        <dt className="text-slate-500">
          Sale price each
          {recipe.isVatRated && (
            <span className="ml-1 text-xs text-slate-400">(incl. VAT)</span>
          )}
        </dt>
        <dd className="text-right text-slate-700">
          {formatCurrency(recipe.salePrice)}
        </dd>

        <dt className="text-slate-500">Revenue / batch</dt>
        <dd className="text-right text-slate-700">
          {formatCurrency(result.grossRevenue)}
        </dd>

        {recipe.isVatRated && (
          <>
            <dt className="text-slate-500">VAT (20%)</dt>
            <dd className="text-right text-slate-700">
              {formatCurrency(result.vatAmount)}
            </dd>
            <dt className="text-slate-500">Net revenue / batch</dt>
            <dd className="text-right text-slate-700">
              {formatCurrency(result.netRevenue)}
            </dd>
          </>
        )}
      </dl>

      <div
        className={`flex items-center justify-between rounded-lg px-4 py-3 ${
          profitable
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-red-50 text-red-700'
        }`}
      >
        <span className="font-medium">
          {profitable ? 'Profit / batch' : 'Loss / batch'}
        </span>
        <span className="font-bold">{formatCurrency(result.profit)}</span>
      </div>

      {recipe.notes && (
        <p className="text-sm text-slate-500">{recipe.notes}</p>
      )}

      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500">Last updated: {updatedLabel}</p>

      <div className="flex gap-2 pt-1 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onEdit(recipe)}
          className="flex-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 py-1"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(recipe)}
          className="flex-1 text-sm font-medium text-red-600 hover:text-red-800 py-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
