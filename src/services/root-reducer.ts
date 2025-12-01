import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredients';
import userReducer from './slices/user';
import ordersReducer from './slices/orders';
import { feedReducer } from './slices/feed';
import { profileFeedReducer } from './slices/profile-feed';
import constructorReducer from './slices/constructor';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  orders: ordersReducer,
  feed: feedReducer,
  profileFeed: profileFeedReducer,
  burgerConstructor: constructorReducer
});
