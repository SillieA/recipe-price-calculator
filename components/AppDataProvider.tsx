'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  ReactNode,
} from 'react';
import { AppData, Ingredient, Recipe } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const STORAGE_KEY = 'recipe-calculator-data';

const EMPTY_DATA: AppData = { ingredients: [], recipes: [] };

const createId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

interface AppDataContextValue {
  data: AppData;
  hydrated: boolean;
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => Ingredient;
  updateIngredient: (id: string, updates: Omit<Ingredient, 'id'>) => void;
  deleteIngredient: (id: string) => void;
  addRecipe: (recipe: Omit<Recipe, 'id'>) => Recipe;
  updateRecipe: (id: string, updates: Omit<Recipe, 'id'>) => void;
  deleteRecipe: (id: string) => void;
  importData: (incoming: AppData) => void;
  clearData: () => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData, hydrated] = useLocalStorage<AppData>(
    STORAGE_KEY,
    EMPTY_DATA,
  );

  const addIngredient = useCallback(
    (ingredient: Omit<Ingredient, 'id'>) => {
      const newIngredient: Ingredient = { ...ingredient, id: createId() };
      setData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient],
      }));
      return newIngredient;
    },
    [setData],
  );

  const updateIngredient = useCallback(
    (id: string, updates: Omit<Ingredient, 'id'>) => {
      setData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.map((ing) =>
          ing.id === id ? { ...updates, id } : ing,
        ),
      }));
    },
    [setData],
  );

  const deleteIngredient = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter((ing) => ing.id !== id),
        // Drop any recipe lines that referenced the removed ingredient.
        recipes: prev.recipes.map((recipe) => ({
          ...recipe,
          ingredients: recipe.ingredients.filter(
            (line) => line.ingredientId !== id,
          ),
        })),
      }));
    },
    [setData],
  );

  const addRecipe = useCallback(
    (recipe: Omit<Recipe, 'id'>) => {
      const newRecipe: Recipe = { ...recipe, id: createId() };
      setData((prev) => ({ ...prev, recipes: [...prev.recipes, newRecipe] }));
      return newRecipe;
    },
    [setData],
  );

  const updateRecipe = useCallback(
    (id: string, updates: Omit<Recipe, 'id'>) => {
      setData((prev) => ({
        ...prev,
        recipes: prev.recipes.map((recipe) =>
          recipe.id === id ? { ...updates, id } : recipe,
        ),
      }));
    },
    [setData],
  );

  const deleteRecipe = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        recipes: prev.recipes.filter((recipe) => recipe.id !== id),
      }));
    },
    [setData],
  );

  const importData = useCallback(
    (incoming: AppData) => {
      setData({
        ingredients: incoming.ingredients ?? [],
        recipes: incoming.recipes ?? [],
      });
    },
    [setData],
  );

  const clearData = useCallback(() => setData(EMPTY_DATA), [setData]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      data,
      hydrated,
      addIngredient,
      updateIngredient,
      deleteIngredient,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      importData,
      clearData,
    }),
    [
      data,
      hydrated,
      addIngredient,
      updateIngredient,
      deleteIngredient,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      importData,
      clearData,
    ],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
