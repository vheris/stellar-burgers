import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { makeOrders } from './order-details-slice';

export type TConstructorState = {
  selectedBun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  selectedBun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TConstructorIngredient | null>) {
      state.selectedBun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      state.ingredients.push(action.payload);
    },
    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const ingredients = [...state.ingredients];
      const [movedIngredient] = ingredients.splice(from, 1);
      ingredients.splice(to, 0, movedIngredient);
      state.ingredients = ingredients;
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    clearConstructor(state) {
      state.selectedBun = null;
      state.ingredients = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(makeOrders.fulfilled, (state) => {
      state.selectedBun = null;
      state.ingredients = [];
    });
  }
});

export const {
  setBun,
  addIngredient,
  moveIngredient,
  removeIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
