import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { v4 as uuid } from 'uuid';

export type TConstructorItem = TIngredient & { cid: string };

type TConstructorState = {
  bun: TConstructorItem | null;
  items: TConstructorItem[];
};

const initialState: TConstructorState = {
  bun: null,
  items: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, cid: uuid() } as TConstructorItem
      }),
      reducer: (state, action: PayloadAction<TConstructorItem>) => {
        const item = action.payload;
        if (item.type === 'bun') {
          state.bun = item;
        } else {
          state.items.push(item);
        }
      }
    },

    removeIngredient(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.cid !== action.payload);
    },

    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      if (from === to) return;
      if (from < 0 || from >= state.items.length) return;
      if (to < 0 || to > state.items.length) return;
      const [moved] = state.items.splice(from, 1);
      if (moved) state.items.splice(to, 0, moved);
    },

    clearConstructor(state) {
      state.bun = null;
      state.items = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;
