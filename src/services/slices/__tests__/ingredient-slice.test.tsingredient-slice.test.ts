import reducer, { fetchIngredients } from '../ingredient-slice';

describe('Тестирование ingredient-slice', () => {
  const initialState = {
    items: [],
    isLoading: false,
    error: null
  };

  const mockIngredients = [
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
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    }
  ];

  it('должен возвращать начальное состояние при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = reducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  it('должен корректно обрабатывать fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен корректно обрабатывать fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = reducer({ ...initialState, isLoading: true }, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
  });

  it('должен корректно обрабатывать fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      payload: 'Ошибка сервера'
    };
    const state = reducer({ ...initialState, isLoading: true }, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сервера');
  });
});