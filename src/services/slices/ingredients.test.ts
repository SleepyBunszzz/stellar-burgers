import reducer, { fetchIngredients } from './ingredients';
import { TIngredient } from '@utils-types';

describe('ingredients reducer', () => {
  const initialState = reducer(undefined, { type: 'unknown' });

  describe('initial state', () => {
    it('should return initial state', () => {
      expect(initialState).toEqual({
        data: [],
        loading: false,
        error: null,
        fetched: false
      });
    });
  });

  describe('fetchIngredients', () => {
    it('should handle pending state', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = reducer(initialState, action);
      
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('should handle fulfilled state', () => {
      const mockIngredients: TIngredient[] = [
        {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
          image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
        },
        {
          _id: '643d69a5c3f7b9001cfa0941',
          name: 'Биокотлета из марсианской Магнолии',
          type: 'main',
          proteins: 420,
          fat: 142,
          carbohydrates: 242,
          calories: 4242,
          price: 424,
          image: 'https://code.s3.yandex.net/react/code/meat-01.png',
          image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
          image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
        },
        {
          _id: '643d69a5c3f7b9001cfa0942',
          name: 'Соус Spicy-X',
          type: 'sauce',
          proteins: 30,
          fat: 20,
          carbohydrates: 40,
          calories: 30,
          price: 90,
          image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
          image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
          image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
        }
      ];
      
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      
      const state = reducer(initialState, action);
      
      expect(state).toEqual({
        loading: false,
        data: mockIngredients,
        fetched: true,
        error: null
      });
    });

    it('should handle rejected state', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Network Error' }
      };
      
      const state = reducer(initialState, action);
      
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Network Error'
      });
    });

    it('should handle rejected state with no error message', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: undefined }
      };
      
      const state = reducer(initialState, action);
      
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Не удалось загрузить ингредиенты'
      });
    });
  });
});