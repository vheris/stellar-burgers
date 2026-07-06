import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useDispatch, useSelector } from 'src/services/store';
import { fetchIngredients } from 'src/services/slices/ingredient-slice';

export const BurgerIngredients: FC = () => {
  const { items: ingredients, isLoading } = useSelector(
    (state) => state.ingredients
  );

  const buns = (ingredients || []).filter((i: TIngredient) => i.type === 'bun');
  const mains = (ingredients || []).filter(
    (i: TIngredient) => i.type === 'main'
  );
  const sauces = (ingredients || []).filter(
    (i: TIngredient) => i.type === 'sauce'
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) setCurrentTab('bun');
    else if (inViewSauces) setCurrentTab('sauce');
    else if (inViewFilling) setCurrentTab('main');
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    const mode = tab as TTabMode;
    setCurrentTab(mode);
    if (mode === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (mode === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (mode === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <BurgerIngredientsUI
        currentTab={currentTab}
        buns={[]}
        mains={[]}
        sauces={[]}
        titleBunRef={titleBunRef}
        titleMainRef={titleMainRef}
        titleSaucesRef={titleSaucesRef}
        bunsRef={bunsRef}
        mainsRef={mainsRef}
        saucesRef={saucesRef}
        onTabClick={onTabClick}
      />
    );
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
