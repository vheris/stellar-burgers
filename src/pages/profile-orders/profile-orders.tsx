import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'src/services/store';
import { fetchOrders } from 'src/services/slices/order-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { userOrders, isOrdersLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isOrdersLoading) {
    return <div className='text text_type_main-medium pt-4'>Загрузка...</div>;
  }

  return <ProfileOrdersUI orders={userOrders} />;
};
