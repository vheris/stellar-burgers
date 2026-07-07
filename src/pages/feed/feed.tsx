import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { fetchFeeds } from 'src/services/slices/feed-slice';
import { useDispatch, useSelector } from 'src/services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { feedOrders, isFeedLoading } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isFeedLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={feedOrders}
      handleGetFeeds={() => {
        dispatch(fetchFeeds());
      }}
    />
  );
};
