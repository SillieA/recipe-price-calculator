'use client';

import { Ingredient, Recipe } from '@/types';
import { RecipeCard } from './RecipeCard';

interface RecipeListProps {
  recipes: Recipe[];
  ingredients: Ingredient[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
}

export function RecipeList({
  recipes,
  ingredients,
  onEdit,
  onDelete,
}: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
        <p className="text-slate-500">
          No recipes yet. Create a recipe to see its cost and profit margin.
        </p>
      </div>
    );
  }

  const sorted = [...recipes].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {sorted.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          ingredients={ingredients}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
