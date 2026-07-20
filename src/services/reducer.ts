import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/auth-slice';
import ingredientReducer from './slices/ingredient-slice';
import burgerConstructorReducer from './slices/burger-constructor-slice';
import orderDetailsReducer from './slices/order-details-slice';
import feedReducer from './slices/feed-slice';
import userOrdersReducer from './slices/user-orders-slice';

const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientReducer,
  burgerConstructor: burgerConstructorReducer,
  orderDetails: orderDetailsReducer,
  feed: feedReducer,
  userOrders: userOrdersReducer
});

export default rootReducer;
