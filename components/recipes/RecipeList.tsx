'use client';

import { useMemo, useState } from 'react';
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
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<
    'name-asc' | 'name-desc' | 'updated-asc' | 'updated-desc'
  >('name-asc');

  const normalizedSearch = search.trim().toLowerCase();
  const filteredAndSorted = useMemo(() => {
    const filtered = recipes.filter((recipe) => {
      if (!normalizedSearch) return true;
      const notes = recipe.notes?.toLowerCase() ?? '';
      const tagMatch =
        recipe.tags?.some((tag) =>
          tag.toLowerCase().includes(normalizedSearch),
        ) ?? false;
      return (
        recipe.name.toLowerCase().includes(normalizedSearch) ||
        notes.includes(normalizedSearch) ||
        tagMatch
      );
    });
    return filtered.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      const aTime = Date.parse(a.updatedAt);
      const bTime = Date.parse(b.updatedAt);
      if (!Number.isFinite(aTime) || !Number.isFinite(bTime)) {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'updated-asc') return aTime - bTime;
      return bTime - aTime;
    });
  }, [recipes, normalizedSearch, sortBy]);

  if (recipes.length === 0) {
    return (
      <div className="bg-surface rounded-md border border-dashed border-brand-border p-10 text-center">
        <p className="text-slate-500">
          No recipes yet. Create a recipe to see its cost and profit margin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search recipes..."
          className="w-full sm:flex-1 rounded-md border border-brand-border px-3 py-2 text-foreground focus:border-brand focus:ring-1 focus:ring-brand outline-none bg-surface"
        />
        <select
          value={sortBy}
          onChange={(event) =>
            setSortBy(event.target.value as typeof sortBy)
          }
          className="w-full sm:w-60 rounded-md border border-brand-border px-3 py-2 text-foreground focus:border-brand focus:ring-1 focus:ring-brand outline-none bg-surface"
        >
          <option value="name-asc">Name (A → Z)</option>
          <option value="name-desc">Name (Z → A)</option>
          <option value="updated-asc">Updated (oldest first)</option>
          <option value="updated-desc">Updated (newest first)</option>
        </select>
      </div>
      {filteredAndSorted.length === 0 ? (
        <div className="bg-surface rounded-md border border-dashed border-brand-border p-10 text-center">
          <p className="text-slate-500">No recipes match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAndSorted.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              ingredients={ingredients}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
