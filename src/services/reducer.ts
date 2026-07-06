import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/auth-slice';
import ingredientReducer from './slices/ingredient-slice';
import orderReducer from './slices/order-slice';

const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientReducer,
  order: orderReducer
});

export default rootReducer;
