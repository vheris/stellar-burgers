import { getFeedsApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';

export type TOrderState = {
  selectedBun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  isOrderRequestPending: boolean;
  currentOrder: TOrder | null;
  orderError: string | null;
  userOrders: TOrder[];
  isOrdersLoading: boolean;
  ordersError: string | null;
  feedOrders: TOrder[];
  feedTotal: number;
  feedTotalToday: number;
  isFeedLoading: boolean;
  feedError: string | null;
};

const initialState: TOrderState = {
  selectedBun: null,
  ingredients: [],
  isOrderRequestPending: false,
  currentOrder: null,
  orderError: null,
  userOrders: [],
  isOrdersLoading: false,
  ordersError: null,
  feedOrders: [],
  feedTotal: 0,
  feedTotalToday: 0,
  isFeedLoading: false,
  feedError: null
};

export const makeOrders = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/makeOrder', async (ids, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ids);
    if (response.order) {
      return {
        ...response.order,
        ingredients: ids
      };
    }
    return rejectWithValue('Не удалось создать заказ');
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось создать заказ'
    );
  }
});

export const fetchOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('order/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error) {
    return rejectWithValue(
      (error as Error).message || 'Не удалось загрузить историю заказов'
    );
  }
});

export const fetchFeeds = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('order/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (error) {
    return rejectWithValue(
      (error as Error).message || 'Не удалось загрузить ленту заказов'
    );
  }
});

const orderSlice = createSlice({
  name: 'order',
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
      if (
        from < 0 ||
        to < 0 ||
        from >= state.ingredients.length ||
        to >= state.ingredients.length
      ) {
        return;
      }

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
    },
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
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.userOrders = action.payload;
        state.ordersError = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.ordersError =
          action.payload || 'Не удалось загрузить историю заказов';
      })
      .addCase(fetchFeeds.pending, (state) => {
        state.isFeedLoading = true;
        state.feedError = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isFeedLoading = false;
        state.feedOrders = action.payload.orders;
        state.feedTotal = action.payload.total;
        state.feedTotalToday = action.payload.totalToday;
        state.feedError = null;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isFeedLoading = false;
        state.feedError =
          action.payload || 'Не удалось загрузить ленту заказов';
      });
  }
});

export const {
  setBun,
  addIngredient,
  moveIngredient,
  removeIngredient,
  clearConstructor,
  closeOrder
} = orderSlice.actions;

export default orderSlice.reducer;
