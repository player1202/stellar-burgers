import ingredientsReducer, {
  fetchIngredients,
  IngredientsState
} from '../ingredients-slice';
import { TIngredient } from '../../../utils/types';

describe('ingredients slice', () => {
  const initialState: IngredientsState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  const mockIngredient: TIngredient = {
    _id: '1',
    name: 'Тестовая булка',
    type: 'bun',
    price: 100,
    image: 'test.jpg',
    image_mobile: 'test-mobile.jpg',
    image_large: 'test-large.jpg',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 150
  };

  test('should return the initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('should handle UNKNOWN action', () => {
    const state = ingredientsReducer(initialState, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  test('should handle fetchIngredients.pending', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.pending.type
    });
    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('should handle fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload: [mockIngredient]
    });
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      ingredients: [mockIngredient]
    });
  });

  test('should handle fetchIngredients.rejected', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' }
    });
    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка загрузки'
    });
  });
});
