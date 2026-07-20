import reducer, {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../burger-constructor-slice';
import { makeOrders } from '../order-details-slice'; 

describe('Тестирование burger-constructor-slice', () => {
  const initialState = {
    selectedBun: null,
    ingredients: []
  };

  const mockBun = {
    _id: 'bun1',
    name: 'Булка',
    type: 'bun',
    price: 100,
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    image: '',
    image_large: '',
    image_mobile: '',
    id: 'test-bun-id'
  };

  const mockIngredient1 = {
    ...mockBun,
    _id: 'ing1',
    type: 'main',
    id: 'test-id-1'
  };

  const mockIngredient2 = {
    ...mockBun,
    _id: 'ing2',
    type: 'sauce',
    id: 'test-id-2'
  };

  it('должен возвращать начальное состояние при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN' };
    const state = reducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  it('должен обрабатывать setBun', () => {
    const state = reducer(initialState, setBun(mockBun));
    expect(state.selectedBun).toEqual(mockBun);
  });

  it('должен обрабатывать addIngredient', () => {
    const state = reducer(initialState, addIngredient(mockIngredient1));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockIngredient1);
  });

  it('должен обрабатывать removeIngredient', () => {
    const startState = { ...initialState, ingredients: [mockIngredient1, mockIngredient2] };
    const state = reducer(startState, removeIngredient('test-id-1'));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].id).toBe('test-id-2');
  });

  it('должен обрабатывать moveIngredient', () => {
    const startState = { ...initialState, ingredients: [mockIngredient1, mockIngredient2] };
    const state = reducer(startState, moveIngredient({ from: 0, to: 1 }));
    
    expect(state.ingredients[0].id).toBe('test-id-2');
    expect(state.ingredients[1].id).toBe('test-id-1');
  });

  it('должен обрабатывать clearConstructor', () => {
    const startState = { selectedBun: mockBun, ingredients: [mockIngredient1] };
    const state = reducer(startState, clearConstructor());
    expect(state).toEqual(initialState);
  });

  it('должен очищать конструктор при успешном оформлении заказа (makeOrders.fulfilled)', () => {
    const startState = { selectedBun: mockBun, ingredients: [mockIngredient1] };
    const action = { type: makeOrders.fulfilled.type };
    const state = reducer(startState, action);
    
    expect(state).toEqual(initialState);
  });
});