import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredients';
import userReducer from './slices/user';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;
