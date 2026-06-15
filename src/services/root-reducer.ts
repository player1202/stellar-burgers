import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredients-slice';
import { userSlice } from './slices/user-slice';
import { ordersSlice } from './slices/orders-slice';
import { feedSlice } from './slices/feed-slice';
import constructorReducer from './slices/constructorReducer';

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  user: userSlice.reducer,
  orders: ordersSlice.reducer,
  feed: feedSlice.reducer,
  constructor: constructorReducer
});
