// src/services/selectors/constructor.ts
import type { RootState } from '../store';

export const selectConstructor = (s: RootState) => s.burgerConstructor;
export const selectBun = (s: RootState) => s.burgerConstructor.bun;
export const selectItems = (s: RootState) => s.burgerConstructor.items;
export const selectCountById = (id: string) => (s: RootState) =>
  (s.burgerConstructor.bun && s.burgerConstructor.bun._id === id ? 2 : 0) +
  s.burgerConstructor.items.filter((i) => i._id === id).length;
