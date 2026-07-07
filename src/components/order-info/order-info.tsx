import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from 'src/services/store';
import { getOrderByNumberApi } from '@api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const { items: ingredients } = useSelector((state) => state.ingredients);
  const currentOrder = useSelector((state) => state.orderDetails.currentOrder);
  const [orderData, setOrderData] = useState<TOrder | null>(
    currentOrder ?? null
  );
  const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(!currentOrder);

  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      if (number) {
        setIsLoadingOrder(true);
        try {
          const response = await getOrderByNumberApi(Number(number));
          if (isMounted) {
            setOrderData(response.orders[0] ?? null);
          }
        } catch {
          if (isMounted) {
            setOrderData(null);
          }
        } finally {
          if (isMounted) {
            setIsLoadingOrder(false);
          }
        }
        return;
      }

      if (isMounted) {
        setOrderData(currentOrder ?? null);
        setIsLoadingOrder(false);
      }
    };

    void loadOrder();

    return () => {
      isMounted = false;
    };
  }, [currentOrder, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoadingOrder || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
