'use client';

import { useState } from 'react';
import { Ingredient } from '@/types';
import { useAppData } from '@/components/AppDataProvider';
import { Modal } from '@/components/Modal';
import { IngredientForm } from '@/components/ingredients/IngredientForm';
import { IngredientList } from '@/components/ingredients/IngredientList';

export default function IngredientsPage() {
  const {
    data,
    hydrated,
    addIngredient,
    updateIngredient,
    deleteIngredient,
  } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);

  const allTags = Array.from(
    new Set(data.ingredients.flatMap((ing) => ing.tags ?? [])),
  ).sort();

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (ingredient: Ingredient) => {
    setEditing(ingredient);
    setModalOpen(true);
  };
  const handleSubmit = (values: Omit<Ingredient, 'id' | 'updatedAt'>) => {
    if (editing) {
      updateIngredient(editing.id, values);
    } else {
      addIngredient(values);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = (ingredient: Ingredient) => {
    if (
      window.confirm(
        `Delete "${ingredient.name}"? It will also be removed from any recipes.`,
      )
    ) {
      deleteIngredient(ingredient.id);
    }
  };

  const affectedRecipes = editing
    ? data.recipes.filter((r) =>
        r.ingredients.some((ri) => ri.ingredientId === editing.id),
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Ingredients</h1>
          <p className="text-slate-500">
            Your ingredient library and their package prices.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="px-4 py-2 rounded-md text-sm font-medium bg-brand text-white hover:bg-brand-hover whitespace-nowrap"
        >
          + Add ingredient
        </button>
      </div>

      {!hydrated ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <IngredientList
          ingredients={data.ingredients}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit ingredient' : 'Add ingredient'}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        {editing && affectedRecipes.length > 0 && (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <p className="font-medium">
              Updating this ingredient will affect{' '}
              {affectedRecipes.length === 1
                ? '1 recipe'
                : `${affectedRecipes.length} recipes`}{' '}
              that use it:
            </p>
            <ul className="mt-1.5 ml-4 list-disc space-y-0.5">
              {affectedRecipes.map((r) => (
                <li key={r.id}>{r.name}</li>
              ))}
            </ul>
            <p className="mt-2 text-amber-700">
              Costs for those recipes will update automatically.
            </p>
          </div>
        )}
        <IngredientForm
          initial={editing ?? undefined}
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
