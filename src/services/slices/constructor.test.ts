import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructor';
import { TIngredient } from '@utils-types';

// Реалистичные мок-данные на основе типов проекта
const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockMainIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const mockSauceIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

describe('constructor reducer', () => {
  const initialState = reducer(undefined, { type: 'unknown' });

  describe('initial state', () => {
    it('should return initial state', () => {
      expect(initialState).toEqual({
        bun: null,
        items: []
      });
    });
  });

  describe('addIngredient', () => {
    it('should handle adding a bun', () => {
      const action = addIngredient(mockBun);
      const newState = reducer(initialState, action);

      expect(newState.bun).toEqual(
        expect.objectContaining({
          ...mockBun,
          cid: expect.any(String)
        })
      );
      expect(newState.items).toEqual([]);
    });

    it('should handle adding a main ingredient', () => {
      const action = addIngredient(mockMainIngredient);
      const newState = reducer(initialState, action);

      expect(newState.bun).toBeNull();
      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual(
        expect.objectContaining({
          ...mockMainIngredient,
          cid: expect.any(String)
        })
      );
    });

    it('should handle adding a sauce ingredient', () => {
      const action = addIngredient(mockSauceIngredient);
      const newState = reducer(initialState, action);

      expect(newState.bun).toBeNull();
      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual(
        expect.objectContaining({
          ...mockSauceIngredient,
          cid: expect.any(String)
        })
      );
    });

    it('should replace bun when adding new bun', () => {
      const firstBunAction = addIngredient(mockBun);
      let state = reducer(initialState, firstBunAction);

      const secondBun: TIngredient = {
        ...mockBun,
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3',
        price: 988
      };
      const secondBunAction = addIngredient(secondBun);
      state = reducer(state, secondBunAction);

      expect(state.bun?._id).toBe('643d69a5c3f7b9001cfa093d');
      expect(state.bun?.name).toBe('Флюоресцентная булка R2-D3');
      expect(state.items).toEqual([]);
    });

    it('should add multiple non-bun ingredients', () => {
      const action1 = addIngredient(mockMainIngredient);
      let state = reducer(initialState, action1);

      const action2 = addIngredient(mockSauceIngredient);
      state = reducer(state, action2);

      expect(state.bun).toBeNull();
      expect(state.items).toHaveLength(2);
      expect(state.items[0]?.type).toBe('main');
      expect(state.items[1]?.type).toBe('sauce');
    });
  });

  describe('removeIngredient', () => {
    it('should remove ingredient by cid', () => {
      // Сначала добавляем несколько ингредиентов
      const addAction1 = addIngredient(mockMainIngredient);
      let state = reducer(initialState, addAction1);
      const ingredient1Cid = state.items[0]?.cid || '';

      const addAction2 = addIngredient({
        ...mockSauceIngredient,
        _id: '643d69a5c3f7b9001cfa0943',
        name: 'Соус фирменный Space Sauce'
      });
      state = reducer(state, addAction2);

      // Проверяем, что оба ингредиента добавлены
      expect(state.items).toHaveLength(2);

      // Удаляем первый ингредиент
      const removeAction = removeIngredient(ingredient1Cid);
      state = reducer(state, removeAction);

      expect(state.items).toHaveLength(1);
      expect(state.items[0]?._id).toBe('643d69a5c3f7b9001cfa0943');
      expect(state.items[0]?.name).toBe('Соус фирменный Space Sauce');
    });

    it('should not change state if cid not found', () => {
      const addAction = addIngredient(mockMainIngredient);
      let state = reducer(initialState, addAction);
      const originalState = { ...state };

      const removeAction = removeIngredient('non-existent-cid');
      state = reducer(state, removeAction);

      expect(state).toEqual(originalState);
    });
  });

  describe('moveIngredient', () => {
    it('should move ingredient from one position to another', () => {
      // Добавляем три ингредиента разных типов
      const ingredients: TIngredient[] = [
        { ...mockMainIngredient, _id: '1', name: 'Котлета 1' },
        { ...mockSauceIngredient, _id: '2', name: 'Соус 1' },
        { ...mockMainIngredient, _id: '3', name: 'Котлета 2' }
      ];

      let state = initialState;
      ingredients.forEach((ing) => {
        state = reducer(state, addIngredient(ing));
      });

      // Сохраняем исходные названия для проверки
      const originalNames = state.items.map((item) => item.name);

      // Перемещаем первый элемент (индекс 0) на позицию после второго (индекс 2)
      const moveAction = moveIngredient({ from: 0, to: 2 });
      state = reducer(state, moveAction);

      // Проверяем новый порядок
      const newNames = state.items.map((item) => item.name);
      expect(newNames).toEqual([
        originalNames[1],
        originalNames[2],
        originalNames[0]
      ]);
    });

    it('should not change state when from equals to', () => {
      const addAction = addIngredient(mockMainIngredient);
      let state = reducer(initialState, addAction);
      const originalState = { ...state };

      const moveAction = moveIngredient({ from: 0, to: 0 });
      state = reducer(state, moveAction);

      expect(state).toEqual(originalState);
    });

    it('should not change state when from index is out of bounds', () => {
      const addAction = addIngredient(mockMainIngredient);
      let state = reducer(initialState, addAction);
      const originalState = { ...state };

      const moveAction = moveIngredient({ from: 5, to: 0 });
      state = reducer(state, moveAction);

      expect(state).toEqual(originalState);
    });

    it('should not change state when to index is out of bounds', () => {
      const addAction = addIngredient(mockMainIngredient);
      let state = reducer(initialState, addAction);
      const originalState = { ...state };

      const moveAction = moveIngredient({ from: 0, to: 5 });
      state = reducer(state, moveAction);

      expect(state).toEqual(originalState);
    });
  });

  describe('clearConstructor', () => {
    it('should clear all ingredients and bun', () => {
      // Сначала добавляем булку и несколько ингредиентов
      const bunAction = addIngredient(mockBun);
      let state = reducer(initialState, bunAction);

      const mainAction = addIngredient(mockMainIngredient);
      state = reducer(state, mainAction);

      const sauceAction = addIngredient(mockSauceIngredient);
      state = reducer(state, sauceAction);

      // Проверяем, что все добавлено
      expect(state.bun).not.toBeNull();
      expect(state.items).toHaveLength(2);

      // Очищаем конструктор
      const clearAction = clearConstructor();
      state = reducer(state, clearAction);

      expect(state.bun).toBeNull();
      expect(state.items).toEqual([]);
      expect(state).toEqual(initialState);
    });
  });
});
