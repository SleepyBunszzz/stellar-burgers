import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { getIngredientsApi } from '../../utils/burger-api';
import type { TIngredient } from '../../utils/types';

type IngredientsState = {
  data: TIngredient[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
};

const initialState: IngredientsState = {
  data: [],
  loading: false,
  error: null,
  fetched: false
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { state: RootState }
>(
  'ingredients/fetch',
  async () => {
    const data = await getIngredientsApi();
    return data;
  },
  {
    condition: (_, { getState }) => {
      const { loading, fetched } = getState().ingredients;
      if (loading || fetched) {
        return false;
      }
      return true;
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchIngredients.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data = payload;
      state.fetched = true;
      state.error = null;
    });
    builder.addCase(fetchIngredients.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Не удалось загрузить ингредиенты';
    });
  }
});

// селекторы
export const selectAllIngredients = (state: RootState) =>
  state.ingredients.data;

// alias, чтобы не падали компоненты, которые ожидают selectIngredients
export const selectIngredients = (state: RootState) => state.ingredients.data;

export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
export const selectIngredientsFetched = (state: RootState) =>
  state.ingredients.fetched;

export default ingredientsSlice.reducer;
