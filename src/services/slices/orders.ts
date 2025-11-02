// src/services/slices/orders.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { getOrderByNumberApi, createOrderApi } from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';

type OrdersState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  orderRequest: boolean;
  error: string | null;
  // что отправляли в последний раз (для отладки/повтора)
  lastOrderIngredients?: string[];
};

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  orderRequest: false,
  error: null,
  lastOrderIngredients: undefined
};

// Получить заказ по номеру (страница/модалка заказа)
export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'orders/fetchOrderByNumber',
  async (number) => {
    const res = await getOrderByNumberApi(number);
    // API возвращает массив orders; берём первый
    return res.orders[0];
  }
);

// Создать заказ (из конструктора)
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
    // Создание заказа
    builder.addCase(createOrder.pending, (state, action) => {
      state.orderRequest = true;
      state.error = null;
      // Сохраняем, что отправили
      state.lastOrderIngredients = action.meta.arg;
    });
    builder.addCase(createOrder.fulfilled, (state, { payload }) => {
      state.orderRequest = false;
      state.currentOrder = payload.order;

      // upsert созданного заказа в список
      const idx = state.orders.findIndex((o) => o._id === payload.order._id);
      if (idx === -1) state.orders.push(payload.order);
      else state.orders[idx] = payload.order;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.orderRequest = false;
      state.error = action.error.message || 'Не удалось создать заказ';
    });

    // Заказ по номеру
    builder.addCase(fetchOrderByNumber.pending, (state) => {
      state.orderRequest = true;
      state.error = null;
    });
    builder.addCase(fetchOrderByNumber.fulfilled, (state, { payload }) => {
      state.orderRequest = false;
      state.currentOrder = payload;

      // upsert найденного заказа в список
      if (payload) {
        const idx = state.orders.findIndex((o) => o._id === payload._id);
        if (idx === -1) state.orders.push(payload);
        else state.orders[idx] = payload;
      }
    });
    builder.addCase(fetchOrderByNumber.rejected, (state, action) => {
      state.orderRequest = false;
      state.error = action.error.message || 'Не удалось загрузить заказ';
    });
  }
});

export const { clearCurrentOrder } = ordersSlice.actions;

// Селекторы
export const selectOrders = (state: RootState) => state.orders.orders;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectOrderRequest = (state: RootState) =>
  state.orders.orderRequest;
export const selectOrderError = (state: RootState) => state.orders.error;
export const selectLastOrderIngredients = (state: RootState) =>
  state.orders.lastOrderIngredients;

export default ordersSlice.reducer;
