import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { TOrder } from '../../utils/types';

type TProfileFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: TProfileFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: true,
  error: null
};

const profileFeedSlice = createSlice({
  name: 'profileFeed',
  initialState,
  reducers: {
    profileFeedStarted(state) {
      state.loading = true;
      state.error = null;
    },
    profileFeedSuccess(
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
      state.error = null;
    },
    profileFeedError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    profileFeedDisconnected(state) {
      state.loading = false;
    }
  }
});

export const {
  profileFeedStarted,
  profileFeedSuccess,
  profileFeedError,
  profileFeedDisconnected
} = profileFeedSlice.actions;

export const profileFeedReducer = profileFeedSlice.reducer;

// селекторы
export const selectProfileFeed = (s: RootState) => s.profileFeed;
export const selectProfileOrders = (s: RootState) => s.profileFeed.orders;
