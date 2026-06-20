'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Recipe } from '@/types';
import { useAppData } from '@/components/AppDataProvider';
import { Modal } from '@/components/Modal';
import { RecipeForm } from '@/components/recipes/RecipeForm';
import { RecipeList } from '@/components/recipes/RecipeList';

export default function RecipesPage() {
  const { data, hydrated, addRecipe, updateRecipe, deleteRecipe } =
    useAppData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Recipe | null>(null);

  const allTags = Array.from(
    new Set(data.recipes.flatMap((r) => r.tags ?? [])),
  ).sort();

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (recipe: Recipe) => {
    setEditing(recipe);
    setModalOpen(true);
  };

  const handleSubmit = (values: Omit<Recipe, 'id' | 'updatedAt'>) => {
    if (editing) {
      updateRecipe(editing.id, values);
    } else {
      addRecipe(values);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = (recipe: Recipe) => {
    if (window.confirm(`Delete recipe "${recipe.name}"?`)) {
      deleteRecipe(recipe.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Recipes</h1>
          <p className="text-slate-500">
            Costs and profit margins based on your ingredient prices.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="px-4 py-2 rounded-md text-sm font-medium bg-brand text-white hover:bg-brand-hover whitespace-nowrap"
        >
          + Add recipe
        </button>
      </div>

      {data.ingredients.length === 0 && hydrated && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md px-4 py-3 text-sm">
          You have no ingredients yet. Add some on the{' '}
          <Link href="/ingredients" className="font-medium underline">
            Ingredients
          </Link>{' '}
          page first.
        </div>
      )}

      {!hydrated ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <RecipeList
          recipes={data.recipes}
          ingredients={data.ingredients}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit recipe' : 'Add recipe'}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        <RecipeForm
          initial={editing ?? undefined}
          ingredients={data.ingredients}
          existingTags={allTags}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      </Modal>
    </div>
  );
}
