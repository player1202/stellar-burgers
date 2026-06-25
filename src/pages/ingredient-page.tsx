import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../services/store';
import { selectIngredients } from '../services/selectors/ingredients-selectors';
import { IngredientDetailsUI } from '@ui';
import { Preloader } from '../components/ui/preloader';

export const IngredientPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useAppSelector(selectIngredients);
  const ingredient = ingredients.find((item) => item._id === id);

  if (!ingredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredient} />;
};
