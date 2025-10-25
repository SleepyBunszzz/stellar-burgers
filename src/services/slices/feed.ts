import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { RootState } from '../store';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: true
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    feedLoadingStarted(state) {
      state.loading = true;
    },
    feedLoadingSuccess(
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.loading = false;
    },
    feedDisconnected(state) {
      state.loading = false;
    }
  }
});

export const { feedLoadingStarted, feedLoadingSuccess, feedDisconnected } =
  feedSlice.actions;

export const feedReducer = feedSlice.reducer;

// селекторы
export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedTotals = (state: RootState) => ({
  total: state.feed.total,
  totalToday: state.feed.totalToday
});
export const selectFeedLoading = (state: RootState) => state.feed.loading;
