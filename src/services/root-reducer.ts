import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredients';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer
});

export type RootState = ReturnType<typeof rootReducer>;
