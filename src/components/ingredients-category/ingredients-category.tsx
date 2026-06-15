import { forwardRef, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useAppSelector } from '../../services/store';

type TIngredientsCategoryProps = {
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
  onAddIngredient?: (ingredient: TIngredient) => void;
};

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients, onAddIngredient }, ref) => {
  const burgerConstructor = useAppSelector((state) => state.constructor);

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients: constructorIngredients } = burgerConstructor;
    const counters: { [key: string]: number } = {};

    if (constructorIngredients && Array.isArray(constructorIngredients)) {
      constructorIngredients.forEach((ingredient: TIngredient) => {
        if (!counters[ingredient._id]) counters[ingredient._id] = 0;
        counters[ingredient._id]++;
      });
    }

    if (bun) counters[bun._id] = 2;
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
      onAddIngredient={onAddIngredient}
    />
  );
});
