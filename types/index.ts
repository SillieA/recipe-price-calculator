export type UnitType = 'weight' | 'volume' | 'quantity';

export interface Unit {
  id: string;
  label: string;
  type: UnitType;
  system: 'metric' | 'imperial' | 'universal';
  // base conversion to metric (grams for weight, ml for volume)
  toBase: number;
}

export interface Ingredient {
  id: string;
  name: string;
  price: number; // price in currency
  quantity: number; // amount (e.g. 500)
  unitId: string; // unit (e.g. 'g', 'oz', 'ml')
  updatedAt: string;
  notes?: string;
  tags?: string[];
}

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
  unitId: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  yieldsQuantity: number; // how many units does this recipe produce
  yieldUnit: string; // e.g. "loaves", "cookies", "muffins"
  salePrice: number; // sale price per unit produced
  isVatRated: boolean; // whether the product is VAT rated (20%)
  updatedAt: string;
  notes?: string;
  tags?: string[];
}

export interface AppData {
  ingredients: Ingredient[];
  recipes: Recipe[];
}

export const VAT_RATE = 0.2;

export const UNITS: Unit[] = [
  // Weight - Metric
  { id: 'g', label: 'g (grams)', type: 'weight', system: 'metric', toBase: 1 },
  { id: 'kg', label: 'kg (kilograms)', type: 'weight', system: 'metric', toBase: 1000 },
  // Weight - Imperial
  { id: 'oz', label: 'oz (ounces)', type: 'weight', system: 'imperial', toBase: 28.3495 },
  { id: 'lbs', label: 'lbs (pounds)', type: 'weight', system: 'imperial', toBase: 453.592 },
  // Volume - Metric
  { id: 'ml', label: 'ml (millilitres)', type: 'volume', system: 'metric', toBase: 1 },
  { id: 'L', label: 'L (litres)', type: 'volume', system: 'metric', toBase: 1000 },
  // Volume - Imperial
  { id: 'floz', label: 'fl oz', type: 'volume', system: 'imperial', toBase: 29.5735 },
  { id: 'cup', label: 'cup', type: 'volume', system: 'imperial', toBase: 236.588 },
  { id: 'tbsp', label: 'tbsp (tablespoon)', type: 'volume', system: 'imperial', toBase: 14.7868 },
  { id: 'tsp', label: 'tsp (teaspoon)', type: 'volume', system: 'imperial', toBase: 4.92892 },
  // Quantity
  { id: 'each', label: 'each', type: 'quantity', system: 'universal', toBase: 1 },
  { id: 'dozen', label: 'dozen', type: 'quantity', system: 'universal', toBase: 12 },
];

export const getUnit = (unitId: string): Unit | undefined =>
  UNITS.find((u) => u.id === unitId);
