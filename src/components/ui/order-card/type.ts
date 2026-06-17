import { TIngredient } from '@utils-types';

export type OrderCardUIProps = {
  orderInfo: {
    _id: string;
    number: number;
    name: string;
    status: string;
    date: Date;
    total: number;
    ingredientsInfo: {
      [key: string]: TIngredient & { count: number };
    };
    ingredientsToShow: (TIngredient & { count: number })[];
    remains: number;
  };
  locationState?: { background: any };
};