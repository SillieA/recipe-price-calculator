'use client';

import { Ingredient, getUnit } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/calculations';

interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (ingredient: Ingredient) => void;
}

export function IngredientCard({
  ingredient,
  onEdit,
  onDelete,
}: IngredientCardProps) {
  const unit = getUnit(ingredient.unitId);
  const unitShort = unit?.label.split(' ')[0] ?? ingredient.unitId;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900">{ingredient.name}</h3>
          {unit && (
            <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
              {unit.type}
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-slate-900">
            {formatCurrency(ingredient.price)}
          </div>
          <div className="text-xs text-slate-500">
            per {formatNumber(ingredient.quantity)} {unitShort}
          </div>
        </div>
      </div>

      {ingredient.notes && (
        <p className="text-sm text-slate-500">{ingredient.notes}</p>
      )}

      <div className="flex gap-2 pt-1 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onEdit(ingredient)}
          className="flex-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 py-1"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(ingredient)}
          className="flex-1 text-sm font-medium text-red-600 hover:text-red-800 py-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
