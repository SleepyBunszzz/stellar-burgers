import { rootReducer } from './root-reducer';

describe('rootReducer', () => {
  it('should properly initialize', () => {
    // Проверяем, что редьюсер возвращает объект с ожидаемыми ключами
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    
    expect(initialState).toEqual({
      ingredients: expect.any(Object),
      user: expect.any(Object),
      orders: expect.any(Object),
      feed: expect.any(Object),
      profileFeed: expect.any(Object),
      burgerConstructor: expect.any(Object)
    });
    
    // Проверяем структуру каждого слайса
    expect(initialState.ingredients).toEqual({
      data: [],
      loading: false,
      error: null,
      fetched: false
    });
    
    expect(initialState.user).toEqual({
      name: null,
      email: null,
      isAuthChecked: false,
      loading: false,
      error: null
    });
    
    expect(initialState.burgerConstructor).toEqual({
      bun: null,
      items: []
    });
  });
});