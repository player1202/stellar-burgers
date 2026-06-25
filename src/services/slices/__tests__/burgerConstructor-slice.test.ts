Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-id'
  }
});
import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  ConstructorState
} from '../constructorReducer';
import { TConstructorIngredient } from '../../../utils/types';

describe('burgerConstructor slice', () => {
  const initialState: ConstructorState = {
    bun: null,
    ingredients: []
  };

  const mockIngredient = {
    _id: '1',
    name: 'Тестовый ингредиент',
    type: 'main',
    price: 100,
    image: 'test.jpg',
    image_mobile: 'test-mobile.jpg',
    image_large: 'test-large.jpg',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 150
  };

  const mockBun = {
    ...mockIngredient,
    type: 'bun'
  };

  test('should handle addIngredient with main ingredient', () => {
    const state = constructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject({
      ...mockIngredient,
      id: 'test-id'
    });
    expect(state.bun).toBeNull();
  });

  test('should handle addIngredient with bun', () => {
    const state = constructorReducer(initialState, addIngredient(mockBun));
    expect(state.bun).toMatchObject({
      ...mockBun,
      id: 'test-id'
    });
    expect(state.ingredients).toHaveLength(0);
  });

  test('should return the initial state', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('should handle UNKNOWN action', () => {
    const state = constructorReducer(initialState, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  test('should handle removeIngredient', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [
        {
          ...mockIngredient,
          id: 'test-id'
        }
      ]
    };
    const state = constructorReducer(
      stateWithIngredients,
      removeIngredient('test-id')
    );
    expect(state.ingredients).toHaveLength(0);
  });

  test('should handle moveIngredient', () => {
    const ingredient1 = { ...mockIngredient, id: '1' };
    const ingredient2 = { ...mockIngredient, id: '2' };
    const stateWithIngredients = {
      ...initialState,
      ingredients: [ingredient1, ingredient2]
    };
    const state = constructorReducer(
      stateWithIngredients,
      moveIngredient(0, 1)
    );
    expect(state.ingredients[0].id).toBe('2');
    expect(state.ingredients[1].id).toBe('1');
  });

  test('should handle clearConstructor', () => {
    const stateWithIngredients = {
      bun: { ...mockBun, id: 'test-id' },
      ingredients: [{ ...mockIngredient, id: 'test-id' }]
    };
    const state = constructorReducer(stateWithIngredients, clearConstructor());
    expect(state).toEqual(initialState);
  });
});
