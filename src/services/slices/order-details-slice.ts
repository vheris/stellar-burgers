import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TOrderDetailsState = {
  isOrderRequestPending: boolean;
  currentOrder: TOrder | null;
  orderError: string | null;
};

const initialState: TOrderDetailsState = {
  isOrderRequestPending: false,
  currentOrder: null,
  orderError: null
};

export const makeOrders = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/makeOrder', async (ids, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ids);
    if (response.order) {
      return { ...response.order, ingredients: ids };
    }
    return rejectWithValue('Не удалось создать заказ');
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    closeOrder(state) {
      state.currentOrder = null;
      state.orderError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeOrders.pending, (state) => {
        state.isOrderRequestPending = true;
        state.orderError = null;
      })
      .addCase(makeOrders.fulfilled, (state, action) => {
        state.isOrderRequestPending = false;
        state.currentOrder = action.payload;
        state.orderError = null;
      })
      .addCase(makeOrders.rejected, (state, action) => {
        state.isOrderRequestPending = false;
        state.orderError = action.payload || 'Не удалось создать заказ';
      });
  }
});

export const { closeOrder } = orderDetailsSlice.actions;
export default orderDetailsSlice.reducer;
