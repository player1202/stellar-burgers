import { RootState } from '../store';

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectIsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectError = (state: RootState) => state.ingredients.error;
