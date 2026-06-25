import { TConstructorIngredient, TIngredient } from '@utils-types';
import { nanoid } from 'nanoid';

export interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const ADD_INGREDIENT = 'constructor/ADD_INGREDIENT';
export const REMOVE_INGREDIENT = 'constructor/REMOVE_INGREDIENT';
export const MOVE_INGREDIENT = 'constructor/MOVE_INGREDIENT';
export const CLEAR_CONSTRUCTOR = 'constructor/CLEAR_CONSTRUCTOR';

export const addIngredient = (ingredient: TIngredient) => ({
  type: ADD_INGREDIENT,
  payload: ingredient
});

export const removeIngredient = (id: string) => ({
  type: REMOVE_INGREDIENT,
  payload: id
});

export const moveIngredient = (from: number, to: number) => ({
  type: MOVE_INGREDIENT,
  payload: { from, to }
});

export const clearConstructor = () => ({
  type: CLEAR_CONSTRUCTOR
});

const constructorReducer = (
  state = initialState,
  action: any
): ConstructorState => {
  if (!state || typeof state !== 'object' || state === null) {
    return initialState;
  }

  const currentState = {
    ...state,
    ingredients: Array.isArray(state.ingredients) ? state.ingredients : []
  };

  switch (action.type) {
    case ADD_INGREDIENT: {
      const ingredient: TConstructorIngredient = {
        ...action.payload,
        id: nanoid()
      };
      if (ingredient.type === 'bun') {
        return { ...currentState, bun: ingredient };
      } else {
        return {
          ...currentState,
          ingredients: [...currentState.ingredients, ingredient]
        };
      }
    }
    case REMOVE_INGREDIENT: {
      return {
        ...currentState,
        ingredients: currentState.ingredients.filter(
          (item) => item.id !== action.payload
        )
      };
    }
    case MOVE_INGREDIENT: {
      const { from, to } = action.payload;
      const newIngredients = [...currentState.ingredients];
      const ingredient = newIngredients[from];
      newIngredients.splice(from, 1);
      newIngredients.splice(to, 0, ingredient);
      return { ...currentState, ingredients: newIngredients };
    }
    case CLEAR_CONSTRUCTOR: {
      return { bun: null, ingredients: [] };
    }
    default:
      return currentState;
  }
};

export default constructorReducer;
