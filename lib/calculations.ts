import {
  Ingredient,
  Recipe,
  RecipeIngredient,
  UNITS,
  VAT_RATE,
  getUnit,
} from '@/types';

export interface IngredientCostResult {
  cost: number;
  error?: string;
  ingredientName: string;
  quantity: number;
  unitId: string;
}

export interface RecipeCostResult {
  lineItems: IngredientCostResult[];
  totalCost: number;
  hasErrors: boolean;
  // revenue & margin
  grossRevenue: number; // salePrice * yield (incl. VAT if rated)
  netRevenue: number; // VAT-excluded revenue
  vatAmount: number;
  profit: number;
  marginPct: number;
  costPerUnit: number;
}

/**
 * Calculate the cost contribution of a single recipe ingredient line.
 * Converts both the ingredient package amount and the required amount to a
 * shared base unit and prices the required portion proportionally.
 */
export function calculateIngredientCost(
  line: RecipeIngredient,
  ingredient: Ingredient | undefined,
): IngredientCostResult {
  if (!ingredient) {
    return {
      cost: 0,
      error: 'Ingredient not found',
      ingredientName: 'Unknown ingredient',
      quantity: line.quantity,
      unitId: line.unitId,
    };
  }

  const base = {
    cost: 0,
    ingredientName: ingredient.name,
    quantity: line.quantity,
    unitId: line.unitId,
  };

  const ingredientUnit = getUnit(ingredient.unitId);
  const recipeUnit = getUnit(line.unitId);

  if (!ingredientUnit || !recipeUnit) {
    return { ...base, error: 'Unknown unit' };
  }

  if (ingredientUnit.type !== recipeUnit.type) {
    return {
      ...base,
      error: `Cannot convert ${recipeUnit.label} to ${ingredientUnit.label}`,
    };
  }

  if (!ingredient.quantity || ingredient.quantity <= 0) {
    return { ...base, error: 'Ingredient package amount is zero' };
  }

  const ingredientBase = ingredient.quantity * ingredientUnit.toBase;
  const recipeBase = line.quantity * recipeUnit.toBase;

  if (ingredientBase <= 0) {
    return { ...base, error: 'Invalid ingredient amount' };
  }

  const cost = (recipeBase / ingredientBase) * ingredient.price;
  return { ...base, cost };
}

export function calculateRecipe(
  recipe: Recipe,
  ingredients: Ingredient[],
): RecipeCostResult {
  const ingredientMap = new Map(ingredients.map((i) => [i.id, i]));

  const lineItems = recipe.ingredients.map((line) =>
    calculateIngredientCost(line, ingredientMap.get(line.ingredientId)),
  );

  const totalCost = lineItems.reduce((sum, item) => sum + item.cost, 0);
  const hasErrors = lineItems.some((item) => item.error);

  const yieldQty = recipe.yieldsQuantity > 0 ? recipe.yieldsQuantity : 0;
  const grossRevenue = recipe.salePrice * yieldQty;

  const netRevenue = recipe.isVatRated
    ? grossRevenue / (1 + VAT_RATE)
    : grossRevenue;
  const vatAmount = grossRevenue - netRevenue;

  const profit = netRevenue - totalCost;
  const marginPct = netRevenue > 0 ? (profit / netRevenue) * 100 : 0;
  const costPerUnit = yieldQty > 0 ? totalCost / yieldQty : 0;

  return {
    lineItems,
    totalCost,
    hasErrors,
    grossRevenue,
    netRevenue,
    vatAmount,
    profit,
    marginPct,
    costPerUnit,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatNumber(value: number, maxFractionDigits = 2): string {
  return new Intl.NumberFormat('en-GB', {
    maximumFractionDigits: maxFractionDigits,
  }).format(Number.isFinite(value) ? value : 0);
}

export const unitLabel = (unitId: string): string =>
  getUnit(unitId)?.label.split(' ')[0] ?? unitId;

export { UNITS };
