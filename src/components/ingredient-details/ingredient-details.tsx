import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from 'src/services/store';
import { fetchIngredients } from 'src/services/slices/ingredient-slice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { items: ingredients, isLoading } = useSelector(
    (state) => state.ingredients
  );

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
