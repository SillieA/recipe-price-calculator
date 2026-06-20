'use client';

import { useMemo, useState } from 'react';
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
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<
    'name-asc' | 'name-desc' | 'updated-asc' | 'updated-desc'
  >('name-asc');

  if (ingredients.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
        <p className="text-slate-500">
          No ingredients yet. Add your first ingredient to get started.
        </p>
      </div>
    );
  }

  const normalizedSearch = search.trim().toLowerCase();
  const filteredAndSorted = useMemo(() => {
    const filtered = ingredients.filter((ingredient) => {
      if (!normalizedSearch) return true;
      const notes = ingredient.notes?.toLowerCase() ?? '';
      return (
        ingredient.name.toLowerCase().includes(normalizedSearch) ||
        notes.includes(normalizedSearch)
      );
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      const aTime = Date.parse(a.updatedAt);
      const bTime = Date.parse(b.updatedAt);
      if (!Number.isFinite(aTime) || !Number.isFinite(bTime)) return 0;
      if (sortBy === 'updated-asc') return aTime - bTime;
      return bTime - aTime;
    });
  }, [ingredients, normalizedSearch, sortBy]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search ingredients..."
          className="w-full sm:flex-1 rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
        />
        <select
          value={sortBy}
          onChange={(event) =>
            setSortBy(event.target.value as typeof sortBy)
          }
          className="w-full sm:w-60 rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
        >
          <option value="name-asc">Name (A → Z)</option>
          <option value="name-desc">Name (Z → A)</option>
          <option value="updated-asc">Updated (oldest first)</option>
          <option value="updated-desc">Updated (newest first)</option>
        </select>
      </div>
      {filteredAndSorted.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-slate-500">No ingredients match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSorted.map((ingredient) => (
            <IngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
