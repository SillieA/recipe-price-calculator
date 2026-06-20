'use client';

import { Ingredient } from '@/types';
import { IngredientCard } from './IngredientCard';

interface IngredientListProps {
  ingredients: Ingredient[];
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (ingredient: Ingredient) => void;
}

export function IngredientList({
  ingredients,
  onEdit,
  onDelete,
}: IngredientListProps) {
  if (ingredients.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
        <p className="text-slate-500">
          No ingredients yet. Add your first ingredient to get started.
        </p>
      </div>
    );
  }

  const sorted = [...ingredients].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sorted.map((ingredient) => (
        <IngredientCard
          key={ingredient.id}
          ingredient={ingredient}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
