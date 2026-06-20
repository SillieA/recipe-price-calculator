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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ingredients</h1>
          <p className="text-slate-500">
            Your ingredient library and their package prices.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 whitespace-nowrap"
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
        <IngredientForm
          initial={editing ?? undefined}
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
