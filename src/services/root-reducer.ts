import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredients';
import userReducer from './slices/user';
import ordersReducer from './slices/orders';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  orders: ordersReducer
});
