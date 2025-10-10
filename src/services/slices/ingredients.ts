import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { getIngredientsApi } from '../../utils/burger-api';
import type { TIngredient } from '../../utils/types';

type State = {
  data: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: State = {
  data: [],
  loading: false,
  error: null
};

// Thunk: тянем данные с сервера
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  async () => {
    const data = await getIngredientsApi(); // вернёт TIngredient[]
    return data;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchIngredients.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    b.addCase(
      fetchIngredients.fulfilled,
      (state, { payload }: PayloadAction<TIngredient[]>) => {
        state.loading = false;
        state.data = payload;
      }
    );
    b.addCase(fetchIngredients.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Не удалось загрузить ингредиенты';
    });
  }
});

// Селекторы
export const selectIngredients = (s: RootState) => s.ingredients.data;
export const selectIngredientsLoading = (s: RootState) => s.ingredients.loading;
export const selectIngredientsError = (s: RootState) => s.ingredients.error;

export default ingredientsSlice.reducer;
