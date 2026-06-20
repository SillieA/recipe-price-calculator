'use client';

import { useState } from 'react';
import {
  Ingredient,
  Recipe,
  RecipeIngredient,
  UNITS,
  getUnit,
} from '@/types';
import { TagInput } from '@/components/TagInput';
import { Tooltip } from '@/components/Tooltip';

interface RecipeFormProps {
  initial?: Recipe;
  ingredients: Ingredient[];
  existingTags?: string[];
  onSubmit: (values: Omit<Recipe, 'id' | 'updatedAt'>) => void;
  onCancel: () => void;
}

interface LineDraft {
  ingredientId: string;
  quantity: string;
  unitId: string;
}

const unitsForIngredient = (ingredient: Ingredient | undefined) => {
  if (!ingredient) return UNITS;
  const unit = getUnit(ingredient.unitId);
  if (!unit) return UNITS;
  return UNITS.filter((u) => u.type === unit.type);
};

export function RecipeForm({
  initial,
  ingredients,
  existingTags = [],
  onSubmit,
  onCancel,
}: RecipeFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [yieldsQuantity, setYieldsQuantity] = useState(
    initial ? String(initial.yieldsQuantity) : '1',
  );
  const [yieldUnit, setYieldUnit] = useState(initial?.yieldUnit ?? 'units');
  const [salePrice, setSalePrice] = useState(
    initial ? String(initial.salePrice) : '',
  );
  const [isVatRated, setIsVatRated] = useState(initial?.isVatRated ?? false);
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [lines, setLines] = useState<LineDraft[]>(
    initial?.ingredients.map((line) => ({
      ingredientId: line.ingredientId,
      quantity: String(line.quantity),
      unitId: line.unitId,
    })) ?? [],
  );
  const [error, setError] = useState<string | null>(null);

  const addLine = () => {
    const first = ingredients[0];
    setLines((prev) => [
      ...prev,
      {
        ingredientId: first?.id ?? '',
        quantity: '',
        unitId: first ? first.unitId : 'g',
      },
    ]);
  };

  const removeLine = (index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, patch: Partial<LineDraft>) => {
    setLines((prev) =>
      prev.map((line, i) => {
        if (i !== index) return line;
        const next = { ...line, ...patch };
        // When the ingredient changes, default the unit to a compatible one.
        if (patch.ingredientId) {
          const ingredient = ingredients.find(
            (ing) => ing.id === patch.ingredientId,
          );
          const allowed = unitsForIngredient(ingredient);
          if (!allowed.some((u) => u.id === next.unitId)) {
            next.unitId = ingredient?.unitId ?? allowed[0]?.id ?? next.unitId;
          }
        }
        return next;
      }),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const yieldNum = parseFloat(yieldsQuantity);
    const saleNum = parseFloat(salePrice);

    if (!name.trim()) {
      setError('Please enter a recipe name.');
      return;
    }
    if (!Number.isFinite(yieldNum) || yieldNum <= 0) {
      setError('Please enter how many units this recipe produces.');
      return;
    }
    if (!Number.isFinite(saleNum) || saleNum < 0) {
      setError('Please enter a valid sale price.');
      return;
    }

    const parsedLines: RecipeIngredient[] = [];
    for (const line of lines) {
      if (!line.ingredientId) {
        setError('Every ingredient row must select an ingredient.');
        return;
      }
      const qty = parseFloat(line.quantity);
      if (!Number.isFinite(qty) || qty <= 0) {
        setError('Every ingredient row needs a valid quantity.');
        return;
      }
      parsedLines.push({
        ingredientId: line.ingredientId,
        quantity: qty,
        unitId: line.unitId,
      });
    }

    onSubmit({
      name: name.trim(),
      ingredients: parsedLines,
      yieldsQuantity: yieldNum,
      yieldUnit: yieldUnit.trim() || 'units',
      salePrice: saleNum,
      isVatRated,
      notes: notes.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });
  };

  const inputClass =
    'w-full rounded-md border border-brand-border px-3 py-2 text-foreground focus:border-brand focus:ring-1 focus:ring-brand outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          <span className="inline-flex items-center gap-1.5">
            Recipe name
            <Tooltip text="A descriptive name for this recipe, e.g. 'Sourdough loaf' or 'Chocolate cupcakes'." />
          </span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sourdough loaf"
          className={inputClass}
          autoFocus
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              Ingredients
              <Tooltip text="The ingredients used in this recipe and the quantities needed. Costs update automatically whenever an ingredient's price is changed." />
            </span>
          </label>
          <button
            type="button"
            onClick={addLine}
            disabled={ingredients.length === 0}
            className="text-sm font-medium text-brand hover:text-brand-dark disabled:text-slate-300 disabled:cursor-not-allowed"
          >
            + Add ingredient
          </button>
        </div>

        {ingredients.length === 0 ? (
          <p className="text-sm text-slate-500 bg-surface-subtle border border-brand-border rounded-md p-3">
            Add ingredients to your library first, then include them here.
          </p>
        ) : lines.length === 0 ? (
          <p className="text-sm text-slate-500 bg-surface-subtle border border-brand-border rounded-md p-3">
            No ingredients added yet.
          </p>
        ) : (
          <div className="space-y-2">
            {lines.map((line, index) => {
              const ingredient = ingredients.find(
                (ing) => ing.id === line.ingredientId,
              );
              const allowedUnits = unitsForIngredient(ingredient);
              return (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 items-center"
                >
                  <select
                    value={line.ingredientId}
                    onChange={(e) =>
                      updateLine(index, { ingredientId: e.target.value })
                    }
                    className={`${inputClass} col-span-6 bg-surface`}
                  >
                    {ingredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={line.quantity}
                    onChange={(e) =>
                      updateLine(index, { quantity: e.target.value })
                    }
                    placeholder="Qty"
                    className={`${inputClass} col-span-2`}
                  />
                  <select
                    value={line.unitId}
                    onChange={(e) =>
                      updateLine(index, { unitId: e.target.value })
                    }
                    className={`${inputClass} col-span-3 bg-surface`}
                  >
                    {allowedUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.label.split(' ')[0]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeLine(index)}
                    className="col-span-1 text-red-500 hover:text-red-700 text-xl leading-none"
                    aria-label="Remove ingredient"
                  >
                    &times;
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            <span className="inline-flex items-center gap-1.5">
              Yields (qty)
              <Tooltip text="How many individual units this recipe produces in one batch, e.g. 12 for a dozen cupcakes or 1 for a single loaf." />
            </span>
          </label>
          <input
            type="number"
            step="any"
            min="0"
            value={yieldsQuantity}
            onChange={(e) => setYieldsQuantity(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            <span className="inline-flex items-center gap-1.5">
              Yield unit
              <Tooltip text="What each unit produced is called, e.g. 'loaves', 'cookies', or 'jars'. Used for display purposes only." />
            </span>
          </label>
          <input
            type="text"
            value={yieldUnit}
            onChange={(e) => setYieldUnit(e.target.value)}
            placeholder="loaves"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            <span className="inline-flex items-center gap-1.5">
              Sale price each (£)
              <Tooltip text="The price you sell each unit for. The calculator uses this to work out your profit margin per batch." />
            </span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            placeholder="3.50"
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={isVatRated}
          onChange={(e) => setIsVatRated(e.target.checked)}
          className="h-4 w-4 rounded border-brand-border text-brand focus:ring-brand"
        />
        <span className="inline-flex items-center gap-1.5">
          VAT rated (sale price includes 20% UK VAT)
          <Tooltip text="Tick this if the product is standard-rated for UK VAT. The calculator will strip VAT from the sale price before computing your margin." />
        </span>
      </label>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          <span className="inline-flex items-center gap-1.5">
            Notes (optional)
            <Tooltip text="Any extra details about this recipe, such as preparation tips, serving suggestions, or storage instructions." />
          </span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          <span className="inline-flex items-center gap-1.5">
            Tags (optional)
            <Tooltip text="Labels to organise recipes. Tags are searchable — type a tag name in the search box on the Recipes page to filter by it." />
          </span>
        </label>
        <TagInput tags={tags} onChange={setTags} suggestions={existingTags} />
        <p className="mt-1 text-xs text-slate-500">
          Press Enter or comma to add a tag.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md text-sm font-medium border border-brand-border text-slate-600 hover:bg-surface-subtle"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md text-sm font-medium bg-brand text-white hover:bg-brand-hover"
        >
          {initial ? 'Save changes' : 'Add recipe'}
        </button>
      </div>
    </form>
  );
}
