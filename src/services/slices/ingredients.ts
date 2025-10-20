import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { getIngredientsApi } from '../../utils/burger-api';
import type { TIngredient } from '../../utils/types';

type State = {
  data: TIngredient[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
};

const initialState: State = {
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
      const state = getState();
      const { loading, fetched } = state.ingredients;
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
  extraReducers: (b) => {
    b.addCase(fetchIngredients.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    b.addCase(fetchIngredients.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data = payload;
      state.fetched = true;
    });
    b.addCase(fetchIngredients.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Не удалось загрузить ингредиенты';
    });
  }
});

export const selectIngredients = (s: RootState) => s.ingredients.data;
export const selectIngredientsLoading = (s: RootState) => s.ingredients.loading;
export const selectIngredientsError = (s: RootState) => s.ingredients.error;
export const selectIngredientsFetched = (s: RootState) => s.ingredients.fetched;

export default ingredientsSlice.reducer;
