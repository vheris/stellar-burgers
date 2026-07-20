import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from 'src/services/store';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { selectedBun, ingredients: constructorIngredients } = useSelector(
    (state) => state.burgerConstructor
  );

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};

    (constructorIngredients || []).forEach((ingredient) => {
      const id = (ingredient as TIngredient)._id;
      counters[id] = (counters[id] || 0) + 1;
    });

    if (selectedBun && selectedBun._id) {
      counters[selectedBun._id] = 2;
    }

    return counters;
  }, [constructorIngredients, selectedBun]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
