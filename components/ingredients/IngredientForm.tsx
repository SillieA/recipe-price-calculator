'use client';

import { useState } from 'react';
import { Ingredient, UNITS, UnitType } from '@/types';

interface IngredientFormProps {
  initial?: Ingredient;
  onSubmit: (values: Omit<Ingredient, 'id' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const unitTypeLabels: Record<UnitType, string> = {
  weight: 'Weight',
  volume: 'Volume',
  quantity: 'Quantity',
};

const unitGroups = (['weight', 'volume', 'quantity'] as UnitType[]).map(
  (type) => ({
    type,
    label: unitTypeLabels[type],
    units: UNITS.filter((u) => u.type === type),
  }),
);

export function IngredientForm({
  initial,
  onSubmit,
  onCancel,
}: IngredientFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [price, setPrice] = useState(
    initial ? String(initial.price) : '',
  );
  const [quantity, setQuantity] = useState(
    initial ? String(initial.quantity) : '',
  );
  const [unitId, setUnitId] = useState(initial?.unitId ?? 'g');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price);
    const quantityNum = parseFloat(quantity);

    if (!name.trim()) {
      setError('Please enter a name.');
      return;
    }
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError('Please enter a valid price.');
      return;
    }
    if (!Number.isFinite(quantityNum) || quantityNum <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }

    onSubmit({
      name: name.trim(),
      price: priceNum,
      quantity: quantityNum,
      unitId,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Ingredient name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Plain flour"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Price (£)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="1.50"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            step="any"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="1000"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Unit
          </label>
          <select
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            {unitGroups.map((group) => (
              <optgroup key={group.type} label={group.label}>
                {group.units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Tip: enter the package price and the amount it contains, e.g. £1.50 for
        1000&nbsp;g.
      </p>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {initial ? 'Save changes' : 'Add ingredient'}
        </button>
      </div>
    </form>
  );
}
