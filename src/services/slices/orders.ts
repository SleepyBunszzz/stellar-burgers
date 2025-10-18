import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { getOrderByNumberApi, createOrderApi } from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';

type OrdersState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  orderRequest: boolean;
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  orderRequest: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'orders/fetchOrderByNumber',
  async (number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0];
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
    builder.addCase(createOrder.pending, (state) => {
      state.orderRequest = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, { payload }) => {
      state.orderRequest = false;
      state.currentOrder = payload.order;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.orderRequest = false;
      state.error = action.error.message || 'Не удалось создать заказ';
    });
    builder.addCase(fetchOrderByNumber.pending, (state) => {
      state.orderRequest = true;
      state.error = null;
    });
    builder.addCase(fetchOrderByNumber.fulfilled, (state, { payload }) => {
      state.orderRequest = false;
      state.currentOrder = payload;
    });
    builder.addCase(fetchOrderByNumber.rejected, (state, action) => {
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
export default ordersSlice.reducer;
