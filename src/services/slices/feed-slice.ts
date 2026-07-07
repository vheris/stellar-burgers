import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TFeedState = {
  feedOrders: TOrder[];
  feedTotal: number;
  feedTotalToday: number;
  isFeedLoading: boolean;
  feedError: string | null;
};

const initialState: TFeedState = {
  feedOrders: [],
  feedTotal: 0,
  feedTotalToday: 0,
  isFeedLoading: false,
  feedError: null
};

export const fetchFeeds = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('feed/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isFeedLoading = true;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isFeedLoading = false;
        state.feedOrders = action.payload.orders;
        state.feedTotal = action.payload.total;
        state.feedTotalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isFeedLoading = false;
        state.feedError = action.payload || 'Ошибка';
      });
  }
});
export default feedSlice.reducer;
