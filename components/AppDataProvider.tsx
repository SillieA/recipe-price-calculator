'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
} from 'react';
import { AppData, Ingredient, Recipe } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { decodeShareData } from '@/lib/share';

const STORAGE_KEY = 'recipe-calculator-data';

const EMPTY_DATA: AppData = { ingredients: [], recipes: [] };
const SHARE_PARAM = 'share';

const createId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const nowIso = (): string => new Date().toISOString();

const normalizeIngredient = (
  ingredient: Omit<Ingredient, 'updatedAt'> & { updatedAt?: string },
): Ingredient => ({
  ...ingredient,
  updatedAt: ingredient.updatedAt ?? nowIso(),
});

const normalizeRecipe = (
  recipe: Omit<Recipe, 'updatedAt'> & { updatedAt?: string },
): Recipe => ({
  ...recipe,
  updatedAt: recipe.updatedAt ?? nowIso(),
});

const normalizeAppData = (appData: AppData): AppData => ({
  ingredients: (appData.ingredients ?? []).map((ingredient) =>
    normalizeIngredient(ingredient),
  ),
  recipes: (appData.recipes ?? []).map((recipe) => normalizeRecipe(recipe)),
});

const mergeByUpdatedAt = <T extends { id: string; updatedAt: string }>(
  current: T[],
  incoming: T[],
): T[] => {
  const merged = new Map(current.map((item) => [item.id, item]));
  incoming.forEach((item) => {
    const existing = merged.get(item.id);
    if (!existing) {
      merged.set(item.id, item);
      return;
    }
    const existingTime = Date.parse(existing.updatedAt);
    const incomingTime = Date.parse(item.updatedAt);
    if (
      !Number.isFinite(existingTime) ||
      !Number.isFinite(incomingTime) ||
      incomingTime >= existingTime
    ) {
      merged.set(item.id, item);
    }
  });
  return Array.from(merged.values());
};

type IngredientInput = Omit<Ingredient, 'id' | 'updatedAt'>;
type RecipeInput = Omit<Recipe, 'id' | 'updatedAt'>;

interface AppDataContextValue {
  data: AppData;
  hydrated: boolean;
  addIngredient: (ingredient: IngredientInput) => Ingredient;
  updateIngredient: (id: string, updates: IngredientInput) => void;
  deleteIngredient: (id: string) => void;
  addRecipe: (recipe: RecipeInput) => Recipe;
  updateRecipe: (id: string, updates: RecipeInput) => void;
  deleteRecipe: (id: string) => void;
  importData: (incoming: AppData) => void;
  mergeData: (incoming: AppData) => void;
  clearData: () => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData, hydrated] = useLocalStorage<AppData>(
    STORAGE_KEY,
    EMPTY_DATA,
  );
  const hasImportedFromUrlRef = useRef(false);

  const addIngredient = useCallback(
    (ingredient: IngredientInput) => {
      const newIngredient: Ingredient = {
        ...ingredient,
        id: createId(),
        updatedAt: nowIso(),
      };
      setData((prev) => {
        const normalizedPrev = normalizeAppData(prev);
        return {
          ...normalizedPrev,
          ingredients: [...normalizedPrev.ingredients, newIngredient],
        };
      });
      return newIngredient;
    },
    [setData],
  );

  const updateIngredient = useCallback(
    (id: string, updates: IngredientInput) => {
      const updatedAt = nowIso();
      setData((prev) => {
        const normalizedPrev = normalizeAppData(prev);
        return {
          ...normalizedPrev,
          ingredients: normalizedPrev.ingredients.map((ing) =>
            ing.id === id ? { ...updates, id, updatedAt } : ing,
          ),
        };
      });
    },
    [setData],
  );

  const deleteIngredient = useCallback(
    (id: string) => {
      const updatedAt = nowIso();
      setData((prev) => {
        const normalizedPrev = normalizeAppData(prev);
        return {
          ...normalizedPrev,
          ingredients: normalizedPrev.ingredients.filter((ing) => ing.id !== id),
          // Drop any recipe lines that referenced the removed ingredient.
          recipes: normalizedPrev.recipes.map((recipe) => {
            const ingredients = recipe.ingredients.filter(
              (line) => line.ingredientId !== id,
            );
            return ingredients.length === recipe.ingredients.length
              ? recipe
              : {
                  ...recipe,
                  ingredients,
                  updatedAt,
                };
          }),
        };
      });
    },
    [setData],
  );

  const addRecipe = useCallback(
    (recipe: RecipeInput) => {
      const newRecipe: Recipe = { ...recipe, id: createId(), updatedAt: nowIso() };
      setData((prev) => {
        const normalizedPrev = normalizeAppData(prev);
        return {
          ...normalizedPrev,
          recipes: [...normalizedPrev.recipes, newRecipe],
        };
      });
      return newRecipe;
    },
    [setData],
  );

  const updateRecipe = useCallback(
    (id: string, updates: RecipeInput) => {
      const updatedAt = nowIso();
      setData((prev) => {
        const normalizedPrev = normalizeAppData(prev);
        return {
          ...normalizedPrev,
          recipes: normalizedPrev.recipes.map((recipe) =>
            recipe.id === id ? { ...updates, id, updatedAt } : recipe,
          ),
        };
      });
    },
    [setData],
  );

  const deleteRecipe = useCallback(
    (id: string) => {
      setData((prev) => {
        const normalizedPrev = normalizeAppData(prev);
        return {
          ...normalizedPrev,
          recipes: normalizedPrev.recipes.filter((recipe) => recipe.id !== id),
        };
      });
    },
    [setData],
  );

  const mergeData = useCallback(
    (incoming: AppData) => {
      const normalizedIncoming = normalizeAppData(incoming);
      setData((prev) => {
        const normalizedPrev = normalizeAppData(prev);
        return {
          ingredients: mergeByUpdatedAt(
            normalizedPrev.ingredients,
            normalizedIncoming.ingredients,
          ),
          recipes: mergeByUpdatedAt(normalizedPrev.recipes, normalizedIncoming.recipes),
        };
      });
    },
    [setData],
  );

  const importData = useCallback(
    (incoming: AppData) => {
      setData(normalizeAppData(incoming));
    },
    [setData],
  );

  const clearData = useCallback(() => setData(EMPTY_DATA), [setData]);
  const normalizedData = useMemo(() => normalizeAppData(data), [data]);

  useEffect(() => {
    if (!hydrated || hasImportedFromUrlRef.current) return;
    hasImportedFromUrlRef.current = true;
    const payload = new URLSearchParams(window.location.search).get(SHARE_PARAM);
    if (!payload) return;

    decodeShareData(payload)
      .then((sharedData) => {
        mergeData(sharedData);
        const nextParams = new URLSearchParams(window.location.search);
        nextParams.delete(SHARE_PARAM);
        const nextQuery = nextParams.toString();
        const nextUrl = `${window.location.pathname}${
          nextQuery ? `?${nextQuery}` : ''
        }${window.location.hash}`;
        window.history.replaceState({}, '', nextUrl);
      })
      .catch((error) => {
        console.error(
          'Failed to import shared data from URL:',
          error instanceof Error ? error.message : error,
        );
      });
  }, [hydrated, mergeData]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      data: normalizedData,
      hydrated,
      addIngredient,
      updateIngredient,
      deleteIngredient,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      importData,
      mergeData,
      clearData,
    }),
    [
      normalizedData,
      hydrated,
      addIngredient,
      updateIngredient,
      deleteIngredient,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      importData,
      mergeData,
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
