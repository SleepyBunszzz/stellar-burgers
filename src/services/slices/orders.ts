// src/services/slices/orders.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  getOrdersApi,
  getOrderByNumberApi,
  createOrderApi
} from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';

type OrdersState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  orderRequest: boolean;
  error: string | null;
  lastOrderIngredients?: string[];
};

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  orderRequest: false,
  error: null,
  lastOrderIngredients: undefined
};

export const fetchOrders = createAsyncThunk<TOrder[]>(
  'orders/fetchMine',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder | undefined, number>(
  'orders/fetchOrderByNumber',
  async (number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders?.[0];
  }
);

export const createOrder = createAsyncThunk<
  { order: TOrder; name: string },
  string[]
>('orders/createOrder', async (ingredientIds) => {
  const res = await createOrderApi(ingredientIds);
  return res;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, { payload }) => {
        state.orderRequest = false;
        state.orders = payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Не удалось загрузить заказы';
      });

    builder
      .addCase(createOrder.pending, (state, action) => {
        state.orderRequest = true;
        state.error = null;
        state.lastOrderIngredients = action.meta.arg;
      })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.orderRequest = false;
        state.currentOrder = payload.order;

        const idx = state.orders.findIndex((o) => o._id === payload.order._id);
        if (idx === -1) state.orders.push(payload.order);
        else state.orders[idx] = payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Не удалось создать заказ';
      });

    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, { payload }) => {
        state.orderRequest = false;
        state.currentOrder = payload ?? null;

        if (payload) {
          const idx = state.orders.findIndex((o) => o._id === payload._id);
          if (idx === -1) state.orders.push(payload);
          else state.orders[idx] = payload;
        }
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Не удалось загрузить заказ';
      });
  }
});

export const { clearCurrentOrder } = ordersSlice.actions;

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectOrderRequest = (state: RootState) =>
  state.orders.orderRequest;
export const selectOrderError = (state: RootState) => state.orders.error;
export const selectLastOrderIngredients = (state: RootState) =>
  state.orders.lastOrderIngredients;

export default ordersSlice.reducer;
